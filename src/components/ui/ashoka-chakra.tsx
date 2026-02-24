import { cn } from "@/lib/utils";

interface AshokaChakraProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export const AshokaChakra = ({ size = 40, className, animate = true }: AshokaChakraProps) => {
  const spokes = 24;
  const cx = 50;
  const cy = 50;
  const outerR = 45;
  const innerR = 12;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn(animate && "animate-chakra-spin", className)}
    >
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="hsl(220, 70%, 28%)" strokeWidth="3" />
      {/* Inner circle */}
      <circle cx={cx} cy={cy} r={innerR} fill="hsl(220, 70%, 28%)" />
      {/* 24 spokes */}
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i * 360) / spokes - 90;
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + innerR * Math.cos(rad);
        const y1 = cy + innerR * Math.sin(rad);
        const x2 = cx + outerR * Math.cos(rad);
        const y2 = cy + outerR * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="hsl(220, 70%, 28%)"
            strokeWidth="1.5"
          />
        );
      })}
      {/* Small circles between spokes on outer ring */}
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = ((i + 0.5) * 360) / spokes - 90;
        const rad = (angle * Math.PI) / 180;
        const r = outerR - 6;
        const x = cx + r * Math.cos(rad);
        const y = cy + r * Math.sin(rad);
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r="1.5"
            fill="hsl(220, 70%, 28%)"
          />
        );
      })}
    </svg>
  );
};
