import type { MarketDataItem, TagType, HotSectionType, IconType } from '@/types';

// 生成随机图表数据
const generateChartData = (points: number = 50): { time: number; value: number }[] => {
  const data: { time: number; value: number }[] = [];
  let value = 100 + Math.random() * 50;
  const now = Math.floor(Date.now() / 1000);
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 2;
    value = Math.max(50, value + change);
    data.push({
      time: now - (points - i) * 60, // 每分钟一个点
      value: Number(value.toFixed(2)),
    });
  }
  return data;
};

// 根据名称确定图标类型
const getIconTypeByName = (name: string): IconType => {
  // 股指相关
  if (name.includes('ETF') || name.includes('300') || name.includes('500') || name.includes('50') || name.includes('指数') || name.includes('指')) {
    return '股指';
  }
  // 金属相关
  if (['铜', '铝', '锌', '镍', '黄金', '白银', '铅', '锡'].some(metal => name.includes(metal))) {
    return '金属';
  }
  // 能化相关
  if (['原油', '天然气', '燃油', '沥青', 'PTA', 'PVC', 'PP', '塑料'].some(chemical => name.includes(chemical))) {
    return '能化';
  }
  // 农副相关
  if (['大豆', '玉米', '小麦', '棉花', '白糖', '菜籽', '豆粕'].some(agricultural => name.includes(agricultural))) {
    return '农副';
  }
  // 油脂相关
  if (['豆油', '棕榈', '菜油', '花生油'].some(oil => name.includes(oil))) {
    return '油脂';
  }
  // 黑色相关
  if (['螺纹钢', '热卷', '铁矿石', '焦炭', '焦煤', '动力煤'].some(ferrous => name.includes(ferrous))) {
    return '黑色';
  }
  // 默认随机分配（排除 '全部' 和交易所类型）
  const iconTypes: NonNullable<IconType>[] = ['股指', '金属', '能化', '农副', '油脂', '黑色'];
  return iconTypes[Math.floor(Math.random() * iconTypes.length)];
};

// 生成模拟数据
export const generateMockData = (tag: TagType): MarketDataItem[] => {
  const names = [
    '50ETF', '300ETF', '500ETF', '创业板ETF', '科创板ETF',
    '沪深300', '中证500', '上证50', '创业板指', '科创50',
    '铜', '铝', '锌', '镍', '黄金',
    '原油', '天然气', '燃油', '沥青', 'PTA',
    '大豆', '玉米', '小麦', '棉花', '白糖',
  ];
  
  return names.map((name, index) => {
    const priceChange = (Math.random() - 0.5) * 10;
    const priceChangePercent = priceChange;
    const latestPrice = 100 + Math.random() * 50;
    const iconType = getIconTypeByName(name);
    
    return {
      id: `${tag}-${index}`,
      name,
      iconType,
      latestPrice: Number(latestPrice.toFixed(2)),
      priceChange: Number(priceChange.toFixed(2)),
      priceChangePercent: Number(priceChangePercent.toFixed(2)),
      remainingTime: `${Math.floor(Math.random() * 30) + 1}天`,
      currentVol: Number((Math.random() * 30 + 10).toFixed(2)),
      volChange: Number((Math.random() * 5 - 2.5).toFixed(2)),
      volChangeSpeed: Number((Math.random() * 2 - 1).toFixed(2)),
      realVol: Number((Math.random() * 25 + 8).toFixed(2)),
      premium: Number((Math.random() * 20 - 10).toFixed(2)),
      currentSkew: Number((Math.random() * 0.5 - 0.25).toFixed(3)),
      volPercentile: Number((Math.random() * 100).toFixed(1)),
      skewPercentile: Number((Math.random() * 100).toFixed(1)),
      chartData: generateChartData(),
    };
  });
};

// 获取热门板块数据
export const getHotSectionsData = (allData: MarketDataItem[]) => {
  const sections = [
    {
      type: 'volUp' as HotSectionType,
      title: '隐波最大上升',
      data: [...allData]
        .sort((a, b) => b.volChange - a.volChange)
        .slice(0, 5),
    },
    {
      type: 'volDown' as HotSectionType,
      title: '隐波最大下降',
      data: [...allData]
        .sort((a, b) => a.volChange - b.volChange)
        .slice(0, 5),
    },
    {
      type: 'premiumHigh' as HotSectionType,
      title: '波动率溢价最高',
      data: [...allData]
        .sort((a, b) => b.premium - a.premium)
        .slice(0, 5),
    },
    {
      type: 'premiumLow' as HotSectionType,
      title: '波动率溢价最低',
      data: [...allData]
        .sort((a, b) => a.premium - b.premium)
        .slice(0, 5),
    },
  ];
  
  return sections;
};

