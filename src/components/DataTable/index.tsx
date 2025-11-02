import { Table, Tooltip, Card } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { MarketDataItem, TagType, IconType } from '@/types';
import MiniChart from '@components/MiniChart';
import PriceChange from '@components/PriceChange';
import './DataTable.css';

// 导入图标
import stockIndexIcon from '@assets/icon/stock-index.svg';
import nobleMetalIcon from '@assets/icon/noble-metal.svg';
import chemicalIcon from '@assets/icon/chemical.svg';
import agriculturalIcon from '@assets/icon/agricultural.svg';
import oilIcon from '@assets/icon/oil.svg';
import ferrousIcon from '@assets/icon/ferrous.svg';

interface DataTableProps {
  data: MarketDataItem[];
  loading: boolean;
  selectedTag: TagType;
}

type SortOrder = 'ascend' | 'descend' | null;

const columnDescriptions: Record<string, string> = {
  name: '标的名称，用于标识不同的金融产品',
  latestPrice: '当前最新的成交价格',
  priceChangePercent: '标的涨幅百分比，反映价格变动幅度',
  remainingTime: '距离合约到期或结算的剩余时间',
  currentVol: '当月隐含波动率，衡量市场对未来波动的预期',
  volChange: '隐含波动率的变化值，正数表示上升，负数表示下降',
  volChangeSpeed: '隐含波动率的涨速，反映波动率变化的快慢',
  realVol: '实际波动率，基于历史数据计算的实际波动程度',
  premium: '波动率溢价，隐含波动率与实际波动率的差值',
  currentSkew: '当月偏度，反映价格分布的偏斜程度',
  volPercentile: '隐含波动率的历史分位数，表示当前波动率在历史中的位置',
  skewPercentile: '偏度的历史分位数，表示当前偏度在历史中的位置',
  chart: '走势预览图表，展示价格或波动率的实时变化趋势',
};

// 图标类型到图标的映射（用于数据项）
const iconTypeMap: Record<NonNullable<IconType>, string> = {
  '股指': stockIndexIcon,
  '金属': nobleMetalIcon,
  '能化': chemicalIcon,
  '农副': agriculturalIcon,
  '油脂': oilIcon,
  '黑色': ferrousIcon,
};

