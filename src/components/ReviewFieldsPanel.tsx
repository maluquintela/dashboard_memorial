import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, Save, SlidersHorizontal } from 'lucide-react';
import type { Memorial, MemorialReviewItem, ReviewItemCategory } from '../types';
import { TP } from '../theme';

interface ReviewFieldsPanelProps {
  memorial: Memorial;
  isSaving: boolean;
  onSave: (memorial: Memorial, corrections: Record<string, unknown>) => Promise<void>;
}

const CATEGORY_META: Record<ReviewItemCategory, {
  label: string;
  tone: string;
  description: string;
}> = {
  missing: {
    label: 'Faltando',
    tone: '#dc2626',
    description: 'Campos que não foram encontrados com segurança nas pranchas.',
  },
  default: {
    label: 'Valor default',
    tone: '#d97706',
    description: 'Campos preenchidos por regra padrão e que merecem conferência.',
  },
  low_confidence: {
    label: 'Baixa confiança',
    tone: '#ea580c',
    description: 'Campos extraídos sem confiança alta.',
  },
  conflict: {
    label: 'Conflito',
    tone: '#be123c',
    description: 'Valores conflitantes encontrados durante a extração.',
  },
};

const CONFIDENCE_LABELS: Record<string, string> = {
  low: 'baixa',
  medium: 'média',
  high: 'alta',
};

function confidenceLabel(confidence?: string | null): string | null {
  if (!confidence) return null;
  return CONFIDENCE_LABELS[confidence] ?? confidence;
}

function editableValueToString(item: MemorialReviewItem): string {
  const value = item.currentValue;
  if (value === null || value === undefined) return '';
  if (item.editableType === 'json') return JSON.stringify(value, null, 2);
  return String(value);
}

function parseEditableValue(item: MemorialReviewItem, value: string): unknown {
  if (item.editableType === 'number') {
    const normalized = value.replace(',', '.').trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    if (Number.isNaN(parsed)) {
      throw new Error(`"${item.label}" precisa ser um número válido.`);
    }
    return parsed;
  }
  if (item.editableType === 'boolean') {
    return value === 'true';
  }
  if (item.editableType === 'json') {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`"${item.label}" precisa estar em JSON válido.`);
    }
  }
  return value.trim();
}

function setNestedValue(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.').filter(Boolean);
  if (!parts.length) return;
  let current = target;
  parts.slice(0, -1).forEach((part) => {
    const existing = current[part];
    if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  });
  current[parts[parts.length - 1]] = value;
}

