# 🏆 The Synthesis Hackathon 2026 - 项目演示指南

## 🌐 在线演示地址

**https://defi.gekankan.com**

---

## 🎯 演示流程（给裁判）

### 第一步：访问 Dashboard
打开浏览器访问 https://defi.gekankan.com

你将看到：
- 🎨 精美的渐变色 UI
- 🏆 Hackathon 标识
- 💰 四种定价方案展示
- ✨ 核心功能介绍

### 第二步：体验 x402 支付流程

1. **选择加密货币**
   - 从下拉菜单选择（BTC、ETH、SOL 等）

2. **创建支付请求**
   - 点击 "💳 创建支付请求" 按钮
   - 系统会生成一个支付 ID 和 Base 链支付地址
   - 显示需要支付 $0.50 USDC

3. **模拟支付**
   - 演示模式下，输入任意有效的交易哈希（如 `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`）
   - 点击 "✅ 确认支付"
   - 系统验证支付（演示模式会快速通过）

4. **获取投资建议**
   - 支付成功后，"📊 获取 AI 投资建议" 按钮变为可用
   - 点击获取针对所选币种的投资建议
   - 显示：
     - 当前价格、24h 涨跌幅
     - 市值、成交量
     - **AI 建议**（买入/卖出/持有）
     - 置信度评分
     - 分析理由
     - 市场情绪

### 第三步：探索 API（可选）

访问以下免费接口：
- https://defi.gekankan.com/api/price/bitcoin - BTC 价格
- https://defi.gekankan.com/api/top?limit=10 - Top 10 加密货币
- https://defi.gekankan.com/api/defi - DeFi 市场数据
- https://defi.gekankan.com/api/pricing - 定价信息

---

## 📊 技术亮点

### 1. x402 支付协议实现
- ✅ 支付请求创建 (`POST /api/payment/create`)
- ✅ 支付验证 (`POST /api/payment/verify`)
- ✅ 支付状态查询 (`GET /api/payment/:id`)
- ✅ 支付中间件（保护付费接口）

### 2. 定价策略
| 服务 | 价格 | 说明 |
|------|------|------|
| 单次咨询 | $0.50 USDC | 一次投资问题解答 |
| 日通行证 | $5.00 USDC | 24 小时无限咨询 |
| 月订阅 | $50.00 USDC | 30 天无限咨询 |
| API 访问 | $100.00 USDC | 每月 10,000 次调用 |

### 3. 数据持久化
- SQLite 数据库存储所有支付记录
- 用户访问权限管理
- 自动清理过期记录

### 4. 区块链验证（可选）
- Base 链 RPC 集成
- 交易确认数验证
- 支付地址验证

---

## 🏗️ 架构概览

```
用户浏览器
    ↓
Caddy (HTTPS 终止，自动 SSL)
    ↓
PM2 (2 实例集群模式)
    ↓
Express.js API 服务器
    ↓
├── Web Dashboard (静态文件)
├── x402 支付验证
├── 投资建议生成
├── CoinGecko API (市场数据)
└── SQLite (数据持久化)
```

---

## 📁 Hackathon 提交清单

### ✅ 已完成
- [x] x402 支付协议完整实现
- [x] 四种定价策略
- [x] Web Dashboard（可交互演示）
- [x] REST API（开发者友好）
- [x] 生产环境部署（https://defi.gekankan.com）
- [x] SQLite 数据持久化
- [x] Base 链 RPC 集成代码
- [x] 支付中间件（保护付费接口）

### ⏳ 待完成（可选）
- [ ] 真实 Base 链交易（需要部署智能合约）
- [ ] Telegram Bot
- [ ] 50+ 真实 x402 交易记录

---

## 🧪 测试用例

### 测试 1：免费接口
```bash
curl https://defi.gekankan.com/api/price/ethereum
# 应该返回 ETH 价格数据
```

### 测试 2：创建支付
```bash
curl -X POST https://defi.gekankan.com/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{"serviceType":"singleConsultation"}'
# 应该返回支付 ID 和支付地址
```

### 测试 3：付费接口（无支付）
```bash
curl https://defi.gekankan.com/api/advice/bitcoin
# 应该返回 402 Payment Required
```

### 测试 4：付费接口（有支付）
```bash
curl https://defi.gekankan.com/api/advice/bitcoin \
  -H "X-Payment: x402 <payment_id>"
# 应该返回投资建议
```

---

## 💡 演示技巧

1. **强调 x402 优势**
   - 无需注册账户
   - 无需 KYC
   - 即时访问
   - 微支付（$0.50 起）

2. **对比传统支付**
   - 传统：注册 → 绑卡 → 充值 → 消费（5 步）
   - x402：支付 → 消费（2 步）

3. **展示技术深度**
   - 数据库设计（支付记录、用户权限）
   - 中间件模式（可扩展）
   - 集群部署（高可用）

4. **商业模式**
   - 单次付费：适合偶尔用户
   - 订阅制：适合活跃用户
   - API 访问：适合开发者

---

## 📞 联系信息

- **GitHub**: [项目仓库](https://github.com)
- **演示**: https://defi.gekankan.com
- **x402**: https://x402.org
- **Base**: https://base.org

---

**🚀 准备就绪，随时可以演示给裁判！**
