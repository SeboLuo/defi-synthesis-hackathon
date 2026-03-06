#!/usr/bin/env node

/**
 * DeFi Advisor - 投资建议生成模块
 * 整合技术分析、市场数据、新闻情绪生成投资建议
 */

import { getCryptoPrice, getTopCryptos, getDeFiData } from './data-fetcher.js';

// 技术分析指标阈值
const INDICATORS = {
  rsi: {
    oversold: 30,
    overbought: 70
  },
  volatility: {
    high: 10, // 24h 波动 >10% 为高波动
    extreme: 20
  }
};

/**
 * 生成简单的技术分析信号
 */
function generateTechnicalSignal(price, change24h, high24h, low24h) {
  const signals = [];
  let score = 0; // -10 (强烈卖出) 到 +10 (强烈买入)
  
  // 24 小时涨跌幅分析
  if (change24h < -INDICATORS.volatility.extreme) {
    signals.push({ type: 'oversold', strength: 'strong', message: '24 小时暴跌超过 20%，可能超卖' });
    score += 3;
  } else if (change24h < -INDICATORS.volatility.high) {
    signals.push({ type: 'dip', strength: 'moderate', message: '24 小时下跌超过 10%，关注反弹机会' });
    score += 2;
  } else if (change24h > INDICATORS.volatility.extreme) {
    signals.push({ type: 'overbought', strength: 'strong', message: '24 小时暴涨超过 20%，警惕回调' });
    score -= 3;
  } else if (change24h > INDICATORS.volatility.high) {
    signals.push({ type: 'rally', strength: 'moderate', message: '24 小时上涨超过 10%，注意获利回吐' });
    score -= 2;
  }
  
  // 高低点分析
  const currentPrice = price;
  const dailyRange = high24h - low24h;
  const positionInRange = (currentPrice - low24h) / dailyRange;
  
  if (positionInRange < 0.2) {
    signals.push({ type: 'near_low', strength: 'weak', message: '价格接近 24 小时低点' });
    score += 1;
  } else if (positionInRange > 0.8) {
    signals.push({ type: 'near_high', strength: 'weak', message: '价格接近 24 小时高点' });
    score -= 1;
  }
  
  return {
    signals,
    score,
    recommendation: getRecommendation(score)
  };
}

/**
 * 根据分数生成建议
 */
function getRecommendation(score) {
  if (score >= 5) return { action: 'BUY', confidence: 'HIGH', text: '强烈买入' };
  if (score >= 2) return { action: 'BUY', confidence: 'MEDIUM', text: '逢低买入' };
  if (score >= -1) return { action: 'HOLD', confidence: 'MEDIUM', text: '持有观望' };
  if (score >= -4) return { action: 'SELL', confidence: 'MEDIUM', text: '逢高减仓' };
  return { action: 'SELL', confidence: 'HIGH', text: '强烈卖出' };
}

/**
 * 生成市场情绪分析
 */
function analyzeMarketSentiment(topCryptos) {
  const avgChange = topCryptos.reduce((sum, c) => sum + c.change24h, 0) / topCryptos.length;
  const gainers = topCryptos.filter(c => c.change24h > 0).length;
  const losers = topCryptos.filter(c => c.change24h < 0).length;
  
  let sentiment = 'NEUTRAL';
  if (avgChange > 5 && gainers > losers * 2) {
    sentiment = 'BULLISH';
  } else if (avgChange < -5 && losers > gainers * 2) {
    sentiment = 'BEARISH';
  }
  
  return {
    sentiment,
    avgChange: avgChange.toFixed(2),
    gainers,
    losers,
    description: getSentimentDescription(sentiment, avgChange)
  };
}

function getSentimentDescription(sentiment, avgChange) {
  if (sentiment === 'BULLISH') return `市场情绪乐观，平均上涨 ${avgChange}%，多数币种上涨`;
  if (sentiment === 'BEARISH') return `市场情绪悲观，平均下跌 ${avgChange}%，多数币种下跌`;
  return `市场情绪中性，平均变化 ${avgChange}%，多空胶着`;
}

/**
 * 生成投资建议 (主函数)
 */