const DataTable = memo<DataTableProps>(({ data, loading, selectedTag }: DataTableProps) => {
  const [sortedInfo, setSortedInfo] = useState<Record<string, SortOrder>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const prevSelectedTagRef = useRef<TagType>(selectedTag);

  // 当筛选条件改变时，重置分页到第一页
  useEffect(() => {
    if (prevSelectedTagRef.current !== selectedTag) {
      setCurrentPage(1);
      prevSelectedTagRef.current = selectedTag;
    }
  }, [selectedTag]);

  const handleChange: TableProps<MarketDataItem>['onChange'] = (
    pagination,
    _filters,
    sorter
  ) => {
    // 处理分页变化
    if (pagination) {
      if (pagination.current !== undefined) {
        setCurrentPage(pagination.current);
      }
      if (pagination.pageSize !== undefined) {
        setPageSize(pagination.pageSize);
        // 如果改变了每页条数，也重置到第一页
        if (pagination.current === undefined) {
          setCurrentPage(1);
        }
      }
    }

    // 处理排序变化
    if (Array.isArray(sorter)) {
      // 多列排序（本项目中只使用单列排序）
      return;
    }
    
    const { field, order } = sorter as { field?: string; order?: SortOrder };
    if (field) {
      setSortedInfo({ [field]: order || null });
    }
  };

  const getSortedData = () => {
    const sortKey = Object.keys(sortedInfo)[0];
    if (!sortKey || !sortedInfo[sortKey]) return data;

    const order = sortedInfo[sortKey];
    const sorted = [...data].sort((a, b) => {
      let aValue: any = a[sortKey as keyof MarketDataItem];
      let bValue: any = b[sortKey as keyof MarketDataItem];

      if (sortKey === 'name') {
        return order === 'ascend' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'ascend' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  };

  const renderColumnTitle = useCallback((key: string, title: string) => {
    return (
      <>
        <span>{title}</span>
        <span 
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <Tooltip
            title={
              <div className="column-description">
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#FFFFFF' }}>{title}</div>
                <div style={{ color: '#FFFFFF' }}>{columnDescriptions[key]}</div>
              </div>
            }
            placement="top"
            styles={{
              body: {
                backgroundColor: '#1D2129',
                color: '#FFFFFF',
              },
            }}
          >
            <QuestionCircleOutlined 
              className="column-info-icon"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </Tooltip>
        </span>
      </>
    );
  }, []);

  const columns: ColumnsType<MarketDataItem> = useMemo(() => [
    {
      title: renderColumnTitle('name', '名称'),
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left' as const,
      sorter: true,
      sortOrder: sortedInfo.name,
      render: (text: string, record: MarketDataItem) => {
        const icon = record.iconType ? iconTypeMap[record.iconType] : null;
        if (icon) {
          return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <img 
                src={icon} 
                alt={record.iconType || 'icon'}
                style={{ width: '16px', height: '16px', flexShrink: 0, display: 'block' }}
                onError={(e) => {
                  console.error('Failed to load icon for type:', record.iconType, 'icon path:', icon);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span>{text}</span>
            </span>
          );
        }
        return <span>{text}</span>;
      },
    },
    {
      title: renderColumnTitle('latestPrice', '最新价'),
      dataIndex: 'latestPrice',
      key: 'latestPrice',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.latestPrice,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: renderColumnTitle('priceChangePercent', '标的涨幅'),
      dataIndex: 'priceChangePercent',
      key: 'priceChangePercent',
      width: 120,
      sorter: true,
      sortOrder: sortedInfo.priceChangePercent,
      render: (value: number) => <PriceChange value={value} />,
    },
    {
      title: renderColumnTitle('remainingTime', '剩余时间'),
      dataIndex: 'remainingTime',
      key: 'remainingTime',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.remainingTime,
    },
    {
      title: renderColumnTitle('currentVol', '当月隐波'),
      dataIndex: 'currentVol',
      key: 'currentVol',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.currentVol,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: renderColumnTitle('volChange', '隐波变化'),
      dataIndex: 'volChange',
      key: 'volChange',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.volChange,
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'rgb(239, 83, 80)' : 'rgb(8, 153, 129)' }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      ),
    },
    {
      title: renderColumnTitle('volChangeSpeed', '隐波涨速'),
      dataIndex: 'volChangeSpeed',
      key: 'volChangeSpeed',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.volChangeSpeed,
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'rgb(239, 83, 80)' : 'rgb(8, 153, 129)' }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      ),
    },
    {
      title: renderColumnTitle('realVol', '实波'),
      dataIndex: 'realVol',
      key: 'realVol',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.realVol,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: renderColumnTitle('premium', '溢价'),
      dataIndex: 'premium',
      key: 'premium',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.premium,
      render: (value: number) => (
        <span style={{ color: value >= 0 ? 'rgb(239, 83, 80)' : 'rgb(8, 153, 129)' }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}
        </span>
      ),
    },
    {
      title: renderColumnTitle('currentSkew', '当月偏度'),
      dataIndex: 'currentSkew',
      key: 'currentSkew',
      width: 100,
      sorter: true,
      sortOrder: sortedInfo.currentSkew,
      render: (value: number) => value.toFixed(3),
    },
    {
      title: renderColumnTitle('volPercentile', '隐波比分位'),
      dataIndex: 'volPercentile',
      key: 'volPercentile',
      width: 120,
      sorter: true,
      sortOrder: sortedInfo.volPercentile,
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: renderColumnTitle('skewPercentile', '偏度百分位'),
      dataIndex: 'skewPercentile',
      key: 'skewPercentile',
      width: 120,
      sorter: true,
      sortOrder: sortedInfo.skewPercentile,
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: renderColumnTitle('chart', '走势预览'),
      key: 'chart',
      width: 200,
      render: (_: any, record: MarketDataItem) => (
        <div className="chart-preview-wrapper">
          <MiniChart key={`table-${record.id}`} data={record.chartData} height={60} />
        </div>
      ),
    },
  ], [sortedInfo, renderColumnTitle, selectedTag]);

  return (
    <div className="data-table-card">
      <Table
        columns={columns}
        dataSource={getSortedData()}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1600, y: 600 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        onChange={handleChange}
        size="middle"
        showSorterTooltip={false}
        bordered={false}
        components={{
          body: {
            cell: (props: any) => (
              <td {...props} style={{ ...props.style, borderBottom: 'none' }} />
            ),
          },
          header: {
            cell: (props: any) => (
              <th {...props} style={{ ...props.style, borderBottom: 'none' }} />
            ),
          },
        }}
      />
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;

