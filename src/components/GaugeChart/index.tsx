const ProgressGauge = ({ value = 0 }) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const RADIUS = 40.77;
  const CENTER_X = 50;
  const CENTER_Y = 54.61538461538461;
  const VIEWBOX_HEIGHT = 61.53846153846154;

  const angleDeg = 180 - (clampedValue / 100) * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const cx = CENTER_X + RADIUS * Math.cos(angleRad);
  const cy = CENTER_Y - RADIUS * Math.sin(angleRad);

  return (
    <svg
      height="36"
      viewBox={`0 0 100 ${VIEWBOX_HEIGHT}`}
      width="100"
    >
      <path
        d="M 9.229999999999999 54.61538461538461 A 40.77 40.77 0 0 1 14.549999999999999 34.480000000000004"
        fill="none"
        stroke="#16C784"
        strokeLinecap="round"
        strokeWidth="4.62"
      />
      <path
        d="M 17.7 29.74153846153846 A 40.77 40.77 0 0 1 34.2 17.033846153846152"
        fill="none"
        stroke="#93D900"
        strokeLinecap="round"
        strokeWidth="4.62"
      />
      <path
        d="M 39.589999999999996 15.200000000000001 A 40.77 40.77 0 0 1 60.41 15.200000000000001"
        fill="none"
        stroke="#F3D42F"
        strokeLinecap="round"
        strokeWidth="4.62"
      />
      <path
        d="M 65.8 17.033846153846152 A 40.77 40.77 0 0 1 82.3 29.74153846153846"
        fill="none"
        stroke="#EA8C00"
        strokeLinecap="round"
        strokeWidth="4.62"
      />
      <path
        d="M 85.45 34.480000000000004 A 40.77 40.77 0 0 1 90.77 54.61538461538461"
        fill="none"
        stroke="#EA3943"
        strokeLinecap="round"
        strokeWidth="4.62"
      />
      <circle
        cx={cx.toFixed(8)}
        cy={cy.toFixed(8)}
        fill="white"
        r="4.62"
        stroke="var(--background)"
        strokeWidth="1.54"
      />
      <text
        fill="white"
        fontSize="20"
        fontWeight="500"
        textAnchor="middle"
        x="50"
        y="56.61538461538462"
      >
        {Math.round(clampedValue)}
      </text>
    </svg>
  );
};

export default ProgressGauge;