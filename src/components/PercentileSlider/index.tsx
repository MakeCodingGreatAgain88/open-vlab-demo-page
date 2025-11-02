const PercentileSlider = ({ value = 0 }) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const width = 100;
  const height = 8;
  const borderRadius = 4;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', flexShrink: 0 }}
      >
        <defs>
          {/* 渐变定义 - 从绿色到红色 */}
          <linearGradient id={`slider-gradient-${value}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16C784" stopOpacity="1" />
            <stop offset="25%" stopColor="#93D900" stopOpacity="1" />
            <stop offset="50%" stopColor="#F3D42F" stopOpacity="1" />
            <stop offset="75%" stopColor="#EA8C00" stopOpacity="1" />
            <stop offset="100%" stopColor="#EA3943" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* 背景（灰色） */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx={borderRadius}
          ry={borderRadius}
          fill="#666666"
        />
        {/* 进度条（渐变） */}
        {clampedValue > 0 && (
          <rect
            x="0"
            y="0"
            width={(clampedValue / 100) * width}
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill={`url(#slider-gradient-${value})`}
          />
        )}
      </svg>
      {/* 显示数值 */}
      <span
        style={{
          fontSize: '12px',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {clampedValue.toFixed(1)}%
      </span>
    </div>
  );
};

export default PercentileSlider;