export default function ReviewFieldsPanel({
  memorial,
  isSaving,
  onSave,
}: ReviewFieldsPanelProps) {
  const items = useMemo(() => memorial.reviewItems ?? [], [memorial.reviewItems]);
  const initialDraftValues = useMemo(() => {
    const nextValues: Record<string, string> = {};
    items.forEach((item) => {
      nextValues[item.id] = editableValueToString(item);
    });
    return nextValues;
  }, [items]);
  const [draftValues, setDraftValues] = useState<Record<string, string>>(initialDraftValues);
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const grouped = useMemo(() => {
    return items.reduce<Record<ReviewItemCategory, MemorialReviewItem[]>>(
      (acc, item) => {
        acc[item.category].push(item);
        return acc;
      },
      { missing: [], default: [], low_confidence: [], conflict: [] }
    );
  }, [items]);

  const dirtyCount = Object.values(dirty).filter(Boolean).length;

  if (!items.length) {
    return (
      <section
        className="rounded-xl border p-3"
        style={{ borderColor: 'rgba(16, 185, 129, 0.35)', background: '#ECFDF5' }}
      >
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold" style={{ color: TP.text }}>
              Nenhum campo crítico para revisar
            </p>
            <p className="mt-0.5 text-sm leading-relaxed" style={{ color: TP.muted }}>
              O relatório não apontou campos faltando, default, conflitantes ou sem confiança alta.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const handleSave = async () => {
    setError(null);
    const corrections: Record<string, unknown> = {};
    try {
      items.forEach((item) => {
        if (!dirty[item.id]) return;
        setNestedValue(
          corrections,
          item.fieldPath,
          parseEditableValue(item, draftValues[item.id] ?? '')
        );
      });
      if (!Object.keys(corrections).length) {
        setError('Altere ao menos um campo antes de salvar.');
        return;
      }
      await onSave(memorial, corrections);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Não foi possível salvar as correções.');
    }
  };

  return (
    <section
      className="rounded-xl border p-3"
      style={{ borderColor: 'rgba(249, 115, 22, 0.35)', background: '#FFF7ED' }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
              <SlidersHorizontal size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: TP.text }}>
                Revisar campos da extração
              </p>
              <p className="mt-0.5 text-sm leading-relaxed" style={{ color: TP.muted }}>
                Ajuste os valores abaixo e gere uma nova versão do memorial sem perder o arquivo original.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || dirtyCount === 0}
            className="tp-btn-primary flex shrink-0 items-center justify-center gap-1 px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
            Salvar correções
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border px-3 py-2 text-sm text-red-700" style={{ borderColor: 'rgba(248, 113, 113, 0.45)', background: '#FEF2F2' }}>
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {Object.entries(grouped).map(([category, categoryItems]) => {
          if (!categoryItems.length) return null;
          const meta = CATEGORY_META[category as ReviewItemCategory];
          return (
            <div key={category} className="space-y-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.tone }}>
                  {meta.label} ({categoryItems.length})
                </p>
                <p className="text-xs" style={{ color: TP.muted }}>
                  {meta.description}
                </p>
              </div>
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  (() => {
                    const confidence = confidenceLabel(item.confidence);
                    return (
                  <div
                    key={item.id}
                    className="rounded-lg border bg-white p-3"
                    style={{ borderColor: TP.border }}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold" style={{ color: TP.text }}>
                          {item.label}
                        </p>
                        <p className="text-[11px]" style={{ color: TP.muted }}>
                          Campo técnico: {item.fieldPath}
                          {confidence ? ` · confiança ${confidence}` : ''}
                        </p>
                        {item.reason && (
                          <div className="mt-2 rounded-lg border px-2.5 py-2" style={{ borderColor: 'rgba(249, 115, 22, 0.18)', background: '#FFF7ED' }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: meta.tone }}>
                              O que conferir
                            </p>
                            <p className="mt-1 text-xs leading-relaxed" style={{ color: TP.text }}>
                              {item.reason}
                            </p>
                          </div>
                        )}
                        {item.evidence && (
                          <div className="mt-2 rounded-lg border px-2.5 py-2" style={{ borderColor: TP.border, background: TP.page }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TP.muted }}>
                              Evidência encontrada
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed" style={{ color: TP.muted }}>
                              {item.evidence}
                            </p>
                          </div>
                        )}
                      </div>
                      {item.editableType === 'boolean' ? (
                        <select
                          value={draftValues[item.id] ?? ''}
                          onChange={(event) => {
                            setDraftValues((prev) => ({ ...prev, [item.id]: event.target.value }));
                            setDirty((prev) => ({ ...prev, [item.id]: true }));
                          }}
                          className="rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: TP.border, color: TP.text }}
                        >
                          <option value="">Selecione</option>
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      ) : item.editableType === 'json' ? (
                        <textarea
                          value={draftValues[item.id] ?? ''}
                          onChange={(event) => {
                            setDraftValues((prev) => ({ ...prev, [item.id]: event.target.value }));
                            setDirty((prev) => ({ ...prev, [item.id]: true }));
                          }}
                          className="min-h-24 w-full rounded-lg border px-3 py-2 font-mono text-xs sm:max-w-64"
                          style={{ borderColor: TP.border, color: TP.text }}
                        />
                      ) : (
                        <input
                          type={item.editableType === 'number' ? 'text' : 'text'}
                          value={draftValues[item.id] ?? ''}
                          onChange={(event) => {
                            setDraftValues((prev) => ({ ...prev, [item.id]: event.target.value }));
                            setDirty((prev) => ({ ...prev, [item.id]: true }));
                          }}
                          className="w-full rounded-lg border px-3 py-2 text-sm sm:max-w-56"
                          style={{ borderColor: TP.border, color: TP.text }}
                        />
                      )}
                    </div>
                  </div>
                    );
                  })()
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
