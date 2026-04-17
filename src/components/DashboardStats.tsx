import { Briefcase, CheckCircle2, FileStack, Layers } from 'lucide-react';
import type { Memorial } from '../types';
import { TP } from '../theme';

interface DashboardStatsProps {
  memorials: Memorial[];
}

export default function DashboardStats({ memorials }: DashboardStatsProps) {
  const total = memorials.length;
  const ready = memorials.filter((m) => m.status === 'ready').length;
  const withPdf = memorials.filter((m) => m.pdfFilenames && m.pdfFilenames.length > 0).length;
  const typesUsed = new Set(memorials.map((m) => m.type)).size;

  const cards = [
    {
      label: 'Total de memoriais',
      value: total,
      sub: `${typesUsed} categorias ativas`,
      icon: Briefcase,
    },
    {
      label: 'Memoriais prontos',
      value: ready,
      sub: 'Documentos disponíveis',
      icon: CheckCircle2,
    },
    {
      label: 'Com plantas PDF',
      value: withPdf,
      sub: 'Anexos registrados',
      icon: FileStack,
    },
    {
      label: 'Tipos de projeto',
      value: 4,
      sub: 'Telecom · Elétrico · Gás',
      icon: Layers,
    },
  ];

  return (
    <section aria-label="Visão geral">
      <h2 className="mb-3 text-sm font-semibold" style={{ color: TP.muted }}>
        Visão geral
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <article
            key={c.label}
            className="group relative overflow-hidden rounded-xl"
            style={{
              backgroundColor: TP.card,
              border: `1px solid ${TP.border}`,
              borderTop: `4px solid ${TP.accent}`,
              borderRadius: 12,
              boxShadow: TP.shadowCard,
            }}
          >
            <div className="flex gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium" style={{ color: TP.muted }}>
                  {c.label}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: TP.text }}>
                  {c.value}
                </p>
                <p className="mt-0.5 text-[11px]" style={{ color: TP.muted }}>
                  {c.sub}
                </p>
              </div>
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                style={{ background: TP.accentSoft, color: TP.accent }}
              >
                <c.icon className="h-5 w-5 opacity-90" strokeWidth={1.75} />
              </div>
            </div>
            <div
              className="w-full border-t px-4 py-2 text-[11px] font-medium"
              style={{
                borderColor: TP.border,
                background: TP.page,
                color: TP.primary,
              }}
            >
              Clique para ver detalhes →
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
