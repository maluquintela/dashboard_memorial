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
    'flex w-auto items-center gap-3 rounded-r-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-all md:w-full';

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

      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:gap-0 md:space-y-1 md:overflow-y-auto">
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
              className={`${linkBase} min-w-max md:min-w-0`}
              style={{
                borderLeftColor: isOn ? TP.accent : 'transparent',
                background: isOn ? TP.navActiveBg : 'transparent',
                color: isOn ? TP.primary : TP.text,
              }}
            >
              <span style={{ color: isOn ? TP.accent : TP.muted }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}

        <div className="md:pt-4">
          <p
            className="hidden px-2 text-[10px] font-semibold uppercase tracking-widest md:mb-2 md:block"
            style={{ color: TP.muted }}
          >
            Histórico
          </p>
          <button
            type="button"
            onClick={() => onChange('gerados')}
            className={`${linkBase} min-w-max md:min-w-0`}
            style={{
              borderLeftColor: active === 'gerados' ? TP.accent : 'transparent',
              background: active === 'gerados' ? TP.navActiveBg : 'transparent',
              color: active === 'gerados' ? TP.primary : TP.text,
            }}
          >
            <span style={{ color: active === 'gerados' ? TP.accent : TP.muted }}>
              <FolderOpen size={18} />
            </span>
            Memoriais gerados
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
