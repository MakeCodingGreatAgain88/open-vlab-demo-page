interface PriceChangeProps {
  value: number;
  showSign?: boolean;
}

const PriceChange = memo<PriceChangeProps>(({ value, showSign = true }: PriceChangeProps) => {
  const colorClass = value >= 0 ? 'text-[rgb(239,83,80)]' : 'text-[rgb(8,153,129)]';
  const displayValue = showSign && value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  
  return (
    <span className={colorClass}>
      {displayValue}%
    </span>
  );
});

PriceChange.displayName = 'PriceChange';

export default PriceChange;

