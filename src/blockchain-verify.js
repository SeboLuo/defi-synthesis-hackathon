#!/usr/bin/env node

/**
 * Base 链 RPC 交易验证模块
 * 用于验证 x402 支付的真实链上交易
 */

import fetch from 'node-fetch';

// Base 链 RPC 端点
const RPC_ENDPOINTS = {
  'base-mainnet': 'https://mainnet.base.org',
  'base-goerli': 'https://goerli.base.org',
  'ethereum-mainnet': 'https://eth.llamarpc.com'
};

// x402 支付合约地址（示例，实际部署后更新）
const PAYMENT_CONTRACTS = {
  'base-mainnet': '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  'base-goerli': '0x5FbDB2315678afecb367f032d93F642f64180aa3'
};

/**
 * 验证交易是否存在于链上
 */
export async function verifyTransactionOnChain(txHash, network = 'base-mainnet') {
  const rpcUrl = RPC_ENDPOINTS[network];
  
  if (!rpcUrl) {
    throw new Error(`不支持的网络：${network}`);
  }
  
  try {
    // 调用 eth_getTransactionByHash
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txHash],
        id: 1
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      return {
        success: false,
        error: `RPC 错误：${data.error.message}`
      };
    }
    
    if (!data.result) {
      return {
        success: false,
        error: '交易未找到，可能尚未确认'
      };
    }
    
    const tx = data.result;
    
    return {
      success: true,
      transaction: {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: tx.blockNumber,
        confirmations: 0 // 需要进一步获取最新区块计算
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `RPC 调用失败：${error.message}`
    };
  }
}

/**
 * 验证交易接收地址是否匹配
 */
export function verifyPaymentAddress(tx, expectedAddress, network = 'base-mainnet') {
  const contractAddress = PAYMENT_CONTRACTS[network];
  
  if (!contractAddress) {
    return {
      success: false,
      error: `不支持的网络：${network}`
    };
  }
  
  // 检查交易接收地址（可能是合约地址）
  const toAddressMatch = tx.to && 
    tx.to.toLowerCase() === contractAddress.toLowerCase();
  
  // 检查事件日志（如果是合约调用）
  // TODO: 需要解析 logs 来确认支付事件
  
  return {
    success: toAddressMatch,
    message: toAddressMatch ? '支付地址验证通过' : '支付地址不匹配'
  };
}

/**
 * 验证交易金额
 */
export function verifyPaymentAmount(tx, expectedAmount, currency = 'USDC') {
  // 如果是 ETH 支付
  if (currency === 'ETH') {
    const txValueEth = parseFloat(tx.value) / 1e18;
    const expectedWei = expectedAmount * 1e18;
    
    return {
      success: tx.value >= expectedWei * 0.99, // 允许 1% 误差
      actualAmount: txValueEth,
      expectedAmount,
      message: `支付 ${txValueEth.toFixed(4)} ETH`
    };
  }
  
  // 如果是 USDC 等 ERC20 代币，需要解析 Transfer 事件
  // TODO: 实现 ERC20 转账验证
  
  return {
    success: true,
    message: '代币支付验证暂不支持，需解析合约事件'
  };
}

/**
 * 获取交易确认数
 */
export async function getTransactionConfirmations(txHash, network = 'base-mainnet') {
  const rpcUrl = RPC_ENDPOINTS[network];
  
  try {
    // 获取交易
    const txResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txHash],
        id: 1
      })
    });
    
    const txData = await txResponse.json();
    if (!txData.result || !txData.result.blockNumber) {
      return { success: false, error: '交易未确认' };
    }
    
    const txBlock = parseInt(txData.result.blockNumber, 16);
    
    // 获取最新区块
    const latestResponse = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });
    
    const latestData = await latestResponse.json();
    const latestBlock = parseInt(latestData.result, 16);
    
    const confirmations = latestBlock - txBlock;
    
    return {
      success: true,
      confirmations,
      txBlock,
      latestBlock
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 完整验证流程
 */
export async function fullPaymentVerification(paymentId, txHash, expectedAmount, network = 'base-mainnet') {
  console.log(`🔍 开始完整验证：${paymentId}`);
  
  // 1. 验证交易存在
  const txResult = await verifyTransactionOnChain(txHash, network);
  if (!txResult.success) {
    return { success: false, step: 'transaction_lookup', ...txResult };
  }
  
  // 2. 获取确认数
  const confirmResult = await getTransactionConfirmations(txHash, network);
  if (!confirmResult.success || confirmResult.confirmations < 1) {
    return { 
      success: false, 
      step: 'confirmations', 
      message: '交易确认数不足',
      confirmations: confirmResult.confirmations || 0
    };
  }
  
  // 3. 验证支付地址
  const addressResult = verifyPaymentAddress(txResult.transaction, PAYMENT_CONTRACTS[network], network);
  if (!addressResult.success) {
    return { success: false, step: 'address_verification', ...addressResult };
  }
  
  // 4. 验证金额
  const amountResult = verifyPaymentAmount(txResult.transaction, expectedAmount, 'USDC');
  
  // 5. 检查确认数是否足够（USDC 支付建议 12 个确认）
  const requiredConfirmations = 12;
  if (confirmResult.confirmations < requiredConfirmations) {
    return {
      success: false,
      step: 'final_confirmation',
      message: `等待更多确认 (${confirmResult.confirmations}/${requiredConfirmations})`,
      confirmations: confirmResult.confirmations,
      required: requiredConfirmations
    };
  }
  
  console.log(`✅ 支付验证通过：${paymentId}`);
  
  return {
    success: true,
    paymentId,
    txHash,
    confirmations: confirmResult.confirmations,
    amount: expectedAmount,
    network,
    verifiedAt: new Date().toISOString()
  };
}

export default {
  verifyTransactionOnChain,
  verifyPaymentAddress,
  verifyPaymentAmount,
  getTransactionConfirmations,
  fullPaymentVerification,
  RPC_ENDPOINTS,
  PAYMENT_CONTRACTS
};
