#!/usr/bin/env node

/**
 * DeFi Advisor - 数据获取模块
 * 整合链上数据、市场数据、新闻情绪
 */

import fetch from 'node-fetch';

// CoinGecko API (免费版)
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// 配置
const CONFIG = {
  coingecko: {
    baseUrl: COINGECKO_BASE,
    rateLimit: 50, // 次/分钟 (免费版)
  }
};

/**
 * 获取加密货币价格数据
 */
export async function getCryptoPrice(coinId = 'bitcoin', vsCurrency = 'usd') {
  try {
    const url = `${CONFIG.coingecko.baseUrl}/simple/price?ids=${coinId}&vs_currencies=${vsCurrency}&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DeFi-Advisor-Agent/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data[coinId],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取市场数据 (前 N 名)
 */
export async function getTopCryptos(limit = 10) {
  try {
    const url = `${CONFIG.coingecko.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DeFi-Advisor-Agent/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: data.map(coin => ({
        rank: coin.market_cap_rank,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        change24h: coin.price_change_percentage_24h,
        high24h: coin.high_24h,
        low24h: coin.low_24h
      })),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取加密货币历史数据
 */
export async function getCryptoHistory(coinId = 'bitcoin', days = 30) {
  try {
    const url = `${CONFIG.coingecko.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DeFi-Advisor-Agent/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: {
        prices: data.prices.map(p => ({
          timestamp: p[0],
          price: p[1]
        })),
        marketCaps: data.market_caps.map(m => ({
          timestamp: m[0],
          marketCap: m[1]
        })),
        volumes: data.total_volumes.map(v => ({
          timestamp: v[0],
          volume: v[1]
        }))
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取 DeFi 数据 (TVL 等)
 */
export async function getDeFiData() {
  try {
    // 使用 DefiLlama API (免费)
    const url = 'https://api.llama.fi/charts';
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DeFi-Advisor-Agent/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: {
        totalTVL: data[data.length - 1]?.totalLiquidityUSD || 0,
        chart: data.slice(-30).map(d => ({
          date: d.date,
          tvl: d.totalLiquidityUSD
        }))
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取新闻 RSS (使用 RSS to JSON 服务)
 */
export async function getCryptoNews(source = 'coindesk', limit = 10) {
  const rssUrls = {
    coindesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    cointelegraph: 'https://cointelegraph.com/rss',
    theblock: 'https://www.theblock.co/rss.xml',
  };
  
  try {
    const rssUrl = rssUrls[source] || rssUrls.coindesk;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=${limit}`;
    
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DeFi-Advisor-Agent/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`RSS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: {
        source: source,
        articles: data.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          author: item.author,
          description: item.description?.substring(0, 200) + '...'
        }))
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// CLI 测试
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧪 测试数据获取模块...\n');
  
  const tests = [
    { name: 'BTC 价格', fn: () => getCryptoPrice('bitcoin') },
    { name: 'Top 10 加密货币', fn: () => getTopCryptos(10) },
    { name: 'DeFi TVL', fn: () => getDeFiData() },
    { name: 'CoinDesk 新闻', fn: () => getCryptoNews('coindesk', 5) }
  ];
  
  for (const test of tests) {
    console.log(`📊 ${test.name}...`);
    const result = await test.fn();
    if (result.success) {
      console.log('✅ 成功');
      console.log(JSON.stringify(result.data, null, 2).substring(0, 500) + '...\n');
    } else {
      console.log('❌ 失败:', result.error, '\n');
    }
    await new Promise(r => setTimeout(r, 1000)); // 避免 API 限流
  }
}
