import './MiniChart.css';

interface MiniChartProps {
  data: { time: number; value: number; value1: number }[];
  height?: number;
}

// 格式化时间戳为时间字符串（如 "21:00"）
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const MiniChart = memo<MiniChartProps>(({ data, height = 40 }: MiniChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [textScale, setTextScale] = useState({ scaleX: 1, scaleY: 1 });
  // 将数据转换为 SVG 路径
  const { path, path1, viewBox, startTimeText, endTimeText, textY, svgWidth } = useMemo(() => {
    // 边界情况处理：数据为空或无效
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { 
        path: '', 
        path1: '', 
        viewBox: '0 0 200 48', 
        startTimeText: '', 
        endTimeText: '', 
        textY: 48,
        svgWidth: 200
      };
    }

    try {
      // 计算值的范围（留一些边距），需要同时考虑 value 和 value1
      const values = data
        .map((item: { time: number; value: number; value1: number }) => item?.value ?? 0)
        .filter((val) => typeof val === 'number' && !isNaN(val));
      
      const values1 = data
        .map((item: { time: number; value: number; value1: number }) => item?.value1 ?? 0)
        .filter((val) => typeof val === 'number' && !isNaN(val));
      
      if (values.length === 0) {
        return { 
          path: '', 
          path1: '', 
          viewBox: '0 0 200 48', 
          startTimeText: '', 
          endTimeText: '', 
          textY: 48,
          svgWidth: 200
        };
      }

      const allValues = [...values, ...values1];
      const min = Math.min(...allValues);
      const max = Math.max(...allValues);
      const range = max - min || 1; // 避免除零
      const padding = range * 0.1; // 10% 的边距
      const minValue = min - padding;
      const maxValue = max + padding;
      const valueRange = maxValue - minValue;

    // 假设宽度为 200（SVG viewBox 的宽度）
    // 实际渲染时会通过 CSS width: 100% 自动缩放
    // 高度增加 8px 用于显示时间文本
    const svgWidth = 200;
    const svgHeight = height;
    const chartHeight = svgHeight; // 图表区域高度
    const textY = svgHeight + 8; // 文本 Y 位置
    const totalHeight = textY; // 总高度

    // 生成第一条线的路径点（value）
    const points = data.map((item: { time: number; value: number; value1: number }, index: number) => {
      const x = (index / (data.length - 1 || 1)) * svgWidth;
      const y = chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
      return { x, y };
    });

    // 生成第二条线的路径点（value1）
    const points1 = data.map((item: { time: number; value: number; value1: number }, index: number) => {
      const x = (index / (data.length - 1 || 1)) * svgWidth;
      const y = chartHeight - ((item.value1 - minValue) / valueRange) * chartHeight;
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

      // 生成第二条线的路径字符串
      let pathString1 = '';
      if (points1.length > 0) {
        pathString1 += `M ${points1[0].x} ${points1[0].y} `;
        
        if (points1.length === 1) {
          pathString1 += `L ${points1[0].x} ${points1[0].y}`;
        } else if (points1.length === 2) {
          pathString1 += `L ${points1[1].x} ${points1[1].y}`;
        } else {
          for (let i = 1; i < points1.length; i++) {
            const prev = points1[i - 1];
            const curr = points1[i];
            
            if (i === 1) {
              const cp1x = prev.x + (curr.x - prev.x) / 3;
              const cp1y = prev.y;
              const cp2x = curr.x - (curr.x - prev.x) / 3;
              const cp2y = curr.y;
              pathString1 += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y} `;
            } else {
              const prevPrev = points1[i - 2];
              const cp1x = prev.x + (curr.x - prevPrev.x) / 6;
              const cp1y = prev.y;
              const cp2x = curr.x - (curr.x - prev.x) / 3;
              const cp2y = curr.y;
              pathString1 += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y} `;
            }
          }
        }
      }

      // 格式化起始时间和结束时间
      const startTime = data.length > 0 ? formatTime(data[0].time) : '';
      const endTime = data.length > 0 ? formatTime(data[data.length - 1].time) : '';

      return {
        path: pathString,
        path1: pathString1,
        viewBox: `0 0 ${svgWidth} ${totalHeight}`,
        startTimeText: startTime,
        endTimeText: endTime,
        textY,
        svgWidth,
      };
    } catch (error) {
      // 错误处理：如果数据转换失败，返回空图表
      console.error('MiniChart data processing error:', error);
      return { 
        path: '', 
        path1: '', 
        viewBox: '0 0 200 48', 
        startTimeText: '', 
        endTimeText: '', 
        textY: 48,
        svgWidth: 200
      };
    }
  }, [data, height]);

  // 计算文本缩放比例，使文本不被 SVG 缩放影响
  useEffect(() => {
    if (!svgRef.current) return;
    
    const updateScale = () => {
      const svg = svgRef.current;
      if (!svg) return;
      
      const viewBoxParts = viewBox.split(' ');
      const viewBoxWidth = parseFloat(viewBoxParts[2]);
      const viewBoxHeight = parseFloat(viewBoxParts[3]);
      
      const rect = svg.getBoundingClientRect();
      const scaleX = viewBoxWidth / rect.width;
      const scaleY = viewBoxHeight / rect.height;
      
      setTextScale({ scaleX, scaleY });
    };
    
    updateScale();
    
    // 监听窗口大小变化
    window.addEventListener('resize', updateScale);
    
    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(updateScale);
    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateScale);
      resizeObserver.disconnect();
    };
  }, [viewBox]);

  return (
    <div 
      className="w-full block"
      style={{ height: `${textY}px`, minHeight: `${textY}px` }} // 动态高度需要内联样式，包含文本区域
    >
      <svg
        ref={svgRef}
        viewBox={viewBox}
        preserveAspectRatio="none"
        className="w-full h-full block"
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
        {/* 第一条折线 */}
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
        {/* 第二条折线（只有线，没有 area） */}
        {path1 && (
          <path
            d={path1}
            fill="none"
            stroke="purple"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mini-chart-line"
          />
        )}
        {/* 起始时间文本 - 使用 transform 抵消 SVG 缩放 */}
        {startTimeText && (
          <text 
            x="0" 
            y={textY} 
            fill="white" 
            fontSize="10" 
            textAnchor="start"
            transform={`scale(${textScale.scaleX}, ${textScale.scaleY})`}
          >
            {startTimeText}
          </text>
        )}
        {/* 结束时间文本 - 使用 transform 抵消 SVG 缩放 */}
        {endTimeText && (
          <g transform={`translate(${svgWidth}, ${textY})`}>
            <text 
              x={0} 
              y={0} 
              fill="white" 
              fontSize="10" 
              textAnchor="end"
              transform={`scale(${textScale.scaleX}, ${textScale.scaleY})`}
            >
              {endTimeText}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
});

MiniChart.displayName = 'MiniChart';

export default MiniChart;
