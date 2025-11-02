import type { TagType, MarketDataItem, HotSection } from '@/types';
import { generateMockData, getHotSectionsData } from '@utils/mockData';

export const useMarketData = () => {
  const [selectedTag, setSelectedTag] = useState<TagType>('全部');
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<MarketDataItem[]>([]);

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    // 模拟API延迟
    setTimeout(() => {
      const data = generateMockData(selectedTag);
      setAllData(data);
      setLoading(false);
    }, 300);
  }, [selectedTag]);

  // 热门板块数据
  const hotSectionsData = useMemo<HotSection[]>(() => {
    if (allData.length === 0) return [];
    return getHotSectionsData(allData);
  }, [allData]);

  // 表格数据
  const tableData = useMemo<MarketDataItem[]>(() => {
    return allData;
  }, [allData]);

  return {
    selectedTag,
    setSelectedTag,
    hotSectionsData,
    tableData,
    loading,
  };
};

