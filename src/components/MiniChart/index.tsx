import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, LineSeries } from 'lightweight-charts';

interface MiniChartProps {
  data: { time: number; value: number }[];
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = React.memo(({ data, height = 40 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#86909C',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      crosshair: { mode: 0 },
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      handleScroll: false,
      handleScale: false,
    });

    // lightweight-charts 5.0 使用 addSeries 方法，传入 LineSeries 对象
    const series = chart.addSeries(LineSeries, {
      color: '#1B53E5',
    }) as ISeriesApi<'Line'>;

    chartRef.current = chart;
    seriesRef.current = series;

    // 处理窗口大小变化
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const chartData = data.map(item => ({
        time: item.time as unknown as any,
        value: item.value,
      }));
      seriesRef.current.setData(chartData);
      
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [data]);

  return (
    <div 
      ref={chartContainerRef} 
      style={{ width: '100%', height: `${height}px` }}
    />
  );
});

MiniChart.displayName = 'MiniChart';

export default MiniChart;

