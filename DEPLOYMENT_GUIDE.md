# 合约部署指南

## 📋 概述

本文档说明如何将 X402Payment 智能合约部署到 Base 链，实现真实的区块链支付验证。

---

## 🎯 当前状态

### ✅ 已完成
- 智能合约代码：`contracts/X402Payment.sol`
- 部署脚本：`scripts/deploy-contract.js`
- 区块链验证模块：`src/blockchain-verify.js`
- 演示模式：可体验完整流程（无需真实资金）

### ⏳ 待部署
- 合约部署到 Base Mainnet
- 更新前端合约地址配置
- 启用生产模式验证

---

## 🚀 部署步骤

### 1. 前置准备

```bash
# 安装依赖
cd /root/.openclaw/workspace/projects/defi-advisor
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# 初始化 Hardhat
npx hardhat init
# 选择：Create a TypeScript project
```

### 2. 配置 Hardhat

创建/编辑 `hardhat.config.js`:

```javascript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    baseMainnet: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 8453
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 84532
    }
  },
  etherscan: {
    apiKey: {
      baseMainnet: process.env.BASESCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || ""
    }
  }
};

export default config;
```

### 3. 设置环境变量

```bash
# 创建 .env 文件
cat > .env << EOF
# 部署者私钥（不要提交到 Git）
DEPLOYER_PRIVATE_KEY=your_private_key_here

# Base RPC URL（可选）
BASE_RPC_URL=https://mainnet.base.org

# BaseScan API Key（用于合约验证）
BASESCAN_API_KEY=your_basescan_api_key

# 平台费接收地址
FEE_RECIPIENT=0x8ba1f109551bD432803012645Ac136ddd64DBA72
EOF

# 添加到 .gitignore
echo ".env" >> .gitignore
```

### 4. 编译合约

```bash
npx hardhat compile
```

### 5. 部署到 Base Sepolia（测试网）

```bash
# 先部署到测试网验证
npx hardhat run scripts/deploy-contract.js --network baseSepolia
```

### 6. 部署到 Base Mainnet（生产网）

```bash
# 确保账户有足够 ETH
# 部署
npx hardhat run scripts/deploy-contract.js --network baseMainnet
```

### 7. 验证合约

```bash
# 在 BaseScan 上验证
npx hardhat verify --network baseMainnet \
  DEPLOYED_CONTRACT_ADDRESS \
  0x8ba1f109551bD432803012645Ac136ddd64DBA72
```

---

## 📊 部署后配置

### 更新前端配置

编辑 `src/x402-payment.js`:

```javascript
export const PAYMENT_CONTRACTS = {
  'base-mainnet': '0xYOUR_DEPLOYED_CONTRACT_ADDRESS',
  'base-sepolia': '0xTESTNET_CONTRACT_ADDRESS'
};
```

### 启用生产模式

编辑 `.env`:

```bash
USE_BLOCKCHAIN_VERIFICATION=true
PAYMENT_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
```

重启服务:

```bash
pm2 restart defi-advisor --update-env
```

---

## 🧪 测试真实支付

### 1. 创建支付

```javascript
// 前端调用
const response = await fetch('/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceType: 'singleConsultation',
    userId: 'user123'
  })
});

const { paymentRequest } = await response.json();
// paymentRequest.paymentAddress 现在是合约地址
```

### 2. 用户支付

用户使用钱包向合约地址转账：
- 金额：0.5 USDC（或等值 ETH）
- 地址：`0xYOUR_CONTRACT_ADDRESS`
- Memo/数据：paymentId

### 3. 验证支付

```javascript
// 后端验证
const result = await verifyPayment(paymentId, txHash, true); // true = 启用区块链验证

if (result.success) {
  // 支付成功，激活服务
  activateUserAccess(payment);
}
```

---

## 💰 合约功能

### 支付流程

1. **创建支付** - 用户调用 `createPayment()`
2. **资金锁定** - 资金保存在合约中
3. **服务完成** - 服务商调用 `completePayment()`
4. **资金分配** - 98% 给服务商，2% 平台费

### 安全特性

- ✅ 超时退款（1 小时后）
- ✅ 仅服务商可完成支付
- ✅ 平台费自动分配
- ✅ 收益追踪

### 事件日志

```solidity
event PaymentCreated(
    bytes32 indexed paymentId,
    address indexed payer,
    address indexed recipient,
    uint256 amount,
    string serviceType
);

event PaymentCompleted(
    bytes32 indexed paymentId,
    address indexed payer,
    uint256 timestamp
);
```

---

## 📈 Hackathon 提交

### 链上 Artifact

部署后会产生：
- ✅ 合约部署交易
- ✅ PaymentCreated 事件
- ✅ PaymentCompleted 事件
- ✅ 平台费收入记录

### 验证链接

- BaseScan 合约页面
- 部署交易哈希
- 支付事件日志

---

## 🔧 故障排除

### 问题 1: 部署失败

```
Error: insufficient funds for gas * price + value
```

**解决**: 确保部署账户有足够 ETH（建议 0.1 ETH+）

### 问题 2: Gas 费过高

**解决**: 使用 Base Sepolia 测试网先测试

### 问题 3: 合约验证失败

**解决**: 确保编译版本与部署版本一致

---

## 📞 支持

- 文档：`README.md`
- 合约：`contracts/X402Payment.sol`
- 部署脚本：`scripts/deploy-contract.js`
- BaseScan: https://basescan.org

---

**🎯 下一步**: 部署合约到 Base Mainnet，产生真实 x402 交易记录！
