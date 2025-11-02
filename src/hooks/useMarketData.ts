import type { TagType, MarketDataItem, HotSection } from '@/types';
import { generateMockData, getHotSectionsData } from '@utils/mockData';

/**
 * 市场数据管理 Hook
 * 
 * 功能：
 * - 管理选中的标签筛选条件
 * - 管理市场数据的加载状态
 * - 根据标签筛选条件生成对应的模拟数据
 * - 计算热门板块数据（隐波最大上升/下降、溢价最高/最低）
 * 
 * @returns {Object} 返回市场数据相关的状态和方法
 */
export const useMarketData = () => {
  const [selectedTag, setSelectedTag] = useState<TagType>('全部');
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<MarketDataItem[]>([]);
  
  // 缓存每个 tag 的数据，确保数据固定不变
  const dataCache = useRef<Record<TagType, MarketDataItem[]>>({} as Record<TagType, MarketDataItem[]>);

  // 当标签改变时，重新加载数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 延迟，实际项目中应该调用真实的 API
    setTimeout(() => {
      try {
        // 如果缓存中没有该 tag 的数据，则生成新数据并缓存
        if (!dataCache.current[selectedTag]) {
          dataCache.current[selectedTag] = generateMockData(selectedTag);
        }
        // 使用缓存的数据，确保数据固定
        setAllData(dataCache.current[selectedTag]);
      } catch (error) {
        console.error('Failed to load market data:', error);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [selectedTag]);

  // 热门板块数据：根据隐波变化和溢价计算
  const hotSectionsData = useMemo<HotSection[]>(() => {
    if (!allData || allData.length === 0) return [];
    try {
      return getHotSectionsData(allData);
    } catch (error) {
      console.error('Failed to calculate hot sections:', error);
      return [];
    }
  }, [allData]);

  // 表格数据：直接返回所有数据，由 DataTable 组件负责排序和筛选
  // 注意：这里直接使用 allData，不创建新数组，确保数据引用稳定
  const tableData = useMemo<MarketDataItem[]>(() => {
    // 如果 allData 为空，返回空数组；否则返回原数组引用（确保稳定性）
    return allData.length === 0 ? [] : allData;
  }, [allData]);

  return {
    selectedTag,
    setSelectedTag,
    hotSectionsData,
    tableData,
    loading,
  };
};

