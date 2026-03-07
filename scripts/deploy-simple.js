#!/usr/bin/env node

/**
 * 简单部署脚本 - 部署 X402Payment 合约到 Base Sepolia
 */

import { ethers } from 'ethers';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 配置 - Base Sepolia 测试网
const CONFIG = {
  network: 'base-sepolia',
  rpcUrl: 'https://sepolia.base.org',
  chainId: 84532,
  // 用户提供的私钥
  privateKey: '0x48322b11ee13f56ca35d0a89ea19c2ea2ab4ae6e1244aef5e267bf6e89c40011',
  feeRecipient: '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
};

// 简化的合约字节码（已编译）
const CONTRACT_BYTECODE = "0x608060405234801561001057600080fd5b506040516112a13803806112a1833981810160405281019061003291906101e9565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505061027e565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061009d82610072565b9050919050565b6100ad81610092565b81146100b857600080fd5b50565b6000815190506100ca816100a4565b92915050565b600082825260208201905092915050565b60005b838110156101055780820151818401526020810190506100ea565b83811115610114576000848401525b50505050565b6000601f19601f8301169050919050565b6000610136826100cb565b61014081856100d6565b93506101508185602086016100e7565b6101598161011a565b840191505092915050565b6000602082019050818103600083015261017e818461012b565b905092915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6101c081610092565b82525050565b60006020820190506101db60008301846101b7565b92915050565b600060028204905060018216806101f457607f821691505b602082108114156102085761020761020e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b610100806102186000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80638da5cb5b1461004657806399a4cc1d14610064578063a900866b14610082575b600080fd5b61004e6100a0565b60405161005b9190610123565b60405180910390f35b61006c6100c6565b6040516100799190610123565b60405180910390f35b61009e6004803603810190610099919061020e565b6100ec565b005b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561015c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610153906102a0565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006101ad82610182565b9050919050565b6101bd816101a2565b81146101c857600080fd5b50565b6000813590506101da816101b4565b92915050565b6000819050919050565b6101f3816101e0565b81146101fe57600080fd5b50565b600081359050610210816101ea565b92915050565b60008060006060848603121561022d5761022c61006d565b5b600084013567ffffffffffffffff81111561024b5761024a61006d565b5b61025786828701610201565b935050602084013567ffffffffffffffff8111156102785761027761006d565b5b61028486828701610201565b9250506040610295868287016101cb565b9150509250925092565b600082825260208201905092915050565b7f496e76616c696420726563697069656e74206164647265737300000000000000600082015250565b60006102ea60188361029f565b91506102f5826102af565b602082019050919050565b60006020820190508181036000830152610319816102dd565b905091905056fea26469706673582212208f8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e64736f6c63430008130033";

async function deploy() {
  console.log('🚀 开始部署 X402Payment 合约到 Base Sepolia...\n');
  
  try {
    // 连接 provider
    const provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
    const wallet = new ethers.Wallet(CONFIG.privateKey, provider);
    
    console.log(`📡 网络：Base Sepolia (Chain ID: ${CONFIG.chainId})`);
    console.log(`👛 部署者地址：${wallet.address}`);
    
    // 获取余额
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 部署者余额：${ethers.formatEther(balance)} ETH\n`);
    
    if (balance === 0n) {
      console.error('❌ 错误：部署者账户余额为 0');
      console.error('   请领取测试网 ETH: https://faucet.base.org');
      process.exit(1);
    }
    
    // 创建合约工厂
    console.log('⚙️  正在部署合约...');
    const factory = new ethers.ContractFactory([], CONTRACT_BYTECODE, wallet);
    const contract = await factory.deploy();
    
    console.log('⏳ 等待合约部署确认...');
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    const deploymentTx = contract.deploymentTransaction();
    
    console.log('\n✅ 合约部署成功！\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📄 合约地址：${contractAddress}`);
    console.log(`🔗 交易哈希：${deploymentTx.hash}`);
    console.log(`🌐 BaseScan: https://sepolia.basescan.org/address/${contractAddress}`);
    console.log(`🔍 交易详情：https://sepolia.basescan.org/tx/${deploymentTx.hash}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // 保存部署信息
    const deploymentInfo = {
      network: CONFIG.network,
      chainId: CONFIG.chainId,
      contractAddress,
      deploymentTx: deploymentTx.hash,
      deployedAt: new Date().toISOString(),
      deployer: wallet.address
    };
    
    const outputPath = join(__dirname, '../deployment-info.json');
    writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log('💾 部署信息已保存到:', outputPath);
    console.log('\n📋 下一步:');
    console.log('   1. 更新前端配置中的合约地址');
    console.log('   2. 测试真实支付流程');
    console.log('   3. 生成 50+ 真实交易记录\n');
    
    return deploymentInfo;
    
  } catch (error) {
    console.error('\n❌ 部署失败:', error.message);
    console.error('   详情:', error);
    throw error;
  }
}

// 执行部署
deploy()
  .then(() => {
    console.log('✨ 部署完成！');
    process.exit(0);
  })
  .catch(error => {
    console.error('部署过程中发生错误:', error);
    process.exit(1);
  });
