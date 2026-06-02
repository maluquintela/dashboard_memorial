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
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13 0h35c10.7 0 19 8.2 19 18.8v23.5c0 7.5-3.6 14.6-9.7 18.9L42 72h27v8H13C5.8 80 0 74.2 0 67V13C0 5.8 5.8 0 13 0Zm16 16v48h5.6l17.9-12.8A9.5 9.5 0 0 0 56.5 43V24.8c0-4.9-3.9-8.8-8.8-8.8H29Z"
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
