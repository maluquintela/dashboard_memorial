import { useState } from 'react';
import { FileDown, CheckCircle, AlertCircle, Loader2, WandSparkles } from 'lucide-react';
import type { Memorial } from '../types';
import { TP } from '../theme';

interface MemorialOutputProps {
  memorial: Memorial | null;
  isGenerating: boolean;
  onCorrect: (memorialId: string, feedback: string) => Promise<void>;
  isCorrecting: boolean;
}

const iconBg = { background: 'rgba(76, 79, 191, 0.12)' } as const;

export default function MemorialOutput({
  memorial,
  isGenerating,
  onCorrect,
  isCorrecting,
}: MemorialOutputProps) {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [corrected, setCorrected] = useState(false);

  const handleCorrect = async () => {
    if (!memorial || !feedback.trim()) return;
    await onCorrect(memorial.id, feedback);
    setCorrected(true);
    setFeedback('');
    setShowFeedback(false);
  };

  if (isGenerating) {
    return (
      <div className="flex h-full flex-col">
        <h2 className="mb-4 text-lg font-semibold" style={{ color: TP.text }}>
          Memorial gerado
        </h2>
        <div
          className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-4"
          style={{
            borderColor: TP.border,
            background: TP.page,
          }}
        >
          <Loader2 size={36} className="animate-spin" style={{ color: TP.primary }} />
          <p className="text-sm font-medium" style={{ color: TP.muted }}>
            Gerando seu memorial…
          </p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="flex h-full flex-col">
        <h2 className="mb-4 text-lg font-semibold" style={{ color: TP.text }}>
          Memorial gerado
        </h2>
        <div
          className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center"
          style={{
            borderColor: TP.border,
            background: TP.page,
          }}
        >
          <FileDown size={36} style={{ color: TP.border }} />
          <p className="text-sm" style={{ color: TP.muted }}>
            O memorial gerado aparecerá aqui após o processamento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: TP.text }}>
          Memorial gerado
        </h2>
        {memorial.status === 'ready' && (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
            <CheckCircle size={12} />
            Pronto
          </span>
        )}
        {memorial.status === 'error' && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
            <AlertCircle size={12} />
            Erro
          </span>
        )}
      </div>

      <div
        className="flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm"
        style={{ borderColor: TP.border, background: TP.card }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3"
          style={{ background: TP.page, borderColor: TP.border }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={iconBg}>
              <FileDown size={16} style={{ color: TP.primary }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: TP.text }}>
                {memorial.projectName}
              </p>
              <p className="text-xs" style={{ color: TP.muted }}>
                {new Date(memorial.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          {memorial.docxUrl && (
            <a
              href={memorial.docxUrl}
              download
              className="tp-btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs"
            >
              <FileDown size={13} />
              .docx
            </a>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {memorial.observations && (
            <div
              className="rounded-lg border p-3 text-sm"
              style={{
                borderColor: TP.border,
                background: TP.page,
                color: TP.text,
              }}
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: TP.muted }}>
                Observações inclusas
              </p>
              <p>{memorial.observations}</p>
            </div>
          )}
          {!memorial.observations && (
            <p className="py-6 text-center text-sm" style={{ color: TP.muted }}>
              Memorial gerado com sucesso. Faça o download em .docx.
            </p>
          )}
        </div>
      </div>

      {corrected && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-600">
          <CheckCircle size={15} />
          Memorial corrigido com sucesso!
        </div>
      )}

      {!corrected && (
        <div
          className="space-y-3 rounded-xl border p-4"
          style={{
            background: TP.accentSoft,
            borderColor: 'rgba(255, 122, 69, 0.35)',
          }}
        >
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" style={{ color: TP.accentStrong }} />
            <p className="text-sm font-medium" style={{ color: '#9a3412' }}>
              Há alguma informação faltando no memorial gerado?
            </p>
          </div>

          {!showFeedback ? (
            <button
              type="button"
              onClick={() => setShowFeedback(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
              style={{
                background: 'rgba(249, 115, 22, 0.15)',
                color: TP.accentStrong,
              }}
            >
              <WandSparkles size={14} />
              Corrigir memorial
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Descreva o que deve ser corrigido ou complementado…"
                rows={3}
                className="tp-input w-full resize-none rounded-lg px-3 py-2 text-sm transition"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCorrect}
                  disabled={!feedback.trim() || isCorrecting}
                  className="tp-btn-primary flex items-center gap-1.5 px-4 py-2 text-sm disabled:opacity-40"
                >
                  {isCorrecting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <WandSparkles size={14} />
                  )}
                  Corrigir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedback(false);
                    setFeedback('');
                  }}
                  className="px-3 py-2 text-sm transition-colors"
                  style={{ color: TP.muted }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
