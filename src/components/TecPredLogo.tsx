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

  const box = compact ? 'h-9 w-9 rounded-lg text-[11px]' : 'h-10 w-10 rounded-xl text-sm';

  const wordmark = compact ? 'text-base' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`flex shrink-0 items-center justify-center font-black tracking-tight ${box}`}
        style={
          isLight
            ? {
                border: '1px solid rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
              }
            : {
                border: `1px solid rgba(76, 79, 191, 0.35)`,
                background: `linear-gradient(145deg, ${TP.headerTo} 0%, ${TP.headerFrom} 100%)`,
                color: '#fff',
                boxShadow: '0 2px 8px rgba(59, 63, 175, 0.25)',
              }
        }
        aria-hidden
      >
        TP
      </div>
      <span
        className={`font-bold tracking-tight ${wordmark}`}
        style={{ color: isLight ? '#fff' : TP.text }}
      >
        TecPred
      </span>
    </div>
  );
}
