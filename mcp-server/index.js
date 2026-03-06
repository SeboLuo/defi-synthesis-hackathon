#!/usr/bin/env node

/**
 * DeFi Advisor MCP Server
 * 让 Claude Desktop 和其他 MCP 客户端可以调用 DeFi 投顾服务
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const BASE_URL = 'https://defi.gekankan.com';

// 定义可用工具
const TOOLS = [
  {
    name: 'get_investment_advice',
    description: '获取加密货币的投资建议，包含技术分析和市场情绪',
    inputSchema: {
      type: 'object',
      properties: {
        coin: {
          type: 'string',
          description: '加密货币 ID (bitcoin, ethereum, solana 等)',
          enum: ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano']
        },
        payment_id: {
          type: 'string',
          description: 'x402 支付 ID（可选）'
        }
      },
      required: ['coin']
    }
  },
  {
    name: 'get_price',
    description: '获取加密货币的实时价格和市场数据',
    inputSchema: {
      type: 'object',
      properties: {
        coin: {
          type: 'string',
          description: '加密货币 ID'
        }
      },
      required: ['coin']
    }
  },
  {
    name: 'create_payment',
    description: '创建 x402 支付请求',
    inputSchema: {
      type: 'object',
      properties: {
        service_type: {
          type: 'string',
          description: '服务类型',
          enum: ['singleConsultation', 'dayPass', 'monthlySubscription', 'apiAccess']
        },
        user_id: {
          type: 'string',
          description: '用户 ID'
        }
      },
      required: ['service_type']
    }
  },
  {
    name: 'get_top_cryptos',
    description: '获取市值排名前 N 的加密货币',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '返回数量（默认 10）',
          default: 10
        }
      }
    }
  },
  {
    name: 'get_defi_data',
    description: '获取 DeFi 市场数据（TVL 等）',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

// 创建 MCP 服务器
const server = new Server(
  {
    name: 'defi-advisor',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 处理工具列表请求
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// 处理工具调用请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'get_investment_advice': {
        const { coin, payment_id } = args;
        const headers = {
          'Content-Type': 'application/json'
        };
        if (payment_id) {
          headers['X-Payment'] = `x402 ${payment_id}`;
        }
        
        const response = await fetch(`${BASE_URL}/api/advice/${coin}`, { headers });
        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case 'get_price': {
        const { coin } = args;
        const response = await fetch(`${BASE_URL}/api/price/${coin}`);
        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case 'create_payment': {
        const { service_type, user_id } = args;
        const response = await fetch(`${BASE_URL}/api/payment/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceType: service_type,
            userId: user_id || 'mcp-user'
          })
        });
        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case 'get_top_cryptos': {
        const { limit = 10 } = args;
        const response = await fetch(`${BASE_URL}/api/top?limit=${limit}`);
        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      case 'get_defi_data': {
        const response = await fetch(`${BASE_URL}/api/defi`);
        const data = await response.json();
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`未知工具：${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `错误：${error.message}`
        }
      ],
      isError: true
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DeFi Advisor MCP Server 已启动');
}

main().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});
