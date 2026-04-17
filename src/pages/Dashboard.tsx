import { useState, useEffect, useCallback } from 'react';
import AppHeader from '../components/AppHeader';
import DashboardStats from '../components/DashboardStats';
import Sidebar from '../components/Sidebar';
import UploadPanel from '../components/UploadPanel';
import MemorialOutput from '../components/MemorialOutput';
import GeneratedList from '../components/GeneratedList';
import ProjectDetail from '../components/ProjectDetail';
import type { Memorial, MemorialType } from '../types';
import { generateMemorial, listMemorials } from '../services/api';
import { TrendingUp } from 'lucide-react';
import { TP, tpCardStyle } from '../theme';

type SidebarView = MemorialType | 'gerados';

const MEMORIAL_TYPES: MemorialType[] = ['telecomunicacoes', 'eletrico', 'gas_natural', 'gas_glp'];

export default function Dashboard() {
  const [activeView, setActiveView] = useState<SidebarView>('telecomunicacoes');
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [currentMemorial, setCurrentMemorial] = useState<Memorial | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [historyCategory, setHistoryCategory] = useState<MemorialType>('telecomunicacoes');
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null);

  const activeType = MEMORIAL_TYPES.includes(activeView as MemorialType)
    ? (activeView as MemorialType)
    : 'telecomunicacoes';

  const fetchMemorials = useCallback(async () => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await listMemorials();
      setMemorials(res.memorials);
    } catch {
      setHistoryError('Não foi possível carregar os memoriais gerados.');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchMemorials();
  }, [fetchMemorials]);

  const handleGenerate = async (files: File[], observations: string) => {
    setIsGenerating(true);
    setCurrentMemorial(null);
    setGenerationError(null);
    try {
      const res = await generateMemorial(activeType, files, observations);
      setCurrentMemorial(res.memorial);
      setMemorials((prev) => [
        res.memorial,
        ...prev.filter((m) => m.id !== res.memorial.id),
      ]);
    } catch {
      setGenerationError(
        'Não foi possível gerar o memorial. Verifique a API e os arquivos enviados.'
      );
      const errorMemorial: Memorial = {
        id: `err-${Date.now()}`,
        type: activeType,
        projectName: 'Falha ao gerar memorial',
        createdAt: new Date().toISOString(),
        status: 'error',
      };
      setCurrentMemorial(errorMemorial);
    } finally {
      setIsGenerating(false);
    }
  };

  const isGeneratorView = activeView !== 'gerados';

  const total = memorials.length;
  const ready = memorials.filter((m) => m.status === 'ready').length;
  const progressPct = total ? Math.round((ready / total) * 100) : 0;

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ backgroundColor: TP.page }}
    >
      <AppHeader />

      <div className="flex min-h-0 flex-1">
        <Sidebar active={activeView} onChange={setActiveView} />

        <main
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          style={{ backgroundColor: TP.page }}
        >
          {isGeneratorView ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-5 pb-5 pt-4 lg:px-8">
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: TP.primary }}
                >
                  Dashboard
                </h2>
                <p className="mt-1 text-sm" style={{ color: TP.muted }}>
                  Gere memoriais técnicos a partir das plantas e acompanhe o histórico por
                  categoria.
                </p>
              </div>

              <DashboardStats memorials={memorials} />

              {(historyError || generationError) && (
                <div
                  className="rounded-lg border px-4 py-3 text-sm font-medium"
                  style={{
                    background: TP.accentSoft,
                    borderColor: 'rgba(255, 122, 69, 0.35)',
                    color: '#9a3412',
                  }}
                >
                  {generationError ?? historyError}
                </div>
              )}

              <section
                className="overflow-hidden px-4 py-4"
                style={tpCardStyle}
                aria-label="Progresso geral"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: TP.text }}
                  >
                    <TrendingUp
                      className="h-4 w-4"
                      strokeWidth={2}
                      style={{ color: TP.accent }}
                    />
                    Progresso geral
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium" style={{ color: TP.muted }}>
                      Percentual concluído médio
                    </span>
                    <p
                      className="text-lg font-bold tabular-nums"
                      style={{ color: TP.primary }}
                    >
                      {progressPct}%
                    </p>
                  </div>
                </div>
                <div
                  className="h-3 w-full overflow-hidden rounded-full"
                  style={{ background: TP.border }}
                >
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${TP.headerFrom} 0%, ${TP.headerTo} 100%)`,
                    }}
                  />
                </div>
              </section>

              <div className="flex min-h-0 flex-1 flex-col gap-4 xl:flex-row">
                <div
                  className="flex w-full shrink-0 flex-col overflow-y-auto p-5 xl:w-80"
                  style={tpCardStyle}
                >
                  <UploadPanel
                    type={activeType}
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                  />
                </div>

                <div
                  className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-5"
                  style={tpCardStyle}
                >
                  <MemorialOutput
                    memorial={currentMemorial}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>

              <div className="h-52 min-h-[13rem] shrink-0">
                <GeneratedList
                  memorials={memorials}
                  activeCategory={activeType}
                  onCategoryChange={() => {}}
                  selectedId={selectedMemorial?.id ?? null}
                  onSelect={(m) => {
                    setSelectedMemorial(m);
                    setActiveView('gerados');
                    setHistoryCategory(m.type);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-5 pb-5 pt-4 lg:px-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: TP.primary }}>
                  Memoriais gerados
                </h2>
                <p className="mt-1 text-sm" style={{ color: TP.muted }}>
                  {isLoadingHistory
                    ? 'Carregando memoriais gerados...'
                    : 'Filtre por categoria e abra o detalhe de cada projeto.'}
                </p>
                {historyError && (
                  <p className="mt-2 text-sm font-medium" style={{ color: TP.accentStrong }}>
                    {historyError}
                  </p>
                )}
              </div>

              <div className="flex min-h-0 flex-1 gap-4 overflow-hidden">
                <div className="min-h-0 min-w-0 flex-1">
                  <GeneratedList
                    memorials={memorials}
                    activeCategory={historyCategory}
                    onCategoryChange={setHistoryCategory}
                    selectedId={selectedMemorial?.id ?? null}
                    onSelect={setSelectedMemorial}
                  />
                </div>

                <div className="h-full w-full max-w-sm shrink-0 overflow-hidden xl:max-w-[22rem]">
                  <ProjectDetail memorial={selectedMemorial} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
