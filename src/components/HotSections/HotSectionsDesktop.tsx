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
}

const HotSectionsDesktop = memo<HotSectionsDesktopProps>(({ data }: HotSectionsDesktopProps) => {
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {icon && (
                  <img 
                    src={icon} 
                    alt={record.iconType || 'icon'}
                    style={{ width: '16px', height: '16px', flexShrink: 0, display: 'block' }}
                    onError={(e) => {
                      console.error('Failed to load icon for type:', record.iconType, 'icon path:', icon);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
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
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: value >= 0 ? 'rgb(239, 83, 80)' : 'rgb(8, 153, 129)' }}>
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
        />
      </Card>
    );
  };

  return (
    <div className="hot-sections-desktop">
      {data.map(renderSection)}
    </div>
  );
});

HotSectionsDesktop.displayName = 'HotSectionsDesktop';

export default HotSectionsDesktop;

