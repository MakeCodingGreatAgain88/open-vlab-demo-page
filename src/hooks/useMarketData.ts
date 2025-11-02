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

  // 当标签改变时，重新加载数据
  useEffect(() => {
    setLoading(true);
    // 模拟 API 延迟，实际项目中应该调用真实的 API
    setTimeout(() => {
      try {
        const data = generateMockData(selectedTag);
        setAllData(data);
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
  const tableData = useMemo<MarketDataItem[]>(() => {
    return allData || [];
  }, [allData]);

  return {
    selectedTag,
    setSelectedTag,
    hotSectionsData,
    tableData,
    loading,
  };
};

