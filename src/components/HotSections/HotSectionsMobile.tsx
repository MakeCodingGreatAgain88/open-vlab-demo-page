import { Card, Tag, Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import type { HotSection, HotSectionType } from '@/types';
import MiniChart from '@components/MiniChart';
import PriceChange from '@components/PriceChange';

interface HotSectionsMobileProps {
  data: HotSection[];
  loading?: boolean;
}

const HotSectionsMobile = memo<HotSectionsMobileProps>(({ data, loading: _loading = false }: HotSectionsMobileProps) => {
  const [selectedSection, setSelectedSection] = useState<HotSectionType>('volUp');
  const [expanded, setExpanded] = useState<boolean>(false);

  const sectionTitles = [
    { type: 'volUp' as HotSectionType, title: '隐波最大上升' },
    { type: 'volDown' as HotSectionType, title: '隐波最大下降' },
    { type: 'premiumHigh' as HotSectionType, title: '波动率溢价最高' },
    { type: 'premiumLow' as HotSectionType, title: '波动率溢价最低' },
  ];

  const currentSection = data.find(s => s.type === selectedSection);

  return (
    <div className="hot-sections-mobile">
      <div className="hot-sections-filter-wrapper">
        <div className="hot-sections-filter-title">TOP5热门数据</div>
        <div className="hot-sections-filter">
          <div className="hot-sections-filter-list-wrapper">
            <div className="hot-sections-filter-list">
              {sectionTitles.map((item) => (
                <Tag
                  key={item.type}
                  className={`hot-section-filter-tag ${selectedSection === item.type ? 'selected' : ''}`}
                  onClick={() => setSelectedSection(item.type)}
                >
                  {item.title}
                </Tag>
              ))}
            </div>
          </div>
          <Button
            type="text"
            icon={expanded ? <UpOutlined /> : <DownOutlined />}
            onClick={() => setExpanded(!expanded)}
            className="hot-sections-expand-btn"
          >
            {expanded ? '收起' : '展开'}
          </Button>
        </div>
      </div>
      <div className={`hot-sections-card-grid ${expanded ? 'expanded' : 'collapsed'}`}>
        {expanded && currentSection && currentSection.data.map((item) => (
          <Card key={item.id} className="hot-section-item-card">
            <div className="hot-section-item-content">
              <div className="hot-section-item-top">
                <div className="hot-section-item-name">{item.name}</div>
                <div className="hot-section-item-row">
                  <span className="hot-section-item-label">涨幅：</span>
                  <PriceChange value={item.priceChangePercent} />
                </div>
                <div className="hot-section-item-row">
                  <span className="hot-section-item-label">变化：</span>
                  <span className={item.volChange >= 0 ? 'text-[rgb(239,83,80)]' : 'text-[rgb(8,153,129)]'}>
                    {item.volChange >= 0 ? '+' : ''}{item.volChange.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="hot-section-item-bottom">
                <div className="hot-section-item-label">分时预览</div>
                <div className="hot-section-item-chart">
                  {expanded && <MiniChart key={`${item.id}-${expanded}`} data={item.chartData} height={60} />}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

HotSectionsMobile.displayName = 'HotSectionsMobile';

export default HotSectionsMobile;

