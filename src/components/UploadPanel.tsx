import { useRef, useState } from 'react';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import type { MemorialType } from '../types';
import { MEMORIAL_TYPE_LABELS } from '../types';
import { TP } from '../theme';

interface UploadPanelProps {
  type: MemorialType;
  onGenerate: (type: MemorialType, files: File[], observations: string) => Promise<void>;
  isGenerating: boolean;
}

export default function UploadPanel({ type, onGenerate, isGenerating }: UploadPanelProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [observations, setObservations] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: File[]) => {
    const pdfs = incoming.filter((f) => f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...pdfs.filter((f) => !existing.has(f.name))];
    });
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    await onGenerate(type, files, observations);
    setFiles([]);
    setObservations('');
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold" style={{ color: TP.text }}>
          Gerar Memorial
        </h2>
        <p className="mt-1 text-sm" style={{ color: TP.muted }}>
          {MEMORIAL_TYPE_LABELS[type]} — Anexe as plantas em PDF
        </p>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className="flex min-h-[132px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-5 text-center transition-all"
        style={
          isDragActive
            ? { borderColor: TP.primary, background: TP.accentSoft }
            : { borderColor: TP.border, background: TP.page }
        }
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(Array.from(e.target.files));
            e.target.value = '';
          }}
        />
        <UploadCloud
          size={36}
          className="mb-3"
          style={{ color: isDragActive ? TP.primary : TP.border }}
        />
        {isDragActive ? (
          <p className="text-sm font-medium" style={{ color: TP.primary }}>
            Solte os arquivos aqui…
          </p>
        ) : (
          <>
            <p className="text-sm font-medium" style={{ color: TP.muted }}>
              Arraste PDFs ou{' '}
              <span className="underline underline-offset-2" style={{ color: TP.primary }}>
                clique para selecionar
              </span>
            </p>
            <p className="mt-1 text-xs" style={{ color: TP.muted }}>
              Somente arquivos .pdf
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <ul className="max-h-36 w-full space-y-1.5 overflow-y-auto">
          {files.map((file) => (
            <li
              key={file.name}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
              style={{
                background: TP.card,
                borderColor: TP.border,
                color: TP.text,
              }}
            >
              <FileText size={15} className="shrink-0" style={{ color: TP.primary }} />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-xs" style={{ color: TP.muted }}>
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                style={{ color: TP.border }}
                className="cursor-pointer transition-colors hover:text-red-500"
                title="Remover"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="w-full">
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide"
          style={{ color: TP.muted }}
        >
          Observações
        </label>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Informações adicionais para o memorial…"
          rows={4}
          className="tp-input min-h-[104px] w-full resize-none px-3 py-2.5 text-sm transition"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={files.length === 0 || isGenerating}
        className="tp-btn-primary flex w-full max-w-xs items-center justify-center gap-2 px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isGenerating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Gerando memorial…
          </>
        ) : (
          'Gerar memorial'
        )}
      </button>
    </div>
  );
}
