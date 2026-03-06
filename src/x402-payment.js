#!/usr/bin/env node

/**
 * x402 支付协议实现
 * 支持按次付费、订阅制、API 访问授权
 */

import crypto from 'crypto';
import { 
  savePayment, 
  getPayment, 
  updatePaymentStatus, 
  checkUserAccess as dbCheckUserAccess,
  activateUserAccess,
  incrementUsage,
  db
} from './database.js';
import { fullPaymentVerification } from './blockchain-verify.js';

// 定价策略
export const PRICING = {
  // 按次咨询
  singleConsultation: {
    price: 0.50,  // USD
    currency: 'USDC',
    description: '单次投资建议咨询'
  },
  
  // 日通行证
  dayPass: {
    price: 5.00,
    currency: 'USDC',
    duration: 24 * 60 * 60 * 1000, // 24 小时
    description: '24 小时无限咨询'
  },
  
  // 月订阅
  monthlySubscription: {
    price: 50.00,
    currency: 'USDC',
    duration: 30 * 24 * 60 * 60 * 1000, // 30 天
    description: '30 天无限咨询 + 优先支持'
  },
  
  // API 访问
  apiAccess: {
    price: 100.00,
    currency: 'USDC',
    duration: 30 * 24 * 60 * 60 * 1000,
    requestLimit: 10000, // 每月 10,000 次
    description: '每月 10,000 次 API 调用'
  }
};

/**
 * 生成支付请求
 */
