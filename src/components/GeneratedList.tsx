import { Radio, Zap, Flame, Wind, ChevronRight, Clock, FileDown, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
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
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const categoryIcons: Record<MemorialType, React.ReactNode> = {
  telecomunicacoes: <Radio size={14} />,
  eletrico: <Zap size={14} />,
  gas_natural: <Flame size={14} />,
  gas_glp: <Wind size={14} />,
};

const categories: MemorialType[] = ['telecomunicacoes', 'eletrico', 'gas_natural', 'gas_glp'];

const statusLabel: Record<Memorial['status'], string> = {
  generating: 'Gerando',
  ready: 'Pronto',
  error: 'Erro',
};

const statusClass: Record<Memorial['status'], string> = {
  ready: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  error: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  generating: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
};

export default function GeneratedList({
  memorials,
  activeCategory,
  onCategoryChange,
  selectedId,
  onSelect,
  onDownload,
  onDelete,
  isLoading = false,
  error = null,
  onRetry,
}: GeneratedListProps) {
  const filtered = memorials.filter((m) => m.type === activeCategory);

  return (
    <div
      className="flex h-full flex-col overflow-hidden sm:flex-row"
      style={tpCardStyle}
    >
      <div
        className="flex shrink-0 gap-1 overflow-x-auto border-b p-3 sm:w-48 sm:flex-col sm:overflow-x-visible sm:border-b-0 sm:border-r"
        style={{ borderColor: TP.border }}
      >
        <p
          className="hidden px-2 text-[10px] font-semibold uppercase tracking-widest sm:mb-1 sm:block"
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
              className="flex min-w-max items-center gap-2 rounded-lg border-l-4 px-2.5 py-2 text-left text-sm font-medium transition-all sm:w-full sm:min-w-0"
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
          {isLoading ? (
            <div className="flex h-full flex-col justify-center gap-3 p-4">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border p-3"
                  style={{ borderColor: TP.border, background: TP.page }}
                >
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="mt-3 h-7 w-24 animate-pulse rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-5 py-10 text-center">
              <AlertTriangle size={30} style={{ color: TP.accentStrong }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: TP.text }}>
                  Não foi possível carregar o histórico
                </p>
                <p className="mt-1 text-xs" style={{ color: TP.muted }}>
                  Verifique a conexão com a API e tente novamente.
                </p>
              </div>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="tp-btn-primary flex items-center gap-1.5 px-3 py-2 text-xs"
                >
                  <RefreshCw size={13} />
                  Tentar de novo
                </button>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-2 px-5 py-10 text-center"
              style={{ color: TP.muted }}
            >
              <Clock size={28} style={{ color: TP.border }} />
              <p className="text-sm font-semibold" style={{ color: TP.text }}>
                Nenhum memorial nesta categoria
              </p>
              <p className="max-w-xs text-xs">
                Gere um memorial de {MEMORIAL_TYPE_LABELS[activeCategory]} para acompanhar status,
                download e detalhes por aqui.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#E5E7EB]">
              {filtered.map((memorial) => (
                <li
                  key={memorial.id}
                  className="group flex flex-col gap-3 px-4 py-3 transition-colors sm:flex-row sm:items-center sm:gap-2"
                  style={{
                    background: selectedId === memorial.id ? TP.navActiveBg : undefined,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onSelect(memorial)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left sm:items-center"
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
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusClass[memorial.status]}`}
                      >
                        {statusLabel[memorial.status]}
                      </span>
                      <ChevronRight
                        size={14}
                        style={{
                          color: selectedId === memorial.id ? TP.primary : TP.border,
                        }}
                      />
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-2 pl-0 sm:pl-2">
                    <button
                      type="button"
                      onClick={() => onDownload(memorial)}
                      disabled={memorial.status !== 'ready'}
                      aria-label={`Baixar ${memorial.projectName}`}
                      className="tp-btn-primary flex flex-1 items-center justify-center gap-1 px-2.5 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                    >
                      <FileDown size={12} />
                      Baixar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(memorial)}
                      aria-label={`Excluir ${memorial.projectName}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-red-50 sm:flex-none"
                      style={{ borderColor: 'rgba(248, 113, 113, 0.45)', color: '#dc2626' }}
                    >
                      <Trash2 size={12} />
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
