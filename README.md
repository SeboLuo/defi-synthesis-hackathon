# DeFi 智能投顾 Agent 🤖💰

> 基于 RAG 的加密市场智能投顾系统  
> 参加 **The Synthesis Hackathon 2026**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Base](https://img.shields.io/badge/Chain-Base-0052FF)](https://base.org)
[![ERC-8004](https://img.shields.io/badge/Identity-ERC--8004-purple)](https://eips.ethereum.org/EIPS/eip-8004)

---

## 🎯 项目简介

**DeFi 智能投顾 Agent** 是一个 AI 驱动的投资顾问系统，整合：

- 📊 **链上数据** - DeFi 协议、交易量、TVL 实时追踪
- 📰 **新闻情绪** - 加密媒体 + 社交媒体情绪分析
- 📈 **技术分析** - 29+ 指标 (BB, Ichimoku, RSI, MACD)
- 💰 **x402 支付** - 按次付费获取投资建议 ($0.10-1.00/次)

---

## ✨ 核心功能

### 1. 智能投资咨询
- 基于 RAG 的知识库问答
- 实时市场数据分析
- 多源信息融合（链上 + 新闻 + 技术面）
- 投资建议置信度评分

### 2. x402 微支付
- 按次付费咨询
- 订阅制无限访问
- API 访问授权
- 自动收入分配

### 3. 多渠道访问
- Web Dashboard
- Telegram Bot
- REST API
- (未来) Discord Bot

---

## 🛠️ 技术架构

### 已安装技能
| 技能 | 用途 | 状态 |
|------|------|------|
| `crypto-ta-analyzer` | 技术分析 (29+ 指标) | ✅ 已安装 |
| `trading-strategist` | 交易策略生成 | ✅ 已安装 |
| `crypto-report` | 加密市场报告 | ✅ 已安装 |
| `yahoo-finance` | 传统金融数据 | ✅ 已安装 |
| `finance-expert` | 金融系统知识 | ✅ 已安装 |

### 待安装技能
| 技能 | 用途 | 优先级 |
|------|------|--------|
| `ai-rag-pipeline` | RAG 知识库 | 🔴 高 |
| `api-gateway` | API 网关 | 🟡 中 |
| `secure-api-calls` | 安全 API 调用 | 🟡 中 |

### 数据源
- **链上**: Etherscan, Dune Analytics, DeFiPulse
- **市场**: CoinGecko, Binance, Yahoo Finance
- **新闻**: CoinDesk, Cointelegraph, The Block
- **社交**: Twitter, Reddit

---

## 🚀 快速开始

### 前置条件
```bash
- Node.js 22+
- OpenClaw 2026.2+
- Base Mainnet 钱包
- API Keys (CoinGecko, Etherscan 等)
```

### 安装
```bash
# 克隆项目
git clone https://github.com/your-username/defi-advisor-agent.git
cd defi-advisor-agent

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 API keys

# 启动服务
npm start
```

### 使用示例

#### Web 界面
访问 `http://localhost:3000`

#### API 调用
```bash
# 获取投资建议 (需要 x402 支付)
curl -X POST https://api.defi-advisor.com/consult \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "X-Payment: x402-xxx" \
  -d '{"question": "ETH 现在值得买入吗？"}'
```

#### Telegram Bot
发送 `/start` 开始对话

---

## 💰 定价策略

| 服务 | 价格 | 说明 |
|------|------|------|
| 单次咨询 | $0.50 | 一次投资问题解答 |
| 日通行证 | $5.00 | 24 小时无限咨询 |
| 月订阅 | $50.00 | 30 天无限咨询 + 优先支持 |
| API 访问 | $100.00 | 每月 10,000 次 API 调用 |
| 机构版 | 联系销售 | 定制解决方案 |

所有支付通过 **x402 协议** 处理，支持：
- 💳 信用卡
- 🪙 加密货币 (ETH, USDC)
- ⚡ Lightning Network

---

## 📊 项目进度

### Phase 1: 基础搭建 (3 月 5-7 日)
- [x] ✅ Hackathon 注册
- [x] ✅ 项目规划
- [ ] ⏳ 技能安装
- [ ] ⏳ GitHub 仓库创建

### Phase 2: 数据层 (3 月 8-10 日)
- [ ] ⬜ 链上数据集成
- [ ] ⬜ 新闻源接入
- [ ] ⬜ 市场数据 API

### Phase 3: AI 核心 (3 月 11-13 日)
- [ ] ⬜ RAG 实现
- [ ] ⬜ 情绪分析
- [ ] ⬜ 建议生成

### Phase 4: x402 集成 (3 月 14-15 日)
- [ ] ⬜ 支付网关
- [ ] ⬜ 定价实现
- [ ] ⬜ 验证逻辑

### Phase 5: 界面与测试 (3 月 16-18 日)
- [ ] ⬜ Web Dashboard
- [ ] ⬜ Telegram Bot
- [ ] ⬜ 测试套件

### Phase 6: 部署提交 (3 月 19-20 日)
- [ ] ⬜ 生产部署
- [ ] ⬜ 性能优化
- [ ] ⬜ Hackathon 提交

---

## 🏆 Hackathon 目标

### 评分标准对齐
- ✅ **链上身份**: ERC-8004 已注册
- 🎯 **链上 artifact**: 目标 5+ (x402 交易、合约等)
- 🎯 **x402 交易**: 目标 50+ 笔
- 🎯 **人机协作**: 完整 conversation log
- 🎯 **开源质量**: MIT License, 完整文档

### 演示目标
- [ ] 实时投资咨询演示
- [ ] x402 支付流程展示
- [ ] 多数据源整合展示
- [ ] 人机协作案例

---

## 👥 团队

- **小黑** - AI Agent (主开发者)
  - [ERC-8004](https://basescan.org/tx/0x137b5041fa6d006cd6b07af94efd24f76259ea209074ce4fcf9fb7bb1a3b0dd7)
  - Participant ID: `9d76d5eba3b142148075df018a08d33d`

- **Sebo** - Human Partner
  - Twitter: [@sebo_luo](https://twitter.com/sebo_luo)
  - Background: 技术总监，RWA 领域

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🔗 相关链接

- [The Synthesis Hackathon](https://synthesis.devfolio.co)
- [x402 协议](https://x402.org)
- [Base 链](https://base.org)
- [项目文档](docs/PROJECT_PLAN.md)

---

**🚀 建设中...** 

*最后更新：2026-03-05*
