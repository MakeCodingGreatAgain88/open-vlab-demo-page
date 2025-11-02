import type { MarketDataItem } from '@/types';

// 缓存数据，确保固定
const dataCache = new Map<string, MarketDataItem & { chartData: any[] }>();

// 生成市场详情数据（使用code作为标识）
export const generateMarketDetailsData = (code: string, chartType: '分时' | '5日' | '日线' = '分时'): MarketDataItem & { chartData: any[] } => {
  // 使用code和chartType作为缓存key
  const cacheKey = `${code}-${chartType}`;
  if (dataCache.has(cacheKey)) {
    return dataCache.get(cacheKey)!;
  }

  // 生成基础数据（使用code作为种子，确保固定）
  const seed = code.split('').reduce((acc, val) => acc + val.charCodeAt(0), 0);
  
  // 改进的随机数生成器，使用索引来增加波动性
  const randomWithIndex = (min: number, max: number, index: number) => {
    const seedValue = seed + index;
    const x = Math.sin(seedValue * 0.01) * 10000;
    return min + (x - Math.floor(x)) * (max - min);
  };

  const now = Math.floor(Date.now() / 1000);
  const basePrice = 4657;
  const chartData: any[] = [];

  // 根据图表类型生成不同数量的数据点和时间间隔
  let points: number;
  let timeInterval: number; // 秒数间隔
  
  if (chartType === '分时') {
    points = 240; // 4小时，每分钟一个点
    timeInterval = 60; // 1分钟
  } else if (chartType === '5日') {
    points = 120; // 5天，每小时一个点
    timeInterval = 3600; // 1小时
  } else {
    points = 100; // 100个交易日
    timeInterval = 86400; // 1天
  }

  // 生成有波动性的价格数据
  let currentPrice = basePrice + randomWithIndex(-20, 20, 0);
  let trend = 0; // 趋势方向
  let volatility = 0.5; // 波动率

  for (let i = 0; i < points; i++) {
    // 添加趋势和波动性
    const trendChange = randomWithIndex(-0.3, 0.3, i) + trend * 0.1;
    trend = trend * 0.9 + trendChange * 0.1; // 趋势会逐渐衰减
    
    volatility = volatility * 0.95 + Math.abs(randomWithIndex(-0.2, 0.2, i)) * 0.05;
    
    // 计算价格变化
    const randomChange = randomWithIndex(-volatility * 2, volatility * 2, i);
    const priceChange = trend + randomChange;
    
    const open = currentPrice;
    const close = Math.max(4500, Math.min(4800, open + priceChange));
    
    // 对于日线，生成完整的OHLC
    if (chartType === '日线') {
      const range = Math.abs(close - open) + volatility * 3;
      const high = Math.max(open, close) + randomWithIndex(0, range * 0.5, i);
      const low = Math.min(open, close) - randomWithIndex(0, range * 0.5, i);
      
      const volume = Math.floor(randomWithIndex(10000, 100000, i));
      const openInterest = Math.floor(randomWithIndex(35000, 45000, i));
      const impliedVol = Number((randomWithIndex(14, 18, i)).toFixed(2));
      const priceChangePercent = Number(((close - basePrice) / basePrice * 100).toFixed(2));

      chartData.push({
        time: now - (points - i) * timeInterval,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        openInterest,
        impliedVol,
        priceChangePercent,
      });
    } else {
      // 分时和5日，只需要close（折线图）
      const high = close + randomWithIndex(0, volatility * 2, i);
      const low = close - randomWithIndex(0, volatility * 2, i);
      const volume = Math.floor(randomWithIndex(50000, 150000, i));
      const openInterest = Math.floor(randomWithIndex(38000, 42000, i));
      const impliedVol = Number((randomWithIndex(15, 17, i)).toFixed(2));
      const priceChangePercent = Number(((close - basePrice) / basePrice * 100).toFixed(2));

      chartData.push({
        time: now - (points - i) * timeInterval,
        open: Number(close.toFixed(2)), // 对于折线图，open可以等于close
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        openInterest,
        impliedVol,
        priceChangePercent,
      });
    }

    currentPrice = close;
  }

  // 生成基础数据项
  const baseData: MarketDataItem & { chartData: any[] } = {
    id: `market-${code}`, // 生成唯一ID
    name: `产品${code}`,
    categoryCode: code, // 使用传入的code
    iconType: '股指',
    latestPrice: Number(currentPrice.toFixed(2)),
    priceChange: Number(((currentPrice - basePrice) / basePrice * 100).toFixed(2)),
    priceChangePercent: Number(((currentPrice - basePrice) / basePrice * 100).toFixed(2)),
    remainingTime: '30天',
    currentVol: Number((randomWithIndex(15, 18, 0)).toFixed(2)),
    volChange: Number((randomWithIndex(-2, 2, 1)).toFixed(2)),
    volChangeSpeed: Number((randomWithIndex(-1, 1, 2)).toFixed(2)),
    realVol: Number((randomWithIndex(14, 17, 3)).toFixed(2)),
    premium: Number((randomWithIndex(-2, 2, 4)).toFixed(2)),
    currentSkew: Number((randomWithIndex(-0.3, 0.3, 5)).toFixed(3)),
    volPercentile: Number((randomWithIndex(20, 80, 6)).toFixed(1)),
    skewPercentile: Number((randomWithIndex(20, 80, 7)).toFixed(1)),
    chartData,
  };

  // 缓存数据
  dataCache.set(cacheKey, baseData);

  return baseData;
};