export async function generateInvestmentAdvice(coinId = 'bitcoin', amount = null) {
  try {
    console.log(`🔍 分析 ${coinId}...`);
    
    // 获取价格数据
    const priceData = await getCryptoPrice(coinId);
    if (!priceData.success) {
      return { success: false, error: '获取价格数据失败' };
    }
    
    // 获取市场数据
    const marketData = await getTopCryptos(10);
    if (!marketData.success) {
      return { success: false, error: '获取市场数据失败' };
    }
    
    // 获取 DeFi 数据
    const defiData = await getDeFiData();
    
    // 技术分析
    const coin = marketData.data.find(c => 
      c.symbol === coinId.substring(0, 4).toUpperCase() || 
      coinId.includes(c.symbol.toLowerCase())
    );
    
    let technicalAnalysis = { signals: [], score: 0, recommendation: { action: 'HOLD' } };
    if (coin) {
      technicalAnalysis = generateTechnicalSignal(
        coin.price, 
        coin.change24h, 
        coin.high24h, 
        coin.low24h
      );
    }
    
    // 市场情绪
    const marketSentiment = analyzeMarketSentiment(marketData.data);
    
    // 生成综合建议
    const advice = {
      success: true,
      timestamp: new Date().toISOString(),
      asset: coinId,
      currentPrice: priceData.data.usd,
      change24h: priceData.data.usd_24h_change,
      marketCap: priceData.data.usd_market_cap,
      volume24h: priceData.data.usd_24h_vol,
      technicalAnalysis: {
        ...technicalAnalysis,
        signals: technicalAnalysis.signals.map(s => s.message)
      },
      marketSentiment,
      defiOverview: defiData.success ? {
        totalTVL: `$${(defiData.data.totalTVL / 1e9).toFixed(2)}B`
      } : null,
      recommendation: {
        action: technicalAnalysis.recommendation?.action || 'HOLD',
        confidence: technicalAnalysis.recommendation?.confidence || 'MEDIUM',
        text: getRecommendation(technicalAnalysis.score).text,
        reasoning: generateReasoning(technicalAnalysis, marketSentiment, priceData.data)
      },
      disclaimer: '⚠️ 本建议仅供参考，不构成投资建议。加密货币投资风险极高，请谨慎决策。'
    };
    
    return advice;
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 生成建议理由
 */
function generateReasoning(technical, sentiment, priceData) {
  const reasons = [];
  
  // 技术面
  if (technical.signals.length > 0) {
    reasons.push(`技术面：${technical.signals.map(s => s.message).join('; ')}`);
  }
  
  // 市场情绪
  reasons.push(`市场情绪：${sentiment.description}`);
  
  // 价格位置
  const marketCapFormatted = `$${(priceData.usd_market_cap / 1e12).toFixed(2)}T`;
  reasons.push(`市值：${marketCapFormatted}，24h 成交量：$${(priceData.usd_24h_vol / 1e9).toFixed(2)}B`);
  
  return reasons.join('。');
}

/**
 * 格式化建议为可读文本
 */
export function formatAdvice(advice) {
  if (!advice.success) return `❌ 错误：${advice.error}`;
  
  const lines = [
    `📊 ${advice.asset.toUpperCase()} 投资分析`,
    ``,
    `💰 当前价格：$${advice.currentPrice.toLocaleString()}`,
    `📈 24h 涨跌：${advice.change24h > 0 ? '+' : ''}${advice.change24h.toFixed(2)}%`,
    `💎 市值：$${(advice.marketCap / 1e12).toFixed(2)}T`,
    `📊 24h 成交量：$${(advice.volume24h / 1e9).toFixed(2)}B`,
    ``,
    `🎯 建议：${advice.recommendation.text}`,
    `📊 方向：${advice.recommendation.action}`,
    `🎲 置信度：${advice.recommendation.confidence}`,
    ``,
    `📝 分析：`,
    advice.recommendation.reasoning,
    ``,
    `🌐 市场情绪：${advice.marketSentiment.sentiment}`,
    advice.defiOverview ? `💰 DeFi TVL: ${advice.defiOverview.totalTVL}` : '',
    ``,
    advice.disclaimer
  ];
  
  return lines.filter(l => l).join('\n');
}

// CLI 测试
if (import.meta.url === `file://${process.argv[1]}`) {
  const coin = process.argv[2] || 'bitcoin';
  console.log(`🚀 生成 ${coin} 的投资建议...\n`);
  
  const advice = await generateInvestmentAdvice(coin);
  console.log(formatAdvice(advice));
}
