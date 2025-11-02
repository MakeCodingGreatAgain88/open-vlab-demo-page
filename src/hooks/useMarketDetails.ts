import type { MarketDataItem } from '@/types';
import { generateMarketDetailsData } from '@utils/marketDetailsData';

type ChartType = '分时' | '5日' | '日线';

export interface ChartDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  openInterest?: number;
  impliedVol?: number;
  priceChangePercent?: number;
}

interface UseMarketDetailsReturn {
  data: MarketDataItem | null;
  loading: boolean;
  chartData: ChartDataPoint[];
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
}

export const useMarketDetails = (code: string): UseMarketDetailsReturn => {
  const [data, setData] = useState<MarketDataItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('分时');

  useEffect(() => {
    if (!code) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    // 模拟API延迟
    setTimeout(() => {
      try {
        // 根据code生成模拟数据
        const mockData = generateMarketDetailsData(code);
        setData(mockData);
      } catch (error) {
        console.error('Failed to load market details:', error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [code]);

  const chartData = useMemo(() => {
    if (!data || !code) return [];
    // 根据图表类型生成不同的数据
    const fullData = generateMarketDetailsData(code, chartType);
    return fullData.chartData as ChartDataPoint[];
  }, [data, chartType, code]);

  return {
    data,
    loading,
    chartData,
    chartType,
    setChartType,
  };
};
