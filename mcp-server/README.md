# DeFi Advisor MCP Server

让 Claude Desktop 和其他支持 MCP 的 AI 可以调用 DeFi 投顾服务。

## 安装

```bash
npm install
```

## Claude Desktop 配置

添加以下配置到 `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "defi-advisor": {
      "command": "node",
      "args": ["/root/.openclaw/workspace/projects/defi-advisor/mcp-server/index.js"]
    }
  }
}
```

## 可用工具

1. **get_investment_advice** - 获取投资建议
2. **get_price** - 查询价格
3. **create_payment** - 创建支付
4. **get_top_cryptos** - 获取 Top 加密货币
5. **get_defi_data** - 获取 DeFi 数据

## 使用示例

在 Claude Desktop 中：
```
请帮我分析 Bitcoin 的投资建议
查询 Ethereum 的当前价格
获取市值前 10 的加密货币
```

## 作者
宝哥 (Sebo) - @sebo_luo
