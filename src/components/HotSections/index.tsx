import React from 'react';
import { Card, Table, Spin } from 'antd';
import { HotSection, MarketDataItem } from '../../types';
import MiniChart from '../MiniChart';
import PriceChange from '../PriceChange';
import './HotSections.css';

interface HotSectionsProps {
  data: HotSection[];
  loading: boolean;
}

const HotSections: React.FC<HotSectionsProps> = React.memo(({ data, loading }) => {
  if (loading) {
    return (
      <div className="hot-sections-loading">
        <Spin size="large" />
      </div>
    );
  }

  const renderSection = (section: HotSection) => {
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '标的涨幅%',
        dataIndex: 'priceChangePercent',
        key: 'priceChangePercent',
        width: 120,
        render: (value: number) => <PriceChange value={value} />,
      },
      {
        title: '隐波变化',
        dataIndex: 'volChange',
        key: 'volChange',
        width: 120,
        render: (value: number) => (
          <span style={{ color: value >= 0 ? 'rgb(239, 83, 80)' : 'rgb(8, 153, 129)' }}>
            {value >= 0 ? '+' : ''}{value.toFixed(2)}
          </span>
        ),
      },
      {
        title: '分时预览',
        key: 'chart',
        width: 150,
        render: (_: any, record: MarketDataItem) => (
          <MiniChart data={record.chartData} height={40} />
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
        />
      </Card>
    );
  };

  return (
    <div className="hot-sections">
      {data.map(renderSection)}
    </div>
  );
});

HotSections.displayName = 'HotSections';

export default HotSections;

