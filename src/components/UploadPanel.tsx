import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import type { MemorialType } from '../types';
import { MEMORIAL_TYPE_LABELS } from '../types';
import { TP } from '../theme';

interface UploadPanelProps {
  type: MemorialType;
  onGenerate: (files: File[], observations: string) => Promise<void>;
  isGenerating: boolean;
}

export default function UploadPanel({ type, onGenerate, isGenerating }: UploadPanelProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [observations, setObservations] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const newFiles = accepted.filter((f) => !existing.has(f.name));
      return [...prev, ...newFiles];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
  });

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleGenerate = async () => {
    await onGenerate(files, observations);
    setFiles([]);
    setObservations('');
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: TP.text }}>
          Gerar Memorial
        </h2>
        <p className="mt-0.5 text-sm" style={{ color: TP.muted }}>
          {MEMORIAL_TYPE_LABELS[type]} — Anexe as plantas em PDF
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`flex min-h-[180px] flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 transition-all ${
          isDragActive ? '' : ''
        }`}
        style={
          isDragActive
            ? {
                borderColor: TP.primary,
                background: TP.accentSoft,
              }
            : {
                borderColor: TP.border,
                background: TP.page,
              }
        }
      >
        <input {...getInputProps()} />
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
        <ul className="max-h-36 space-y-1.5 overflow-y-auto">
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
                onClick={() => removeFile(file.name)}
                style={{ color: TP.border }}
                className="transition-colors hover:text-red-500"
                title="Remover"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div>
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
          rows={3}
          className="tp-input w-full resize-none px-3 py-2.5 text-sm transition"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={files.length === 0 || isGenerating}
        className="tp-btn-primary flex w-full items-center justify-center gap-2 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
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
