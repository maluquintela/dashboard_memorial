import { useEffect, useRef, useState } from 'react';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { renderAsync } from 'docx-preview';
import type { Memorial } from '../types';
import { fetchMemorialDocxBlob } from '../services/api';
import { TP } from '../theme';

interface DocxPreviewProps {
  memorial: Memorial;
}

export default function DocxPreview({ memorial }: DocxPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewState, setPreviewState] = useState<{
    memorialId: string;
    status: 'ready' | 'error';
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container || memorial.status !== 'ready') return;

    container.innerHTML = '';

    async function renderPreview() {
      try {
        const blob = await fetchMemorialDocxBlob(memorial.id, memorial.docxUrl);
        if (cancelled || !container) return;

        container.innerHTML = '';
        await renderAsync(blob, container, undefined, {
          className: 'tp-docx',
          inWrapper: true,
          breakPages: true,
          renderHeaders: true,
          renderFooters: true,
        });

        if (!cancelled) setPreviewState({ memorialId: memorial.id, status: 'ready' });
      } catch {
        if (!cancelled) setPreviewState({ memorialId: memorial.id, status: 'error' });
      }
    }

    renderPreview();

    return () => {
      cancelled = true;
      if (container) container.innerHTML = '';
    };
  }, [memorial.docxUrl, memorial.id, memorial.status]);

  const status = previewState?.memorialId === memorial.id ? previewState.status : 'loading';

  if (memorial.status !== 'ready') {
    return (
      <div
        className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center"
        style={{ borderColor: TP.border, background: TP.page, color: TP.muted }}
      >
        <FileText size={32} />
        <p className="text-sm">O preview estará disponível quando o memorial estiver pronto.</p>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-[32rem] overflow-auto rounded-xl border bg-white"
      style={{ borderColor: TP.border }}
    >
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/85">
          <Loader2 size={28} className="animate-spin" style={{ color: TP.primary }} />
          <p className="text-sm font-medium" style={{ color: TP.muted }}>
            Carregando preview do memorial...
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white p-6 text-center">
          <AlertCircle size={30} style={{ color: TP.accentStrong }} />
          <p className="text-sm font-medium" style={{ color: TP.text }}>
            Não foi possível renderizar o preview do DOCX.
          </p>
          <p className="max-w-md text-xs" style={{ color: TP.muted }}>
            O arquivo ainda pode ser baixado normalmente pelo botão de download.
          </p>
        </div>
      )}

      <div ref={containerRef} className="tp-docx-preview p-4" />
    </div>
  );
}
