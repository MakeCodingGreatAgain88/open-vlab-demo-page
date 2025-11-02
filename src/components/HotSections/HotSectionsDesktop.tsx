import { Card, Table, Tooltip } from 'antd';
import type { HotSection, MarketDataItem, IconType } from '@/types';
import MiniChart from '@components/MiniChart';
import PriceChange from '@components/PriceChange';

// 导入图标
import stockIndexIcon from '@assets/icon/stock-index.svg';
import nobleMetalIcon from '@assets/icon/noble-metal.svg';
import chemicalIcon from '@assets/icon/chemical.svg';
import agriculturalIcon from '@assets/icon/agricultural.svg';
import oilIcon from '@assets/icon/oil.svg';
import ferrousIcon from '@assets/icon/ferrous.svg';

// 图标类型到图标的映射（用于数据项）
const iconTypeMap: Record<NonNullable<IconType>, string> = {
  '股指': stockIndexIcon,
  '金属': nobleMetalIcon,
  '能化': chemicalIcon,
  '农副': agriculturalIcon,
  '油脂': oilIcon,
  '黑色': ferrousIcon,
};

interface HotSectionsDesktopProps {
  data: HotSection[];
  loading?: boolean;
}

const HotSectionsDesktop = memo<HotSectionsDesktopProps>(({ data, loading = false }: HotSectionsDesktopProps) => {
  const navigate = useNavigate();
  
  const renderSection = (section: HotSection) => {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 80,
        fixed: 'left' as const,
        className: 'hot-section-col-name',
        render: (text: string, record: MarketDataItem) => {
          const icon = record.iconType ? iconTypeMap[record.iconType] : null;
          return (
            <Tooltip title={text} styles={{ body: { backgroundColor: '#1D2129', color: '#FFFFFF' } }}>
              <div className="flex items-center gap-1.5">
                {icon && (
                  <img 
                    src={icon} 
                    alt={record.iconType || 'icon'}
                    className="w-4 h-4 flex-shrink-0 self-center"
                    onError={(e) => {
                      console.error('Failed to load icon for type:', record.iconType, 'icon path:', icon);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{text}</span>
                  <span className="text-xs text-[#86909C]">{record.categoryCode}</span>
                </div>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: '标的涨幅%',
        dataIndex: 'priceChangePercent',
        key: 'priceChangePercent',
        width: 90,
        className: 'hot-section-col-price',
        render: (value: number) => {
          const displayValue = `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
          return (
            <Tooltip title={displayValue} styles={{ body: { backgroundColor: '#1D2129', color: '#FFFFFF' } }}>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                <PriceChange value={value} />
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: '隐波变化',
        dataIndex: 'volChange',
        key: 'volChange',
        width: 90,
        className: 'hot-section-col-vol',
        render: (value: number) => {
          const displayValue = `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
          return (
            <Tooltip title={displayValue} styles={{ body: { backgroundColor: '#1D2129', color: '#FFFFFF' } }}>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                <span className={value >= 0 ? 'text-[rgb(239,83,80)]' : 'text-[rgb(8,153,129)]'}>
                  {displayValue}
                </span>
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: '分时预览',
        key: 'chart',
        width: 120,
        className: 'hot-section-col-chart',
        render: (_: any, record: MarketDataItem) => (
          <div className="hot-section-chart-wrapper">
            <MiniChart key={`${section.type}-${record.id}`} data={record.chartData} height={40} />
          </div>
        ),
      },
    ];

    return (
      <Card
        key={section.type}
        title={section.title}
        className="hot-section-card"
        size="small"
      >
        <Table
          dataSource={section.data}
          columns={columns}
          pagination={false}
          rowKey="id"
          size="small"
          bordered={false}
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/market/${record.categoryCode}`);
            },
            className: 'cursor-pointer',
          })}
        />
      </Card>
    );
  };

  // 如果数据为空且不在加载中，返回空内容
  if (data.length === 0 && !loading) {
    return null;
  }

  // 如果数据为空但在加载中，渲染占位卡片以保持布局
  if (data.length === 0 && loading) {
    const sectionTitles = ['隐波最大上升', '隐波最大下降', '波动率溢价最高', '波动率溢价最低'];
    const columns = [
      { title: '名称', key: 'name', width: 80, fixed: 'left' as const, className: 'hot-section-col-name' },
      { title: '标的涨幅%', key: 'price', width: 90, className: 'hot-section-col-price' },
      { title: '隐波变化', key: 'vol', width: 90, className: 'hot-section-col-vol' },
      { title: '分时预览', key: 'chart', width: 120, className: 'hot-section-col-chart' },
    ];

    return (
      <div className="hot-sections-desktop">
        {sectionTitles.map((title) => (
          <Card
            key={title}
            title={title}
            className="hot-section-card h-[432px] flex flex-col"
            size="small"
            bodyStyle={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '12px',
              minHeight: 0,
              overflow: 'hidden',
              height: '384px' // 432px 总高度 - 头部高度 48px
            }}
          >
            <Table
              dataSource={[]}
              columns={columns}
              pagination={false}
              rowKey="key"
              size="small"
              bordered={false}
              loading={loading}
              scroll={{ y: 360 }} // 384px body高度 - 24px padding = 360px
            />
          </Card>
        ))}
      </div>
    );
  }

  // 有数据时，直接渲染，Table 的 loading 会在数据上显示遮罩层
  return (
    <div className="hot-sections-desktop">
      {data.map(renderSection)}
    </div>
  );
});

HotSectionsDesktop.displayName = 'HotSectionsDesktop';

export default HotSectionsDesktop;

