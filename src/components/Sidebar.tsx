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
    'w-full flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm font-medium transition-all border-l-4';

  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col"
      style={{
        backgroundColor: TP.card,
        borderRight: `1px solid ${TP.border}`,
        boxShadow: '2px 0 16px rgba(31, 41, 55, 0.06)',
      }}
    >
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${TP.border}` }}>
        <TecPredLogo variant="dark" size="compact" />
        <p
          className="mt-2 text-[11px] font-medium uppercase tracking-wider"
          style={{ color: TP.muted }}
        >
          Memorial
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p
          className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest"
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
              <span style={{ color: isOn ? TP.accent : TP.muted }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}

        <div className="pt-4">
          <p
            className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest"
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
            <span style={{ color: active === 'gerados' ? TP.accent : TP.muted }}>
              <FolderOpen size={18} />
            </span>
            Memoriais gerados
          </button>
        </div>
      </nav>

      <div className="border-t p-4" style={{ borderColor: TP.border }}>
        <p className="text-center text-[11px]" style={{ color: TP.muted }}>
          v1.0.0 · TecPred
        </p>
      </div>
    </aside>
  );
}
