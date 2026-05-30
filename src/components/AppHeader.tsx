import { useEffect, useState } from 'react';
import TecPredLogo from './TecPredLogo';
import { TP } from '../theme';
import type { UserProfile } from '../types';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  profile?: UserProfile | null;
  onProfile?: () => void;
  onLogout?: () => void;
}

export default function AppHeader({
  title = 'Dashboard Memorial',
  subtitle = 'Visão em tempo real',
  profile = null,
  onProfile,
  onLogout,
}: AppHeaderProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const dateStr = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <header
      className="relative z-20 flex h-[4.25rem] shrink-0 items-center justify-between gap-4 px-5"
      style={{
        background: `linear-gradient(92deg, ${TP.headerFrom} 0%, ${TP.headerTo} 100%)`,
        boxShadow: TP.shadowHeader,
        borderBottom: '1px solid rgba(255,255,255,0.14)',
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <TecPredLogo variant="light" size="default" />
        <div
          className="hidden h-10 w-px shrink-0 sm:block"
          style={{ background: 'rgba(255,255,255,0.25)' }}
          aria-hidden
        />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold leading-tight text-white sm:text-xl">
            {title}
          </h1>
          <p
            className="mt-0.5 flex items-center gap-1.5 text-xs"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: TP.accent }}
            />
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div
          className="hidden rounded-lg border px-3 py-1.5 text-right sm:block"
          style={{
            borderColor: 'rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          <p
            className="text-[10px] font-medium uppercase tracking-wide"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Ao vivo
          </p>
          <p className="font-mono text-sm font-semibold tabular-nums text-white">
            {timeStr}
            <span className="ml-1.5 text-xs font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {dateStr}
            </span>
          </p>
        </div>
        {profile && (
          <button
            type="button"
            onClick={onProfile}
            className="hidden max-w-40 truncate rounded-lg border px-3 py-1.5 text-left text-xs font-semibold text-white sm:block"
            style={{
              borderColor: 'rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.1)',
            }}
          >
            {profile.displayName}
          </button>
        )}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-white"
            style={{
              borderColor: 'rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.08)',
            }}
          >
            Sair
          </button>
        )}
      </div>
    </header>
  );
}
