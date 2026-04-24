import { useState, useEffect, useCallback } from 'react';
import AppHeader from '../components/AppHeader';
import DashboardStats from '../components/DashboardStats';
import Sidebar from '../components/Sidebar';
import UploadPanel from '../components/UploadPanel';
import GeneratedList from '../components/GeneratedList';
import ProjectDetail from '../components/ProjectDetail';
import type { Memorial, MemorialType } from '../types';
import { deleteMemorial, generateMemorial, listMemorials, refreshMemorialDownloadUrl } from '../services/api';
import { TP, tpCardStyle } from '../theme';

type SidebarView = MemorialType | 'gerados';

const MEMORIAL_TYPES: MemorialType[] = ['telecomunicacoes', 'eletrico', 'gas_natural', 'gas_glp'];

export default function Dashboard() {
  const [activeView, setActiveView] = useState<SidebarView>('telecomunicacoes');
  const [memorials, setMemorials] = useState<Memorial[]>([]);
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

  const handleViewChange = (view: SidebarView) => {
    setActiveView(view);
    setGenerationError(null);
  };

  const handleHistoryCategoryChange = (type: MemorialType) => {
    setHistoryCategory(type);
    setSelectedMemorial((current) => current?.type === type ? current : null);
  };

  const handleGenerate = async (requestedType: MemorialType, files: File[], observations: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const res = await generateMemorial(requestedType, files, observations);
      if (res.memorial.type !== requestedType) {
        throw new Error(
          `A API retornou um memorial de ${res.memorial.type}, mas foi solicitado ${requestedType}.`
        );
      }
      setMemorials((prev) => [
        res.memorial,
        ...prev.filter((m) => m.id !== res.memorial.id),
      ]);
      setSelectedMemorial(res.memorial);
      setHistoryCategory(res.memorial.type);
      setActiveView('gerados');
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Não foi possível gerar o memorial. Verifique a API e os arquivos enviados.';

      setGenerationError(message);
      const errorMemorial: Memorial = {
        id: `err-${Date.now()}`,
        type: requestedType,
        projectName: 'Falha ao gerar memorial',
        createdAt: new Date().toISOString(),
        observations: message,
        status: 'error',
      };
      setSelectedMemorial(errorMemorial);
      await fetchMemorials();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (memorial: Memorial) => {
    if (memorial.status !== 'ready') return;

    try {
      const downloadUrl = memorial.docxUrl || await refreshMemorialDownloadUrl(memorial.id);
      window.location.href = downloadUrl;
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : 'Não foi possível gerar o link de download do memorial.'
      );
    }
  };

  const handleDelete = async (memorial: Memorial) => {
    const confirmed = window.confirm(`Excluir "${memorial.projectName}"? Esta ação não pode ser desfeita.`);
    if (!confirmed) return;

    try {
      await deleteMemorial(memorial.id);
      setMemorials((prev) => prev.filter((m) => m.id !== memorial.id));
      setSelectedMemorial((current) => current?.id === memorial.id ? null : current);
      setGenerationError(null);
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir o memorial.'
      );
    }
  };

  const isGeneratorView = activeView !== 'gerados';
  const visibleSelectedMemorial = selectedMemorial?.type === historyCategory ? selectedMemorial : null;

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ backgroundColor: TP.page }}
    >
      <AppHeader />

      <div className="flex min-h-0 flex-1">
        <Sidebar active={activeView} onChange={handleViewChange} />

        <main
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
          style={{ backgroundColor: TP.page }}
        >
          {isGeneratorView ? (
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4 lg:px-8">
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

              <DashboardStats memorials={memorials} activeType={activeType} />

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

              <div
                className="mx-auto w-full max-w-5xl shrink-0 p-5"
                style={tpCardStyle}
              >
                <UploadPanel
                  key={activeType}
                  type={activeType}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>

              <div className="h-72 min-h-[18rem] shrink-0">
                <GeneratedList
                  memorials={memorials}
                  activeCategory={activeType}
                  onCategoryChange={() => {}}
                  selectedId={visibleSelectedMemorial?.id ?? null}
                  onSelect={(m) => {
                    setSelectedMemorial(m);
                    handleViewChange('gerados');
                    setHistoryCategory(m.type);
                  }}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
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
                    onCategoryChange={handleHistoryCategoryChange}
                    selectedId={visibleSelectedMemorial?.id ?? null}
                    onSelect={setSelectedMemorial}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                </div>

                <div className="h-full w-full shrink-0 overflow-hidden xl:max-w-[52rem] xl:basis-[52rem]">
                  <ProjectDetail
                    memorial={visibleSelectedMemorial}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
