import { Radio, Zap, Flame, Wind, ChevronRight, Clock, FileDown, Trash2 } from 'lucide-react';
import type { Memorial, MemorialType } from '../types';
import { MEMORIAL_TYPE_LABELS } from '../types';
import { TP, tpCardStyle } from '../theme';
import { formatDateTime } from '../utils/date';

interface GeneratedListProps {
  memorials: Memorial[];
  activeCategory: MemorialType;
  onCategoryChange: (type: MemorialType) => void;
  selectedId: string | null;
  onSelect: (memorial: Memorial) => void;
  onDownload: (memorial: Memorial) => void;
  onDelete: (memorial: Memorial) => void;
}

const categoryIcons: Record<MemorialType, React.ReactNode> = {
  telecomunicacoes: <Radio size={14} />,
  eletrico: <Zap size={14} />,
  gas_natural: <Flame size={14} />,
  gas_glp: <Wind size={14} />,
};

const categories: MemorialType[] = ['telecomunicacoes', 'eletrico', 'gas_natural', 'gas_glp'];

export default function GeneratedList({
  memorials,
  activeCategory,
  onCategoryChange,
  selectedId,
  onSelect,
  onDownload,
  onDelete,
}: GeneratedListProps) {
  const filtered = memorials.filter((m) => m.type === activeCategory);

  return (
    <div
      className="flex h-full overflow-hidden"
      style={tpCardStyle}
    >
      <div
        className="flex w-48 shrink-0 flex-col gap-1 border-r p-3"
        style={{ borderColor: TP.border }}
      >
        <p
          className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: TP.muted }}
        >
          Categorias
        </p>
        {categories.map((cat) => {
          const count = memorials.filter((m) => m.type === cat).length;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className="flex w-full items-center gap-2 rounded-lg border-l-4 px-2.5 py-2 text-left text-sm font-medium transition-all"
              style={{
                borderLeftColor: active ? TP.accent : 'transparent',
                background: active ? TP.navActiveBg : 'transparent',
                color: active ? TP.primary : TP.text,
              }}
            >
              <span style={{ color: active ? TP.accent : TP.muted }}>{categoryIcons[cat]}</span>
              <span className="flex-1 truncate text-xs">{MEMORIAL_TYPE_LABELS[cat]}</span>
              {count > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    background: active ? 'rgba(76, 79, 191, 0.15)' : TP.page,
                    color: active ? TP.primary : TP.muted,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ borderColor: TP.border }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: TP.accent }}>{categoryIcons[activeCategory]}</span>
            <h3 className="text-sm font-semibold" style={{ color: TP.text }}>
              Memoriais de {MEMORIAL_TYPE_LABELS[activeCategory]}
            </h3>
          </div>
          <span className="text-xs" style={{ color: TP.muted }}>
            {filtered.length} projetos
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-2 py-10"
              style={{ color: TP.muted }}
            >
              <Clock size={28} style={{ color: TP.border }} />
              <p className="text-sm">Nenhum memorial gerado nesta categoria</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E7EB]">
              {filtered.map((memorial) => (
                <li
                  key={memorial.id}
                  className="group flex items-center gap-2 px-4 py-3 transition-colors"
                  style={{
                    background: selectedId === memorial.id ? TP.navActiveBg : undefined,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(memorial)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-medium"
                        style={{
                          color: selectedId === memorial.id ? TP.primary : TP.text,
                        }}
                      >
                        {memorial.projectName}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: TP.muted }}>
                        {formatDateTime(memorial.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          memorial.status === 'ready'
                            ? 'bg-emerald-400'
                            : memorial.status === 'error'
                              ? 'bg-red-400'
                              : 'bg-amber-400'
                        }`}
                      />
                      <ChevronRight
                        size={14}
                        style={{
                          color: selectedId === memorial.id ? TP.primary : TP.border,
                        }}
                      />
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownload(memorial)}
                    disabled={memorial.status !== 'ready'}
                    aria-label={`Baixar ${memorial.projectName}`}
                    className="tp-btn-primary flex shrink-0 items-center gap-1 px-2.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FileDown size={12} />
                    Baixar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(memorial)}
                    aria-label={`Excluir ${memorial.projectName}`}
                    className="flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-red-50"
                    style={{ borderColor: 'rgba(248, 113, 113, 0.45)', color: '#dc2626' }}
                  >
                    <Trash2 size={12} />
                    Excluir
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
