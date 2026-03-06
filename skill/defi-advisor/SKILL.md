# DeFi Advisor Skill

## 描述
AI 驱动的加密市场智能投顾，整合技术分析、市场情绪和链上数据，通过 x402 微支付提供投资建议。

## 功能
- 获取加密货币投资建议（BTC、ETH 等）
- 实时市场价格查询
- 技术分析（29+ 指标）
- 市场情绪分析
- x402 支付集成

## 使用方法

### 1. 获取投资建议
```
调用 defi-advisor/get-advice
参数：
  - coin: 加密货币 ID（bitcoin, ethereum, solana 等）
  - payment_id: x402 支付 ID（可选，用于已支付用户）
```

### 2. 创建支付
```
调用 defi-advisor/create-payment
参数：
  - service_type: 服务类型（singleConsultation, dayPass, monthlySubscription）
```

### 3. 查询价格
```
调用 defi-advisor/get-price
参数：
  - coin: 加密货币 ID
```

## API 端点
- Base URL: https://defi.gekankan.com
- 投资建议：GET /api/advice/:coin
- 创建支付：POST /api/payment/create
- 验证支付：POST /api/payment/verify
- 查询价格：GET /api/price/:coin

## 定价
- 单次咨询：$0.50 USDC
- 日通行证：$5.00 USDC
- 月订阅：$50.00 USDC
- API 访问：$100.00 USDC/月

## 作者
宝哥 (Sebo) - @sebo_luo

## 相关链接
- GitHub: https://github.com/SeboLuo/defi-synthesis-hackathon
- 演示：https://defi.gekankan.com
- x402: https://x402.org
- Base: https://base.org
