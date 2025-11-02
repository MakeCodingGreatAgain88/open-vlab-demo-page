import { Layout, Card, Space, Segmented } from 'antd';
import Header from '@components/Header';
import ProgressGauge from '@components/GaugeChart';
import PriceChange from '@components/PriceChange';
import ErrorBoundary from '@components/ErrorBoundary';
import { useParams } from 'react-router-dom';
import { useMarketDetails } from '@hooks/useMarketDetails';
import ChartView from './ChartView';
import './MarketDetails.less';

const { Content } = Layout;

type ChartType = '分时' | '5日' | '日线';

const MarketDetails = () => {
  const { code } = useParams<{ code: string }>();
  const { data, loading, chartData, chartType, setChartType } = useMarketDetails(code || '');

  if (loading) {
    return (
      <ErrorBoundary>
        <Layout className="min-h-screen">
          <Header />
          <Content style={{ padding: '24px' }}>
            <div>加载中...</div>
          </Content>
        </Layout>
      </ErrorBoundary>
    );
  }

  if (!data) {
    return (
      <ErrorBoundary>
        <Layout className="min-h-screen">
          <Header />
          <Content style={{ padding: '24px' }}>
            <div>数据不存在</div>
          </Content>
        </Layout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Layout className="min-h-screen">
        <Header />
        <Content className="market-details">
          <div className="market-details-content">
          <div className="market-details-container">
            {/* Head 区域：展示现价、涨幅百分比、实波、隐波、偏度 */}
            <Card className="market-details-head">
              <Space size="large" wrap className="market-info-space">
                <div className="market-info-item">
                  <div className="market-info-label">现价</div>
                  <div className="market-info-value">{data.latestPrice.toFixed(2)}</div>
                </div>
                <div className="market-info-item">
                  <div className="market-info-label">涨幅百分比</div>
                  <div className="market-info-value">
                    <PriceChange value={data.priceChangePercent} />
                  </div>
                </div>
                <div className="market-info-item">
                  <div className="market-info-label">实波</div>
                  <div className="market-info-value">{data.realVol.toFixed(2)}</div>
                </div>
                <div className="market-info-item">
                  <div className="market-info-label">隐波</div>
                  <div className="market-info-value">{data.currentVol.toFixed(2)}</div>
                </div>
                <div className="market-info-item">
                  <div className="market-info-label">偏度</div>
                  <div className="market-info-value">
                    <ProgressGauge value={data.skewPercentile} />
                  </div>
                </div>
              </Space>
            </Card>

            {/* Content 区域：图表 */}
            <Card className="market-details-chart">
              <div className="chart-controls">
                <Segmented
                  options={['分时', '5日', '日线']}
                  value={chartType}
                  onChange={(value) => setChartType(value as ChartType)}
                />
              </div>
              <ChartView
                chartType={chartType}
                data={chartData}
                baseData={data}
              />
            </Card>
          </div>
          </div>
        </Content>
      </Layout>
    </ErrorBoundary>
  );
};

export default MarketDetails;
