import { FileDown, FileText, MessageSquare, CalendarDays, Tag } from 'lucide-react';
import type { Memorial } from '../types';
import { MEMORIAL_TYPE_LABELS } from '../types';
import { TP, tpCardStyle } from '../theme';

interface ProjectDetailProps {
  memorial: Memorial | null;
}

export default function ProjectDetail({ memorial }: ProjectDetailProps) {
  if (!memorial) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
        style={tpCardStyle}
      >
        <FileText size={32} style={{ color: TP.border }} />
        <p className="text-sm" style={{ color: TP.muted }}>
          Selecione um projeto na lista para ver os detalhes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto" style={tpCardStyle}>
      <div className="border-b px-5 py-4" style={{ borderColor: TP.border }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold leading-snug" style={{ color: TP.text }}>
              {memorial.projectName}
            </h3>
            <div className="mt-1.5 flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs" style={{ color: TP.muted }}>
                <Tag size={11} />
                {MEMORIAL_TYPE_LABELS[memorial.type]}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: TP.muted }}>
                <CalendarDays size={11} />
                {new Date(memorial.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              memorial.status === 'ready'
                ? 'bg-emerald-50 text-emerald-600'
                : memorial.status === 'error'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-600'
            }`}
          >
            {memorial.status === 'ready'
              ? 'Pronto'
              : memorial.status === 'error'
                ? 'Erro'
                : 'Gerando'}
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-5 p-5">
        <section>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: TP.muted }}>
            Memorial
          </p>
          <div
            className="flex items-center gap-3 rounded-xl border p-3"
            style={{
              borderColor: TP.border,
              background: TP.page,
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'rgba(76, 79, 191, 0.12)' }}
            >
              <FileDown size={18} style={{ color: TP.primary }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" style={{ color: TP.text }}>
                Memorial {MEMORIAL_TYPE_LABELS[memorial.type]}
              </p>
              <p className="text-xs" style={{ color: TP.muted }}>
                Documento .docx
              </p>
            </div>
            {memorial.docxUrl ? (
              <a
                href={memorial.docxUrl}
                download
                className="tp-btn-primary flex shrink-0 items-center gap-1 px-3 py-1.5 text-xs"
              >
                <FileDown size={12} />
                Baixar
              </a>
            ) : (
              <span className="text-xs italic" style={{ color: TP.muted }}>
                Indisponível
              </span>
            )}
          </div>
        </section>

        {memorial.pdfFilenames && memorial.pdfFilenames.length > 0 && (
          <section>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: TP.muted }}>
              PDF anexado (plantas do projeto)
            </p>
            <ul className="space-y-1.5">
              {memorial.pdfFilenames.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2"
                  style={{
                    borderColor: TP.border,
                    background: TP.page,
                  }}
                >
                  <FileText size={14} className="shrink-0 text-red-400" />
                  <span className="truncate text-sm" style={{ color: TP.text }}>
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {memorial.observations && (
          <section>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: TP.muted }}>
              Observações / Informações adicionadas
            </p>
            <div
              className="flex gap-2.5 rounded-xl border p-3"
              style={{
                borderColor: TP.border,
                background: TP.page,
              }}
            >
              <MessageSquare size={15} className="mt-0.5 shrink-0" style={{ color: TP.border }} />
              <p className="text-sm leading-relaxed" style={{ color: TP.text }}>
                {memorial.observations}
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
