import './MiniChart.css';

interface MiniChartProps {
  data: { time: number; value: number }[];
  height?: number;
}

const MiniChart = memo<MiniChartProps>(({ data, height = 40 }: MiniChartProps) => {
  // 将数据转换为 SVG 路径
  const { path, viewBox } = useMemo(() => {
    if (!data || data.length === 0) {
      return { path: '', viewBox: '0 0 200 40' };
    }

    // 计算值的范围（留一些边距）
    const values = data.map((item: { time: number; value: number }) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1; // 避免除零
    const padding = range * 0.1; // 10% 的边距
    const minValue = min - padding;
    const maxValue = max + padding;
    const valueRange = maxValue - minValue;

    // 假设宽度为 200（SVG viewBox 的宽度）
    // 实际渲染时会通过 CSS width: 100% 自动缩放
    const svgWidth = 200;
    const svgHeight = height;

    // 生成路径点
    const points = data.map((item: { time: number; value: number }, index: number) => {
      const x = (index / (data.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((item.value - minValue) / valueRange) * svgHeight;
      return { x, y };
    });

    // 生成 SVG 路径字符串（使用平滑曲线）
    let pathString = '';
    if (points.length > 0) {
      // 移动到第一个点
      pathString += `M ${points[0].x} ${points[0].y} `;
      
      if (points.length === 1) {
        // 只有一个点，画一个点
        pathString += `L ${points[0].x} ${points[0].y}`;
      } else if (points.length === 2) {
        // 两个点，画直线
        pathString += `L ${points[1].x} ${points[1].y}`;
      } else {
        // 多个点，使用平滑曲线
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          
          if (i === 1) {
            // 第一个线段
            const cp1x = prev.x + (curr.x - prev.x) / 3;
            const cp1y = prev.y;
            const cp2x = curr.x - (curr.x - prev.x) / 3;
            const cp2y = curr.y;
            pathString += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y} `;
          } else {
            // 后续线段使用平滑曲线
            const prevPrev = points[i - 2];
            const cp1x = prev.x + (curr.x - prevPrev.x) / 6;
            const cp1y = prev.y;
            const cp2x = curr.x - (curr.x - prev.x) / 3;
            const cp2y = curr.y;
            pathString += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y} `;
          }
        }
      }
    }

    return {
      path: pathString,
      viewBox: `0 0 ${svgWidth} ${svgHeight}`,
    };
  }, [data, height]);

  return (
    <div 
      className="lightweight-chart-wrapper"
      style={{ width: '100%', height: `${height}px`, minHeight: `${height}px` }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block' }}
        className="mini-chart-svg"
      >
        <defs>
          {/* 渐变填充（可选） */}
          <linearGradient id={`gradient-${height}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(37, 167, 80)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(37, 167, 80)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 填充区域 */}
        {path && (
          <path
            d={`${path} L ${viewBox.split(' ')[2]} ${viewBox.split(' ')[3]} L 0 ${viewBox.split(' ')[3]} Z`}
            fill={`url(#gradient-${height})`}
            className="mini-chart-area"
          />
        )}
        {/* 折线 */}
        {path && (
          <path
            d={path}
            fill="none"
            stroke="rgb(37, 167, 80)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mini-chart-line"
          />
        )}
      </svg>
    </div>
  );
});

MiniChart.displayName = 'MiniChart';

export default MiniChart;
