import { Briefcase, CheckCircle2 } from 'lucide-react';
import type { Memorial, MemorialType } from '../types';
import { MEMORIAL_TYPE_LABELS } from '../types';
import { TP } from '../theme';

interface DashboardStatsProps {
  memorials: Memorial[];
  activeType: MemorialType;
}

export default function DashboardStats({ memorials, activeType }: DashboardStatsProps) {
  const categoryMemorials = memorials.filter((m) => m.type === activeType);
  const total = categoryMemorials.length;
  const totalGenerated = memorials.length;
  const categoryLabel = MEMORIAL_TYPE_LABELS[activeType];

  const cards = [
    {
      label: `Memoriais de ${categoryLabel}`,
      value: total,
      sub: 'Gerados nesta categoria',
      icon: Briefcase,
    },
    {
      label: 'Total geral de memoriais',
      value: totalGenerated,
      sub: 'Gerados em todas as categorias',
      icon: CheckCircle2,
    },
  ];

  return (
    <section aria-label="Visão geral">
      <h2 className="mb-3 text-sm font-semibold" style={{ color: TP.muted }}>
        Visão geral
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