export function createPaymentRequest(serviceType, userId) {
  const pricing = PRICING[serviceType];
  if (!pricing) {
    throw new Error(`未知的服务类型：${serviceType}`);
  }
  
  const paymentId = `x402_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 分钟有效期
  
  const paymentRequest = {
    paymentId,
    serviceType,
    userId,
    amount: pricing.price,
    currency: pricing.currency,
    description: pricing.description,
    expiresAt,
    status: 'pending',
    // x402 支付地址（示例，实际应使用真实合约地址）
    paymentAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    network: 'base-mainnet',
    // 支付验证所需数据
    metadata: {
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    },
    requestLimit: pricing.requestLimit || null
  };
  
  // 保存到数据库
  savePayment(paymentRequest);
  
  return {
    success: true,
    paymentRequest: {
      ...paymentRequest,
      // 不返回敏感信息
      paymentAddress: paymentRequest.paymentAddress,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency
    },
    // x402 支付头格式
    x402Header: `x402 ${paymentId}`,
    instructions: `请发送 ${pricing.price} ${pricing.currency} 到 ${paymentRequest.paymentAddress} (Base 链)`
  };
}

/**
 * 验证支付
 * @param {string} paymentId - 支付 ID
 * @param {string} txHash - 交易哈希
 * @param {boolean} useBlockchain - 是否使用区块链验证（默认 false，演示模式）
 * @returns {Promise<object>} 验证结果
 */
export async function verifyPayment(paymentId, txHash, useBlockchain = false) {
  const payment = getPayment(paymentId);
  
  if (!payment) {
    return {
      success: false,
      error: '支付请求不存在'
    };
  }
  
  if (payment.status === 'completed') {
    return {
      success: false,
      error: '支付已完成'
    };
  }
  
  if (Date.now() > payment.expiresAt) {
    updatePaymentStatus(paymentId, 'expired');
    return {
      success: false,
      error: '支付请求已过期'
    };
  }
  
  console.log(`🔍 验证支付：${paymentId}, 交易：${txHash}, 区块链验证：${useBlockchain}`);
  
  let isValid = false;
  
  if (useBlockchain && txHash) {
    // 使用区块链验证（生产环境）
    const verification = await fullPaymentVerification(
      paymentId, 
      txHash, 
      payment.amount, 
      payment.network
    );
    isValid = verification.success;
    
    if (!isValid) {
      return {
        success: false,
        error: verification.message || verification.error,
        details: verification
      };
    }
  } else if (txHash) {
    // 演示模式：只验证格式
    await new Promise(resolve => setTimeout(resolve, 500));
    isValid = txHash.startsWith('0x') && txHash.length === 66;
    
    if (!isValid) {
      return {
        success: false,
        error: '交易哈希格式不正确，应为 0x 开头的 66 位字符'
      };
    }
  } else {
    return {
      success: false,
      error: '请提供交易哈希'
    };
  }
  
  if (isValid) {
    // 更新支付状态
    const completedAt = Date.now();
    const pricing = PRICING[payment.serviceType];
    const validUntil = pricing.duration ? completedAt + pricing.duration : null;
    
    updatePaymentStatus(paymentId, 'completed', {
      txHash,
      completedAt,
      validUntil
    });
    
    // 激活用户访问权限
    activateUserAccess({
      ...payment,
      status: 'completed',
      txHash,
      completedAt,
      validUntil
    });
    
    console.log(`✅ 支付验证成功：${paymentId}`);
    
    return {
      success: true,
      paymentId,
      serviceType: payment.serviceType,
      validUntil,
      txHash,
      message: '支付成功，服务已激活',
      demoMode: !useBlockchain
    };
  }
  
  return {
    success: false,
    error: '交易验证失败'
  };
}

/**
 * 检查用户是否有有效服务
 */
export function checkUserAccess(userId, serviceType) {
  return dbCheckUserAccess(userId, serviceType);
}

/**
 * x402 支付中间件（用于 Express）
 */
export function x402Middleware(serviceType = 'singleConsultation') {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const x402Header = req.headers['x-payment'] || req.headers['x-x402'];
    
    // 提取支付 ID
    let paymentId = null;
    if (x402Header && x402Header.startsWith('x402 ')) {
      paymentId = x402Header.substring(5);
    }
    
    // 尝试从 Authorization 头提取
    if (!paymentId && authHeader.startsWith('Bearer x402-')) {
      paymentId = authHeader.substring(12);
    }
    
    if (!paymentId) {
      // 返回 402 Payment Required
      return res.status(402).json({
        success: false,
        error: 'Payment Required',
        code: 'PAYMENT_REQUIRED',
        x402: {
          required: true,
          serviceType,
          pricing: PRICING[serviceType],
          message: '需要 x402 支付才能访问此服务'
        }
      });
    }
    
    // 从数据库获取支付记录
    const payment = getPayment(paymentId);
    
    if (!payment) {
      return res.status(402).json({
        success: false,
        error: 'Invalid Payment',
        code: 'INVALID_PAYMENT',
        x402: {
          required: true,
          message: '支付 ID 无效'
        }
      });
    }
    
    if (payment.status !== 'completed') {
      return res.status(402).json({
        success: false,
        error: 'Payment Pending',
        code: 'PAYMENT_PENDING',
        x402: {
          required: true,
          status: payment.status,
          message: '支付尚未完成'
        }
      });
    }
    
    if (payment.validUntil && Date.now() > payment.validUntil) {
      return res.status(402).json({
        success: false,
        error: 'Payment Expired',
        code: 'PAYMENT_EXPIRED',
        x402: {
          required: true,
          message: '支付已过期，请重新支付'
        }
      });
    }
    
    // 对于 API 访问，增加使用计数
    if (serviceType === 'apiAccess') {
      incrementUsage(payment.userId, serviceType);
      
      const access = checkUserAccess(payment.userId, serviceType);
      if (!access.hasAccess) {
        return res.status(402).json({
          success: false,
          error: 'API Limit Exceeded',
          code: 'LIMIT_EXCEEDED',
          x402: {
            required: true,
            used: access.used,
            limit: access.limit,
            message: '已达到 API 调用限额'
          }
        });
      }
    }
    
    // 支付验证通过，继续处理请求
    req.x402Payment = {
      paymentId,
      serviceType,
      userId: payment.userId
    };
    
    next();
  };
}

/**
 * 获取支付状态
 */
export function getPaymentStatus(paymentId) {
  const payment = getPayment(paymentId);
  
  if (!payment) {
    return {
      success: false,
      error: '支付请求不存在'
    };
  }
  
  return {
    success: true,
    payment: {
      paymentId: payment.paymentId,
      serviceType: payment.serviceType,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.timestamp,
      expiresAt: payment.expiresAt,
      validUntil: payment.validUntil,
      txHash: payment.txHash,
      network: payment.network
    }
  };
}

/**
 * 清理过期的支付请求（定期调用）
 */
export function cleanupExpiredPayments() {
  const now = Date.now();
  let cleaned = 0;
  
  // 更新过期支付状态
  const stmt = db.prepare(`
    UPDATE payments SET status = 'expired' 
    WHERE status = 'pending' AND expires_at < ?
  `);
  const result = stmt.run(now);
  cleaned = result.changes;
  
  if (cleaned > 0) {
    console.log(`🧹 清理了 ${cleaned} 个过期支付请求`);
  }
  
  return cleaned;
}

// 默认导出
export default {
  PRICING,
  createPaymentRequest,
  verifyPayment,
  checkUserAccess,
  x402Middleware,
  getPaymentStatus,
  cleanupExpiredPayments
};
