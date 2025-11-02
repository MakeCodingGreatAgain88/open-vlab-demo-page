// 标签类型
export type TagType = 
  | '全部'
  | '股指'
  | '金属'
  | '能化'
  | '农副'
  | '油脂'
  | '黑色'
  | '中金所'
  | '上交所'
  | '深交所'
  | '上期所'
  | '大商所'
  | '郑商所'
  | '能源中心'
  | '广期所';

// 图标类型（用于数据项）
export type IconType = 
  | '股指'
  | '金属'
  | '能化'
  | '农副'
  | '油脂'
  | '黑色'
  | null;

// 数据项类型
export interface MarketDataItem {
  id: string;
  name: string;
  categoryCode: string; // 品类代码
  iconType: IconType; // 图标类型
  latestPrice: number;
  priceChange: number; // 涨幅%
  priceChangePercent: number;
  remainingTime: string;
  currentVol: number; // 当月隐波
  volChange: number; // 隐波变化
  volChangeSpeed: number; // 隐波涨速
  realVol: number; // 实波
  premium: number; // 溢价
  currentSkew: number; // 当月偏度
  volPercentile: number; // 隐波比分位
  skewPercentile: number; // 偏度百分位
  chartData: { time: number; value: number }[]; // 图表数据
}

// 热门板块类型
export type HotSectionType = 
  | 'volUp'      // 隐波最大上升
  | 'volDown'    // 隐波最大下降
  | 'premiumHigh' // 波动率溢价最高
  | 'premiumLow'; // 波动率溢价最低

export interface HotSection {
  type: HotSectionType;
  title: string;
  data: MarketDataItem[];
}

