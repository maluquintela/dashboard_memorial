import { Radio, Zap, Flame, Wind, FolderOpen } from 'lucide-react';
import type { MemorialType } from '../types';
import TecPredLogo from './TecPredLogo';
import { TP } from '../theme';

type SidebarView = MemorialType | 'gerados';

interface SidebarProps {
  active: SidebarView;
  onChange: (view: SidebarView) => void;
}

interface NavItem {
  id: SidebarView;
  label: string;
  icon: React.ReactNode;
}

const items: NavItem[] = [
  { id: 'telecomunicacoes', label: 'Telecomunicações', icon: <Radio size={18} /> },
  { id: 'eletrico', label: 'Elétrico', icon: <Zap size={18} /> },
  { id: 'gas_natural', label: 'Gas Natural', icon: <Flame size={18} /> },
  { id: 'gas_glp', label: 'Gas GLP', icon: <Wind size={18} /> },
];

export default function Sidebar({ active, onChange }: SidebarProps) {
  const linkBase =
    'flex w-full min-w-0 items-center gap-2 rounded-r-lg border-l-4 px-3 py-2.5 text-left text-sm font-medium transition-all md:gap-3';

  return (
    <aside
      className="flex w-full shrink-0 flex-col md:h-full md:w-56"
      style={{
        backgroundColor: TP.card,
        borderRight: `1px solid ${TP.border}`,
        borderBottom: `1px solid ${TP.border}`,
        boxShadow: '2px 0 16px rgba(31, 41, 55, 0.06)',
      }}
    >
      <div className="hidden px-4 py-4 md:block" style={{ borderBottom: `1px solid ${TP.border}` }}>
        <TecPredLogo variant="dark" size="compact" />
        <p
          className="mt-2 text-[11px] font-medium uppercase tracking-wider"
          style={{ color: TP.muted }}
        >
          Memorial
        </p>
      </div>

      <nav className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 md:flex md:flex-1 md:flex-col md:gap-0 md:space-y-1 md:overflow-y-auto">
        <p
          className="hidden px-2 text-[10px] font-semibold uppercase tracking-widest md:mb-2 md:block"
          style={{ color: TP.muted }}
        >
          Novo memorial
        </p>
        {items.map((item) => {
          const isOn = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={linkBase}
              style={{
                borderLeftColor: isOn ? TP.accent : 'transparent',
                background: isOn ? TP.navActiveBg : 'transparent',
                color: isOn ? TP.primary : TP.text,
              }}
            >
              <span className="shrink-0" style={{ color: isOn ? TP.accent : TP.muted }}>{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="col-span-2 sm:col-span-1 md:pt-4">
          <p
            className="hidden px-2 text-[10px] font-semibold uppercase tracking-widest md:mb-2 md:block"
            style={{ color: TP.muted }}
          >
            Histórico
          </p>
          <button
            type="button"
            onClick={() => onChange('gerados')}
            className={linkBase}
            style={{
              borderLeftColor: active === 'gerados' ? TP.accent : 'transparent',
              background: active === 'gerados' ? TP.navActiveBg : 'transparent',
              color: active === 'gerados' ? TP.primary : TP.text,
            }}
          >
            <span className="shrink-0" style={{ color: active === 'gerados' ? TP.accent : TP.muted }}>
              <FolderOpen size={18} />
            </span>
            <span className="truncate">Memoriais gerados</span>
          </button>
        </div>
      </nav>

      <div className="hidden border-t p-4 md:block" style={{ borderColor: TP.border }}>
        <p className="text-center text-[11px]" style={{ color: TP.muted }}>
          v1.0.0 · TecPred
        </p>
      </div>
    </aside>
  );
}
