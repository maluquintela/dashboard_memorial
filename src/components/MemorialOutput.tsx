import { FileDown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { Memorial } from '../types';
import { TP } from '../theme';
import DocxPreview from './DocxPreview';
import { formatDateTime } from '../utils/date';

interface MemorialOutputProps {
  memorial: Memorial | null;
  isGenerating: boolean;
}

const iconBg = { background: 'rgba(76, 79, 191, 0.12)' } as const;

export default function MemorialOutput({
  memorial,
  isGenerating,
}: MemorialOutputProps) {
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
                {formatDateTime(memorial.createdAt)}
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
              Baixar
            </a>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {memorial.status === 'error' && (
            <div
              className="rounded-lg border p-3 text-sm"
              style={{
                borderColor: 'rgba(248, 113, 113, 0.45)',
                background: '#FEF2F2',
                color: '#991B1B',
              }}
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide">
                Erro na geração
              </p>
              <p>
                {memorial.observations ??
                  'Não foi possível gerar o memorial. Verifique a API e os arquivos enviados.'}
              </p>
            </div>
          )}
          {memorial.status !== 'error' && memorial.observations && (
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
          {memorial.status !== 'error' && !memorial.observations && (
            <DocxPreview memorial={memorial} />
          )}
          {memorial.status !== 'error' && memorial.observations && (
            <div className="mt-4">
              <DocxPreview memorial={memorial} />
            </div>
          )}
        </div>
      </div>

      <div
        className="flex items-start gap-2 rounded-xl border p-4 text-sm"
        style={{
          background: TP.accentSoft,
          borderColor: 'rgba(255, 122, 69, 0.35)',
          color: '#9a3412',
        }}
      >
        <AlertCircle size={16} className="mt-0.5 shrink-0" style={{ color: TP.accentStrong }} />
        <p>
          Correções por revisão serão habilitadas em uma próxima etapa. Por enquanto,
          gere um novo memorial se precisar ajustar os arquivos ou observações.
        </p>
      </div>
    </div>
  );
}
