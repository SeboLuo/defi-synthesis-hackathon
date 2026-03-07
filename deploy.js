const hre = require("hardhat");

async function main() {
  console.log("🚀 开始部署 X402Payment 合约到 Base Sepolia...\n");
  
  // Hardhat v2 方式
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  
  console.log(`👛 部署者地址：${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 部署者余额：${hre.ethers.formatEther(balance)} ETH\n`);
  
  if (balance === 0n) {
    console.error('❌ 错误：部署者账户余额为 0');
    console.error('   请领取测试网 ETH: https://faucet.base.org');
    process.exit(1);
  }
  
  // 部署合约
  console.log("⚙️  正在部署合约...");
  const X402Payment = await hre.ethers.getContractFactory("X402Payment");
  const feeRecipient = deployer.address;
  
  const contract = await X402Payment.deploy(feeRecipient);
  console.log("⏳ 等待合约部署确认...");
  
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
  const fs = require('fs');
  const path = require('path');
  
  const deploymentInfo = {
    network: 'baseSepolia',
    chainId: 84532,
    contractAddress,
    deploymentTx: deploymentTx.hash,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    feeRecipient
  };
  
  const outputPath = path.join(__dirname, 'deployment-info.json');
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log('💾 部署信息已保存到:', outputPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
