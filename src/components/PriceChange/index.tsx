interface PriceChangeProps {
  value: number;
  showSign?: boolean;
}

const PriceChange = memo<PriceChangeProps>(({ value, showSign = true }: PriceChangeProps) => {
  const color = value >= 0 ? 'rgb(239, 83, 80)' : 'rgb(8, 153, 129)';
  const displayValue = showSign && value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  
  return (
    <span style={{ color }}>
      {displayValue}%
    </span>
  );
});

PriceChange.displayName = 'PriceChange';

export default PriceChange;

