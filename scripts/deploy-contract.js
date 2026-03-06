#!/usr/bin/env node

/**
 * 部署 X402Payment 合约到 Base 链
 * 使用 Hardhat 部署
 */

import { ethers } from 'ethers';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 配置
const CONFIG = {
  // Base Mainnet RPC
  rpcUrl: 'https://mainnet.base.org',
  // 或者使用 Alchemy/Infura
  // rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/YOUR_KEY',
  
  // 平台费接收地址（替换为实际地址）
  feeRecipient: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  
  // 部署者私钥（从环境变量读取）
  privateKey: process.env.DEPLOYER_PRIVATE_KEY
};

// 合约 ABI（简化版，实际部署时 Hardhat 会生成）
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "_feeRecipient", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "serviceType", "type": "string"},
      {"internalType": "address", "name": "recipient", "type": "address"}
    ],
    "name": "createPayment",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "paymentId", "type": "bytes32"}],
    "name": "completePayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "paymentId", "type": "bytes32"}],
    "name": "getPayment",
    "outputs": [
      {"internalType": "address", "name": "payer", "type": "address"},
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "string", "name": "serviceType", "type": "string"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "bool", "name": "completed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "bytes32", "name": "paymentId", "type": "bytes32"},
      {"indexed": true, "internalType": "address", "name": "payer", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "serviceType", "type": "string"}
    ],
    "name": "PaymentCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "bytes32", "name": "paymentId", "type": "bytes32"},
      {"indexed": true, "internalType": "address", "name": "payer", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "PaymentCompleted",
    "type": "event"
  }
];

/**
 * 部署合约
 */
async function deployContract() {
  console.log('🚀 开始部署 X402Payment 合约到 Base Mainnet...\n');
  
  // 检查配置
  if (!CONFIG.privateKey) {
    console.error('❌ 错误：请设置 DEPLOYER_PRIVATE_KEY 环境变量');
    console.error('   export DEPLOYER_PRIVATE_KEY=your_private_key_here');
    process.exit(1);
  }
  
  // 连接 provider
  const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
  const wallet = new ethers.Wallet(CONFIG.privateKey, provider);
  
  console.log(`📡 连接到 Base Mainnet`);
  console.log(`👛 部署者地址：${wallet.address}`);
  
  // 获取余额
  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 部署者余额：${ethers.formatEther(balance)} ETH\n`);
  
  if (balance === 0n) {
    console.error('❌ 错误：部署者账户余额为 0，请先充值 ETH');
    process.exit(1);
  }
  
  // 读取合约字节码（需要先编译）
  let bytecode;
  try {
    const artifactPath = join(__dirname, '../artifacts/contracts/X402Payment.sol/X402Payment.json');
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf-8'));
    bytecode = artifact.bytecode;
  } catch (error) {
    console.error('❌ 错误：请先编译合约');
    console.error('   运行：npx hardhat compile');
    process.exit(1);
  }
  
  // 创建工厂
  const factory = new ethers.ContractFactory(CONTRACT_ABI, bytecode, wallet);
  
  console.log('⚙️  正在部署合约...');
  console.log('   平台费接收地址:', CONFIG.feeRecipient);
  
  // 部署
  const contract = await factory.deploy(CONFIG.feeRecipient);
  
  console.log('⏳ 等待合约部署确认...');
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();
  
  console.log('\n✅ 合约部署成功！\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📄 合约地址：${contractAddress}`);
  console.log(`🔗 交易哈希：${deploymentTx.hash}`);
  console.log(`🌐 BaseScan: https://basescan.org/address/${contractAddress}`);
  console.log(`🔍 交易详情：https://basescan.org/tx/${deploymentTx.hash}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // 保存部署信息
  const deploymentInfo = {
    network: 'base-mainnet',
    contractAddress,
    deploymentTx: deploymentTx.hash,
    deployedAt: new Date().toISOString(),
    deployer: wallet.address,
    feeRecipient: CONFIG.feeRecipient
  };
  
  const outputPath = join(__dirname, '../deployment-info.json');
  writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log('💾 部署信息已保存到:', outputPath);
  console.log('\n📋 下一步:');
  console.log('   1. 在 BaseScan 上验证合约代码');
  console.log('   2. 更新前端配置中的合约地址');
  console.log('   3. 测试真实支付流程');
  
  return deploymentInfo;
}

/**
 * 验证合约（在 BaseScan 上）
 */
async function verifyContract(contractAddress) {
  console.log('\n🔍 验证合约代码...');
  console.log('   请访问：https://basescan.org/verifyContract');
  console.log(`   合约地址：${contractAddress}`);
  console.log('\n   或使用 Hardhat 插件:');
  console.log('   npx hardhat verify --network baseMainnet', contractAddress, CONFIG.feeRecipient);
}

// 执行部署
if (process.argv[1].includes('deploy-contract')) {
  deployContract()
    .then(info => {
      console.log('\n✨ 部署完成！');
    })
    .catch(error => {
      console.error('\n❌ 部署失败:', error.message);
      process.exit(1);
    });
}

export { deployContract, verifyContract };
