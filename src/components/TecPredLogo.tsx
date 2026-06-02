import { TP } from '../theme';

interface TecPredLogoProps {
  variant?: 'light' | 'dark';
  size?: 'default' | 'compact';
  className?: string;
}

export default function TecPredLogo({
  variant = 'light',
  size = 'default',
  className = '',
}: TecPredLogoProps) {
  const isLight = variant === 'light';
  const compact = size === 'compact';

  const logoSize = compact ? 'h-8 w-[8.5rem]' : 'h-11 w-[11.75rem]';
  const color = isLight ? '#fff' : TP.primaryDark;

  return (
    <div className={`inline-flex items-center ${className}`} aria-label="TecPred" role="img">
      <svg
        className={logoSize}
        viewBox="0 0 340 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill={color}
          d="M15 0h34c13.3 0 24 10.7 24 24v24c0 7.7-3.7 14.9-9.9 19.4L45.8 80H14C6.3 80 0 73.7 0 66V14C0 6.3 6.3 0 14 0h1Zm22 16v48h7.1l12.9-9.3V25c0-5-4-9-9-9H37Z"
        />
        <path
          fill={color}
          d="M10 64h63v2c0 7.7-6.3 14-14 14H10V64Z"
        />
        <text
          x="91"
          y="61"
          fill={color}
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="50"
          fontWeight="800"
        >
          TecPred
        </text>
        <text
          x="316"
          y="22"
          fill={color}
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontSize="18"
          fontWeight="800"
        >
          {'\u00AE'}
        </text>
      </svg>
    </div>
  );
}
