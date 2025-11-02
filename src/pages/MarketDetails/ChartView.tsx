import { createChart, IChartApi, ISeriesApi, ColorType, CandlestickSeries, LineSeries, createSeriesMarkers } from 'lightweight-charts';
import type { MarketDataItem } from '@/types';
import type { CandlestickData, LineData, Time, SeriesMarker } from 'lightweight-charts';
import './ChartView.css';

interface ChartDataPoint {
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

interface ChartViewProps {
  chartType: '分时' | '5日' | '日线';
  data: ChartDataPoint[];
  baseData: MarketDataItem;
}

const ChartView = memo<ChartViewProps>(({ chartType, data, baseData }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Line', Time, CandlestickData<Time> | LineData<Time>> | null>(null);
  const markersPluginRef = useRef<ReturnType<typeof createSeriesMarkers<Time>> | null>(null);
  const maxPriceLineRef = useRef<ReturnType<ISeriesApi<'Line', Time, LineData<Time>>['createPriceLine']> | null>(null);
  const minPriceLineRef = useRef<ReturnType<ISeriesApi<'Line', Time, LineData<Time>>['createPriceLine']> | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    price: number;
    priceChangePercent: number;
    open: number;
    high: number;
    low: number;
    close: number;
    impliedVol: number;
    volume: number;
    openInterest: number;
  } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 创建图表（响应式高度）
    const getChartHeight = () => {
      if (window.innerWidth <= 480) return 300;
      if (window.innerWidth <= 768) return 400;
      if (window.innerWidth <= 1024) return 500;
      return 600;
    };

    const isMobile = window.innerWidth <= 768;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#FFFFFF',
      },
      width: chartContainerRef.current.clientWidth,
      height: getChartHeight(),
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      timeScale: {
        timeVisible: !isMobile, // 移动端隐藏时间显示
        secondsVisible: false,
        rightOffset: isMobile ? 0 : 0, // 移动端减少右侧偏移
      },
      rightPriceScale: {
        visible: true,
        borderColor: '#1A1A1A',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        entireTextOnly: isMobile, // 移动端只显示完整数字
      },
      leftPriceScale: {
        visible: false, // 隐藏左侧价格刻度
      },
      // 移动端启用十字光标，显示价格标签
      crosshair: {
        mode: isMobile ? 1 : 0, // 移动端显示十字光标模式
        vertLine: {
          color: '#1A1A1A',
          width: 1,
          style: 2, // 虚线
          visible: true,
          labelVisible: true,
          labelBackgroundColor: '#1D2129',
        },
        horzLine: {
          color: '#1A1A1A',
          width: 1,
          style: 2, // 虚线
          visible: true,
          labelVisible: isMobile, // 移动端在左侧显示价格标签
          labelBackgroundColor: '#1D2129',
        },
      },
    });

    chartRef.current = chart;

    // 根据图表类型创建不同的系列
    let series: ISeriesApi<'Candlestick' | 'Line', Time, CandlestickData<Time> | LineData<Time>>;
    
    if (chartType === '日线') {
      // 日线使用K线图
      series = chart.addSeries(CandlestickSeries, {
        upColor: '#089981',
        downColor: '#F23645',
        borderVisible: false,
        wickUpColor: '#089981',
        wickDownColor: '#F23645',
      }) as ISeriesApi<'Candlestick', Time, CandlestickData<Time>>;
    } else {
      // 分时和5日使用折线图
      series = chart.addSeries(LineSeries, {
        color: '#089981',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      }) as ISeriesApi<'Line', Time, LineData<Time>>;
    }

    seriesRef.current = series;

    // 设置数据（转换时间格式为Unix时间戳）
    if (data && data.length > 0) {
      if (chartType === '日线') {
        // K线数据
        const candlestickData: CandlestickData<Time>[] = data.map(item => ({
          time: item.time as Time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
        (series as ISeriesApi<'Candlestick', Time, CandlestickData<Time>>).setData(candlestickData);
      } else {
        // 折线数据（使用close作为value）
        const lineData: LineData<Time>[] = data.map(item => ({
          time: item.time as Time,
          value: item.close,
        }));
        (series as ISeriesApi<'Line', Time, LineData<Time>>).setData(lineData);
      }
      chart.timeScale().fitContent();
    }

    // 处理鼠标移动事件
    chart.subscribeCrosshairMove((param) => {
      if (param.point === undefined || !param.time || !param.seriesData) {
        setTooltipData(null);
        return;
      }

      const seriesData = param.seriesData.get(series);
      if (seriesData) {
        // 查找对应的数据点（包含更多信息）
        let paramTime: number | null = null;
        if (param.time) {
          if (typeof param.time === 'number') {
            paramTime = param.time;
          } else if (typeof param.time === 'string') {
            paramTime = new Date(param.time).getTime() / 1000;
          }
        }
        
        const dataPoint = paramTime !== null ? data.find((d) => {
          return Math.abs(d.time - paramTime!) < 1; // 允许1秒误差
        }) : null;
        if (dataPoint) {
          let price: number;
          if (chartType === '日线' && 'close' in seriesData) {
            price = (seriesData as { close: number }).close;
          } else if ('value' in seriesData) {
            price = (seriesData as { value: number }).value;
          } else {
            price = dataPoint.close;
          }

          setTooltipData({
            price: price,
            priceChangePercent: dataPoint.priceChangePercent || 0,
            open: dataPoint.open,
            high: dataPoint.high,
            low: dataPoint.low,
            close: dataPoint.close,
            impliedVol: dataPoint.impliedVol || baseData.currentVol,
            volume: dataPoint.volume,
            openInterest: dataPoint.openInterest || 40093,
          });

          // 更新tooltip位置（固定在左上角）
          if (tooltipRef.current) {
            tooltipRef.current.style.left = '20px';
            tooltipRef.current.style.top = '20px';
          }
        }
      } else {
        setTooltipData(null);
      }
    });

    // 响应式处理
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const getChartHeight = () => {
          if (window.innerWidth <= 480) return 300;
          if (window.innerWidth <= 768) return 400;
          if (window.innerWidth <= 1024) return 500;
          return 600;
        };
        
        const isMobileNow = window.innerWidth <= 768;
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: getChartHeight(),
          timeScale: {
            timeVisible: !isMobileNow,
            secondsVisible: false,
          },
          rightPriceScale: {
            entireTextOnly: isMobileNow,
          },
          crosshair: {
            horzLine: {
              labelVisible: isMobileNow,
            },
          },
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // 清理标记插件
      if (markersPluginRef.current) {
        markersPluginRef.current.detach();
        markersPluginRef.current = null;
      }
      // 清理价格线
      if (seriesRef.current) {
        const lineSeries = seriesRef.current as ISeriesApi<'Line', Time, LineData<Time>>;
        if (maxPriceLineRef.current) {
          lineSeries.removePriceLine(maxPriceLineRef.current);
          maxPriceLineRef.current = null;
        }
        if (minPriceLineRef.current) {
          lineSeries.removePriceLine(minPriceLineRef.current);
          minPriceLineRef.current = null;
        }
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [chartType, data, baseData]);

  // 更新数据
  useEffect(() => {
    if (seriesRef.current && data && data.length > 0) {
      if (chartType === '日线') {
        // K线数据
        const candlestickData: CandlestickData<Time>[] = data.map(item => ({
          time: item.time as Time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
        (seriesRef.current as ISeriesApi<'Candlestick', Time, CandlestickData<Time>>).setData(candlestickData);
      } else {
        // 折线数据
        const lineData: LineData<Time>[] = data.map(item => ({
          time: item.time as Time,
          value: item.close,
        }));
        (seriesRef.current as ISeriesApi<'Line', Time, LineData<Time>>).setData(lineData);
        
        // 5日线标注最高点和最低点
        if (chartType === '5日' && seriesRef.current) {
          // 找到最高点和最低点
          let maxPrice = data[0].close;
          let minPrice = data[0].close;
          let maxIndex = 0;
          let minIndex = 0;
          
          data.forEach((item, index) => {
            if (item.close > maxPrice) {
              maxPrice = item.close;
              maxIndex = index;
            }
            if (item.close < minPrice) {
              minPrice = item.close;
              minIndex = index;
            }
          });
          
          // 创建标记
          const markers: SeriesMarker<Time>[] = [];
          
          // 最高点标记（向上箭头）
          markers.push({
            time: data[maxIndex].time as Time,
            position: 'belowBar',
            color: '#089981',
            shape: 'arrowUp',
            text: `最高: ${maxPrice.toFixed(2)}`,
          });
          
          // 最低点标记（向下箭头）
          markers.push({
            time: data[minIndex].time as Time,
            position: 'aboveBar',
            color: '#F23645',
            shape: 'arrowDown',
            text: `最低: ${minPrice.toFixed(2)}`,
          });
          
          // 如果已存在标记插件，先移除
          if (markersPluginRef.current) {
            markersPluginRef.current.detach();
          }
          
          // 创建并附加标记插件
          markersPluginRef.current = createSeriesMarkers(
            seriesRef.current as ISeriesApi<'Line', Time, LineData<Time>>,
            markers
          );
          
          // 移除已存在的价格线
          const lineSeries = seriesRef.current as ISeriesApi<'Line', Time, LineData<Time>>;
          if (maxPriceLineRef.current) {
            lineSeries.removePriceLine(maxPriceLineRef.current);
            maxPriceLineRef.current = null;
          }
          if (minPriceLineRef.current) {
            lineSeries.removePriceLine(minPriceLineRef.current);
            minPriceLineRef.current = null;
          }
          
          // 创建最高点横向虚线
          maxPriceLineRef.current = lineSeries.createPriceLine({
            price: maxPrice,
            color: '#089981',
            lineWidth: 1,
            lineStyle: 2, // 虚线
            axisLabelVisible: true,
            title: `最高: ${maxPrice.toFixed(2)}`,
          });
          
          // 创建最低点横向虚线
          minPriceLineRef.current = lineSeries.createPriceLine({
            price: minPrice,
            color: '#F23645',
            lineWidth: 1,
            lineStyle: 2, // 虚线
            axisLabelVisible: true,
            title: `最低: ${minPrice.toFixed(2)}`,
          });
        }
      }
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data, chartType]);

  return (
    <div className="chart-view-container">
      <div ref={chartContainerRef} className="chart-container" />
      {tooltipData && (
        <div ref={tooltipRef} className="chart-tooltip">
          <div className="tooltip-row">
            <span>价格{tooltipData.price.toFixed(1)}</span>
            <span>涨幅比{tooltipData.priceChangePercent >= 0 ? '+' : ''}{tooltipData.priceChangePercent.toFixed(2)}%</span>
            <span>开{tooltipData.open.toFixed(1)}</span>
            <span>高{tooltipData.high.toFixed(1)}</span>
            <span>低{tooltipData.low.toFixed(1)}</span>
            <span>收{tooltipData.close.toFixed(1)}</span>
            <span>隐波{tooltipData.impliedVol.toFixed(2)}%</span>
            <span>成交量{tooltipData.volume}</span>
            <span>持仓量{tooltipData.openInterest}</span>
          </div>
        </div>
      )}
    </div>
  );
});

ChartView.displayName = 'ChartView';

export default ChartView;
