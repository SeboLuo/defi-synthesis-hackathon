#!/usr/bin/env node

/**
 * DeFi Advisor - API 服务
 * 提供 HTTP API 接口
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateInvestmentAdvice, formatAdvice } from './advisor.js';
import { getCryptoPrice, getTopCryptos, getDeFiData } from './data-fetcher.js';
import { 
  createPaymentRequest, 
  verifyPayment, 
  x402Middleware,
  PRICING,
  getPaymentStatus 
} from './x402-payment.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// 静态文件服务
app.use(express.static(join(__dirname, '../public')));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'DeFi Advisor API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// x402 定价信息
app.get('/api/pricing', (req, res) => {
  res.json({
    success: true,
    pricing: PRICING,
    supportedNetworks: ['base-mainnet', 'ethereum-mainnet'],
    acceptedTokens: ['USDC', 'ETH']
  });
});

// 创建支付请求
app.post('/api/payment/create', async (req, res) => {
  try {
    const { serviceType, userId } = req.body;
    
    if (!serviceType) {
      return res.status(400).json({
        success: false,
        error: '缺少 serviceType 参数'
      });
    }
    
    const result = createPaymentRequest(serviceType, userId || 'anonymous');
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// 验证支付
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { paymentId, txHash } = req.body;
    
    if (!paymentId || !txHash) {
      return res.status(400).json({
        success: false,
        error: '缺少 paymentId 或 txHash 参数'
      });
    }
    
    const result = await verifyPayment(paymentId, txHash);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 查询支付状态
app.get('/api/payment/:paymentId', (req, res) => {
  const result = getPaymentStatus(req.params.paymentId);
  res.json(result);
});

// 获取投资建议（需要 x402 支付）
app.get('/api/advice/:coin', x402Middleware('singleConsultation'), async (req, res) => {
  try {
    const { coin } = req.params;
    const advice = await generateInvestmentAdvice(coin);
    
    if (!advice.success) {
      return res.status(400).json(advice);
    }
    
    // 附加支付信息
    res.json({
      ...advice,
      payment: {
        paymentId: req.x402Payment.paymentId,
        serviceType: req.x402Payment.serviceType
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 获取价格
app.get('/api/price/:coin', async (req, res) => {
  try {
    const { coin } = req.params;
    const price = await getCryptoPrice(coin);
    res.json(price);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 获取 Top N 加密货币
app.get('/api/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const top = await getTopCryptos(limit);
    res.json(top);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 获取 DeFi 数据
app.get('/api/defi', async (req, res) => {
  try {
    const defi = await getDeFiData();
    res.json(defi);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 首页（重定向到 Dashboard）
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DeFi Advisor API 运行在 http://localhost:${PORT}`);
  console.log(`📊 健康检查：http://localhost:${PORT}/health`);
  console.log(`💡 投资建议：http://localhost:${PORT}/api/advice/bitcoin`);
});
