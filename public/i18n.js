/**
 * 多语言支持 (i18n)
 * 支持：中文、English、한국어、日本語、Français
 */

const translations = {
  'zh-CN': {
    // Hero Section
    'title': 'DeFi 智能投顾 - AI 驱动的加密投资顾问',
    'hero_badge': '🏆 The Synthesis Hackathon 2026 参赛作品',
    'hero_title': '🤖 AI 驱动的加密投资顾问',
    'hero_subtitle': '整合 29+ 技术指标、实时市场情绪和链上数据，为您提供智能投资建议',
    'feature_tech': '29+ 技术指标',
    'feature_sentiment': '实时情绪分析',
    'feature_onchain': '链上数据',
    'feature_instant': '即时访问',
    'cta_primary': '🚀 立即获取建议',
    'cta_secondary': '⛓️ 区块链验证',
    
    // AI Capabilities
    'ai_capabilities_title': '✨ AI 核心能力',
    'ai_capabilities_subtitle': '多维度数据分析，为您提供全方位的投资洞察',
    'tech_analysis_title': '技术分析',
    'tech_analysis_desc': '整合 29+ 专业技术指标，包括 RSI、MACD、布林带、一目均衡表等，全面分析市场趋势',
    'tech_stat_indicators': '技术指标',
    'tech_stat_update': '数据更新',
    'sentiment_analysis_title': '情绪分析',
    'sentiment_analysis_desc': '实时分析全球加密媒体新闻和社交媒体情绪，捕捉市场心理变化',
    'sentiment_stat_sources': '新闻源',
    'sentiment_stat_ai': '情绪评分',
    'onchain_analysis_title': '链上数据',
    'onchain_analysis_desc': '追踪 DeFi 协议 TVL、大额转账、巨鲸活动，洞察链上资金流向',
    'onchain_stat_chain': '链上整合',
    'onchain_stat_data': '数据追踪',
    
    // Live Demo
    'demo_title': '🎯 立即体验 AI 投顾',
    'demo_subtitle': '选择您想分析的加密货币，30 秒获取专业投资建议',
    'demo_step1_title': '选择加密货币',
    'demo_step1_desc': '从 BTC、ETH 等主流币种中选择',
    'demo_step2_title': 'AI 分析',
    'demo_step2_desc': '系统自动分析技术面、情绪面和链上数据',
    'demo_step3_title': '获取建议',
    'demo_step3_desc': '获得包含买卖建议和置信度的完整报告',
    'demo_btn': '🚀 获取 AI 投资建议',
    'loading': '正在分析市场数据...',
    'analysis_title': '投资分析',
    'result_price': '当前价格',
    'result_change': '24h 涨跌',
    'result_volume': '24h 成交量',
    'result_sentiment': '市场情绪',
    'error': '获取失败',
    
    // Tech Stack
    'tech_stack_title': '🛠️ 技术实现',
    'tech_stack_subtitle': '基于最先进的区块链和 AI 技术构建',
    'tech_x402_title': '⚡ x402 支付协议',
    'tech_x402_desc': '基于 Base 链的微支付协议，无需注册，即时访问，交易费用极低',
    'tech_base_title': '⛓️ Base 区块链',
    'tech_base_desc': 'Coinbase 推出的 Layer 2 解决方案，快速、安全、低成本',
    'tech_ai_title': '🤖 AI 引擎',
    'tech_ai_desc': '整合多种 AI 模型，提供准确的技术分析和情绪判断',
    'tech_opensource_title': '📦 开源代码',
    'tech_opensource_desc': '完整源代码在 GitHub 公开，透明可验证',
    'tech_learn_more': '了解更多 →',
    
    // Footer
    'footer_blockchain': '⛓️ 区块链验证',
    'footer_disclaimer': '⚠️ 免责声明：本建议仅供参考，不构成投资建议。加密货币投资风险极高，请谨慎决策。过往表现不代表未来结果。',
    'footer_built': '🏗️ Built with ❤️ for The Synthesis Hackathon 2026',
    
    // Common
    'creator': '👨‍💻 Created by',
    'creator_name': '宝哥 (Sebo)',
    'btc': 'Bitcoin (BTC)',
    'eth': 'Ethereum (ETH)',
    'sol': 'Solana (SOL)',
    'bnb': 'BNB',
    'xrp': 'XRP',
    'ada': 'Cardano (ADA)'
  },
  
  'en-US': {
    // Hero Section
    'title': 'DeFi AI Advisor - AI-Powered Crypto Investment',
    'hero_badge': '🏆 The Synthesis Hackathon 2026 Entry',
    'hero_title': '🤖 AI-Powered Crypto Investment Advisor',
    'hero_subtitle': 'Integrating 29+ technical indicators, real-time sentiment analysis, and on-chain data for intelligent investment advice',
    'feature_tech': '29+ Indicators',
    'feature_sentiment': 'Real-time Sentiment',
    'feature_onchain': 'On-Chain Data',
    'feature_instant': 'Instant Access',
    'cta_primary': '🚀 Get Advice Now',
    'cta_secondary': '⛓️ Blockchain Verification',
    
    // AI Capabilities
    'ai_capabilities_title': '✨ AI Core Capabilities',
    'ai_capabilities_subtitle': 'Multi-dimensional data analysis for comprehensive investment insights',
    'tech_analysis_title': 'Technical Analysis',
    'tech_analysis_desc': '29+ professional indicators including RSI, MACD, Bollinger Bands, Ichimoku Cloud for comprehensive market trend analysis',
    'tech_stat_indicators': 'Indicators',
    'tech_stat_update': 'Real-time Updates',
    'sentiment_analysis_title': 'Sentiment Analysis',
    'sentiment_analysis_desc': 'Real-time analysis of global crypto media and social media sentiment to capture market psychology',
    'sentiment_stat_sources': 'News Sources',
    'sentiment_stat_ai': 'AI Sentiment Score',
    'onchain_analysis_title': 'On-Chain Data',
    'onchain_analysis_desc': 'Track DeFi TVL, large transfers, whale activity to understand on-chain capital flows',
    'onchain_stat_chain': 'Chain Integration',
    'onchain_stat_data': 'Real-time Tracking',
    
    // Live Demo
    'demo_title': '🎯 Try AI Advisor Now',
    'demo_subtitle': 'Select your cryptocurrency and get professional investment advice in 30 seconds',
    'demo_step1_title': 'Select Cryptocurrency',
    'demo_step1_desc': 'Choose from BTC, ETH and other major coins',
    'demo_step2_title': 'AI Analysis',
    'demo_step2_desc': 'System automatically analyzes technical, sentiment and on-chain data',
    'demo_step3_title': 'Get Advice',
    'demo_step3_desc': 'Receive complete report with buy/sell recommendation and confidence',
    'demo_btn': '🚀 Get AI Investment Advice',
    'loading': 'Analyzing market data...',
    'analysis_title': 'Investment Analysis',
    'result_price': 'Current Price',
    'result_change': '24h Change',
    'result_volume': '24h Volume',
    'result_sentiment': 'Market Sentiment',
    'error': 'Failed',
    
    // Tech Stack
    'tech_stack_title': '🛠️ Technology',
    'tech_stack_subtitle': 'Built with cutting-edge blockchain and AI technology',
    'tech_x402_title': '⚡ x402 Payment Protocol',
    'tech_x402_desc': 'Base chain micro-payment protocol, no registration required, instant access, ultra-low fees',
    'tech_base_title': '⛓️ Base Blockchain',
    'tech_base_desc': 'Layer 2 solution by Coinbase, fast, secure, and low-cost',
    'tech_ai_title': '🤖 AI Engine',
    'tech_ai_desc': 'Integrating multiple AI models for accurate technical analysis and sentiment judgment',
    'tech_opensource_title': '📦 Open Source',
    'tech_opensource_desc': 'Complete source code publicly available on GitHub, transparent and verifiable',
    'tech_learn_more': 'Learn More →',
    
    // Footer
    'footer_blockchain': '⛓️ Blockchain Verification',
    'footer_disclaimer': '⚠️ Disclaimer: This is for informational purposes only, not investment advice. Cryptocurrency trading involves high risk. Past performance does not guarantee future results.',
    'footer_built': '🏗️ Built with ❤️ for The Synthesis Hackathon 2026',
    
    // Common
    'creator': '👨‍💻 Created by',
    'creator_name': '宝哥 (Sebo)',
    'btc': 'Bitcoin (BTC)',
    'eth': 'Ethereum (ETH)',
    'sol': 'Solana (SOL)',
    'bnb': 'BNB',
    'xrp': 'XRP',
    'ada': 'Cardano (ADA)'
  },
  
  'ko-KR': {
    // Hero Section
    'title': 'DeFi AI 투자 고문 - AI 기반 암호화폐 투자',
    'hero_badge': '🏆 The Synthesis Hackathon 2026 출품작',
    'hero_title': '🤖 AI 기반 암호화폐 투자 고문',
    'hero_subtitle': '29+ 기술 지표, 실시간 심리 분석 및 온체인 데이터를 통합한 지능형 투자 조언',
    'feature_tech': '29+ 지표',
    'feature_sentiment': '실시간 심리',
    'feature_onchain': '온체인 데이터',
    'feature_instant': '즉시 액세스',
    'cta_primary': '🚀 지금 조언 받기',
    'cta_secondary': '⛓️ 블록체인 검증',
    
    // AI Capabilities
    'ai_capabilities_title': '✨ AI 핵심 기능',
    'ai_capabilities_subtitle': '다차원 데이터 분석으로 포괄적인 투자 통찰력 제공',
    'tech_analysis_title': '기술적 분석',
    'tech_analysis_desc': 'RSI, MACD, 볼린저 밴드, 이치모구모 등 29+ 전문 지표를 통한 포괄적인 시장 추세 분석',
    'tech_stat_indicators': '지표',
    'tech_stat_update': '실시간 업데이트',
    'sentiment_analysis_title': '심리 분석',
    'sentiment_analysis_desc': '글로벌 암호화폐 미디어 및 소셜 미디어 심리 실시간 분석',
    'sentiment_stat_sources': '뉴스 소스',
    'sentiment_stat_ai': 'AI 심리 점수',
    'onchain_analysis_title': '온체인 데이터',
    'onchain_analysis_desc': 'DeFi TVL, 대량 이체, 고래 활동 추적으로 온체인 자본 흐름 이해',
    'onchain_stat_chain': '체인 통합',
    'onchain_stat_data': '실시간 추적',
    
    // Live Demo
    'demo_title': '🎯 지금 AI 고문 체험',
    'demo_subtitle': '암호화폐를 선택하고 30 초 만에 전문 투자 조언 받기',
    'demo_step1_title': '암호화폐 선택',
    'demo_step1_desc': 'BTC, ETH 등 주요 코인에서 선택',
    'demo_step2_title': 'AI 분석',
    'demo_step2_desc': '시스템이 기술, 심리 및 온체인 데이터 자동 분석',
    'demo_step3_title': '조언 받기',
    'demo_step3_desc': '매수/매도 추천 및 신뢰도 포함 완전한 보고서 수신',
    'demo_btn': '🚀 AI 투자 조언 받기',
    'loading': '시장 데이터 분석 중...',
    'analysis_title': '투자 분석',
    'result_price': '현재 가격',
    'result_change': '24 시간 변동',
    'result_volume': '24 시간 거래량',
    'result_sentiment': '시장 심리',
    'error': '실패',
    
    // Tech Stack
    'tech_stack_title': '🛠️ 기술',
    'tech_stack_subtitle': '최첨단 블록체인 및 AI 기술로 구축',
    'tech_x402_title': '⚡ x402 결제 프로토콜',
    'tech_x402_desc': 'Base 체인 마이크로결제 프로토콜, 등록 불필요, 즉시 액세스, 초저비용',
    'tech_base_title': '⛓️ Base 블록체인',
    'tech_base_desc': 'Coinbase 의 레이어 2 솔루션, 빠르고 안전하며 저비용',
    'tech_ai_title': '🤖 AI 엔진',
    'tech_ai_desc': '정확한 기술 분석과 심리 판단을 위한 다중 AI 모델 통합',
    'tech_opensource_title': '📦 오픈소스',
    'tech_opensource_desc': 'GitHub 에서 완전한 소스 코드 공개, 투명하고 검증 가능',
    'tech_learn_more': '자세히 보기 →',
    
    // Footer
    'footer_blockchain': '⛓️ 블록체인 검증',
    'footer_disclaimer': '⚠️ 면책 조항: 이는 정보 제공 목적으로만 사용되며 투자 조언이 아닙니다. 암호화폐 거래는 높은 위험이 있습니다. 과거 성과가 미래 결과를 보장하지 않습니다.',
    'footer_built': '🏗️ Built with ❤️ for The Synthesis Hackathon 2026',
    
    // Common
    'creator': '👨‍💻 Created by',
    'creator_name': '보거 (Sebo)',
    'btc': '비트코인 (BTC)',
    'eth': '이더리움 (ETH)',
    'sol': '솔라나 (SOL)',
    'bnb': 'BNB',
    'xrp': '리플 (XRP)',
    'ada': '카드노 (ADA)'
  },
  
  'ja-JP': {
    // Hero Section
    'title': 'DeFi AI アドバイザー - AI 搭載暗号通貨投資',
    'hero_badge': '🏆 The Synthesis Hackathon 2026 エントリー',
    'hero_title': '🤖 AI 搭載暗号通貨投資アドバイザー',
    'hero_subtitle': '29+ 技術指標、リアルタイムセンチメント分析、オンチェーンデータを統合したインテリジェント投資アドバイス',
    'feature_tech': '29+ 指標',
    'feature_sentiment': 'リアルタイムセンチメント',
    'feature_onchain': 'オンチェーンデータ',
    'feature_instant': '即時アクセス',
    'cta_primary': '🚀 今すぐアドバイス',
    'cta_secondary': '⛓️ ブロックチェーン検証',
    
    // AI Capabilities
    'ai_capabilities_title': '✨ AI 核心機能',
    'ai_capabilities_subtitle': '多次元データ分析による包括的な投資洞察',
    'tech_analysis_title': 'テクニカル分析',
    'tech_analysis_desc': 'RSI、MACD、ボリンジャーバンド、一目均衡表など 29+ 専門指標による包括的な市場トレンド分析',
    'tech_stat_indicators': '指標',
    'tech_stat_update': 'リアルタイム更新',
    'sentiment_analysis_title': 'センチメント分析',
    'sentiment_analysis_desc': 'グローバル暗号通貨メディアとソーシャルメディアのセンチメントをリアルタイム分析',
    'sentiment_stat_sources': 'ニュースソース',
    'sentiment_stat_ai': 'AI センチメントスコア',
    'onchain_analysis_title': 'オンチェーンデータ',
    'onchain_analysis_desc': 'DeFi TVL、大口送金、クジラ活動を追跡してオンチェーン資本フローを理解',
    'onchain_stat_chain': 'チェーン統合',
    'onchain_stat_data': 'リアルタイム追跡',
    
    // Live Demo
    'demo_title': '🎯 今すぐ AI アドバイザーを体験',
    'demo_subtitle': '暗号通貨を選択して 30 秒で専門投資アドバイスを受け取る',
    'demo_step1_title': '暗号通貨を選択',
    'demo_step1_desc': 'BTC、ETH など主要コインから選択',
    'demo_step2_title': 'AI 分析',
    'demo_step2_desc': 'システムがテクニカル、センチメント、オンチェーンデータを自動分析',
    'demo_step3_title': 'アドバイスを受け取る',
    'demo_step3_desc': '買い/売り推奨と信頼度を含む完全なレポートを受信',
    'demo_btn': '🚀 AI 投資アドバイスを受け取る',
    'loading': '市場データを分析中...',
    'analysis_title': '投資分析',
    'result_price': '現在価格',
    'result_change': '24 時間変動',
    'result_volume': '24 時間出来高',
    'result_sentiment': '市場センチメント',
    'error': '失敗',
    
    // Tech Stack
    'tech_stack_title': '🛠️ 技術',
    'tech_stack_subtitle': '最先端のブロックチェーンおよび AI 技術で構築',
    'tech_x402_title': '⚡ x402 支払いプロトコル',
    'tech_x402_desc': 'Base チェーンマイクロ支払いプロトコル、登録不要、即時アクセス、超低コスト',
    'tech_base_title': '⛓️ Base ブロックチェーン',
    'tech_base_desc': 'Coinbase によるレイヤー 2 ソリューション、高速で安全、低コスト',
    'tech_ai_title': '🤖 AI エンジン',
    'tech_ai_desc': '正確なテクニカル分析とセンチメント判断のための複数 AI モデルを統合',
    'tech_opensource_title': '📦 オープンソース',
    'tech_opensource_desc': 'GitHub で完全なソースコードを公開、透明で検証可能',
    'tech_learn_more': '詳しく見る →',
    
    // Footer
    'footer_blockchain': '⛓️ ブロックチェーン検証',
    'footer_disclaimer': '⚠️ 免責事項：これは情報提供のみを目的としており、投資アドバイスではありません。暗号通貨取引は高いリスクを伴います。過去のパフォーマンスは将来の結果を保証しません。',
    'footer_built': '🏗️ Built with ❤️ for The Synthesis Hackathon 2026',
    
    // Common
    'creator': '👨‍💻 Created by',
    'creator_name': '宝哥 (Sebo)',
    'btc': 'ビットコイン (BTC)',
    'eth': 'イーサリアム (ETH)',
    'sol': 'ソラナ (SOL)',
    'bnb': 'BNB',
    'xrp': 'リップル (XRP)',
    'ada': 'カルダノ (ADA)'
  },
  
  'fr-FR': {
    // Hero Section
    'title': 'DeFi AI Conseiller - Investment Crypto Alimenté par l\'IA',
    'hero_badge': '🏆 Participation à The Synthesis Hackathon 2026',
    'hero_title': '🤖 Conseiller en Investment Crypto Alimenté par l\'IA',
    'hero_subtitle': 'Intégration de 29+ indicateurs techniques, analyse de sentiment en temps réel et données on-chain pour des conseils d\'investissement intelligents',
    'feature_tech': '29+ Indicateurs',
    'feature_sentiment': 'Sentiment Temps Réel',
    'feature_onchain': 'Données On-Chain',
    'feature_instant': 'Accès Instantané',
    'cta_primary': '🚀 Obtenir un Conseil',
    'cta_secondary': '⛓️ Vérification Blockchain',
    
    // AI Capabilities
    'ai_capabilities_title': '✨ Fonctionnalités IA Principales',
    'ai_capabilities_subtitle': 'Analyse de données multidimensionnelle pour des insights d\'investissement complets',
    'tech_analysis_title': 'Analyse Technique',
    'tech_analysis_desc': '29+ indicateurs professionnels dont RSI, MACD, Bandes de Bollinger, Ichimoku pour une analyse complète des tendances',
    'tech_stat_indicators': 'Indicateurs',
    'tech_stat_update': 'Mises à Jour Temps Réel',
    'sentiment_analysis_title': 'Analyse de Sentiment',
    'sentiment_analysis_desc': 'Analyse en temps réel des médias crypto et du sentiment des réseaux sociaux',
    'sentiment_stat_sources': 'Sources d\'Actualités',
    'sentiment_stat_ai': 'Score de Sentiment IA',
    'onchain_analysis_title': 'Données On-Chain',
    'onchain_analysis_desc': 'Suivez le TVL DeFi, les gros transferts, l\'activité des baleines pour comprendre les flux de capitaux',
    'onchain_stat_chain': 'Intégration Chain',
    'onchain_stat_data': 'Suivi Temps Réel',
    
    // Live Demo
    'demo_title': '🎯 Essayez le Conseiller IA',
    'demo_subtitle': 'Sélectionnez votre cryptomonnaie et obtenez un conseil professionnel en 30 secondes',
    'demo_step1_title': 'Sélectionnez la Cryptomonnaie',
    'demo_step1_desc': 'Choisissez parmi BTC, ETH et autres',
    'demo_step2_title': 'Analyse IA',
    'demo_step2_desc': 'Le système analyse automatiquement les données techniques, sentiment et on-chain',
    'demo_step3_title': 'Obtenez un Conseil',
    'demo_step3_desc': 'Recevez un rapport complet avec recommandation d\'achat/vente et confiance',
    'demo_btn': '🚀 Obtenir un Conseil d\'Investissement IA',
    'loading': 'Analyse des données du marché...',
    'analysis_title': 'Analyse d\'Investissement',
    'result_price': 'Prix Actuel',
    'result_change': 'Variation 24h',
    'result_volume': 'Volume 24h',
    'result_sentiment': 'Sentiment du Marché',
    'error': 'Échec',
    
    // Tech Stack
    'tech_stack_title': '🛠️ Technologie',
    'tech_stack_subtitle': 'Construit avec une technologie blockchain et IA de pointe',
    'tech_x402_title': '⚡ Protocole de Paiement x402',
    'tech_x402_desc': 'Protocole de micro-paiement Base chain, sans inscription, accès instantané, frais ultra-faibles',
    'tech_base_title': '⛓️ Blockchain Base',
    'tech_base_desc': 'Solution Layer 2 par Coinbase, rapide, sécurisée et peu coûteuse',
    'tech_ai_title': '🤖 Moteur IA',
    'tech_ai_desc': 'Intégration de multiples modèles IA pour une analyse technique et un jugement de sentiment précis',
    'tech_opensource_title': '📦 Open Source',
    'tech_opensource_desc': 'Code source complet disponible sur GitHub, transparent et vérifiable',
    'tech_learn_more': 'En Savoir Plus →',
    
    // Footer
    'footer_blockchain': '⛓️ Vérification Blockchain',
    'footer_disclaimer': '⚠️ Avertissement: Ceci est à titre informatif uniquement, pas un conseil en investissement. Le trading de cryptomonnaies comporte des risques élevés. Les performances passées ne garantissent pas les résultats futurs.',
    'footer_built': '🏗️ Built with ❤️ for The Synthesis Hackathon 2026',
    
    // Common
    'creator': '👨‍💻 Created by',
    'creator_name': '宝哥 (Sebo)',
    'btc': 'Bitcoin (BTC)',
    'eth': 'Ethereum (ETH)',
    'sol': 'Solana (SOL)',
    'bnb': 'BNB',
    'xrp': 'XRP',
    'ada': 'Cardano (ADA)'
  }
};

// 当前语言
let currentLang = 'zh-CN';

// 设置语言
function setLanguage(lang) {
  if (!translations[lang]) {
    console.warn('Language not supported:', lang);
    lang = 'zh-CN';
  }
  
  currentLang = lang;
  localStorage.setItem('preferred_lang', lang);
  updatePageLanguage();
}

// 更新页面语言
function updatePageLanguage() {
  const t = translations[currentLang];
  if (!t) return;
  
  // 更新所有带 data-i18n 的元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });
  
  // 更新按钮文字
  document.querySelectorAll('[data-i18n-btn]').forEach(el => {
    const key = el.getAttribute('data-i18n-btn');
    if (t[key]) {
      el.textContent = t[key];
    }
  });
  
  // 更新占位符
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.placeholder = t[key];
    }
  });
  
  // 更新标题
  if (t.title) {
    document.title = t.title;
  }
}

// 页面加载时恢复用户语言偏好
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('preferred_lang') || 'zh-CN';
  setLanguage(savedLang);
});

// 导出给其他页面使用
if (typeof window !== 'undefined') {
  window.translations = translations;
  window.currentLang = currentLang;
  window.setLanguage = setLanguage;
}
