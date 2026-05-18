import type { Memorial } from '../types';

type ApiErrorKind = 'network' | 'timeout' | 'validation' | 'download' | 'not_found' | 'server' | 'unknown';

interface ErrorLikeResponse {
  status?: number;
  data?: unknown;
}

interface ErrorLike {
  code?: string;
  message?: string;
  response?: ErrorLikeResponse;
  request?: unknown;
}

interface BackendErrorEnvelope {
  code?: string;
  message?: string;
  request_id?: string;
}

interface BackendErrorBody {
  detail?: unknown;
  error?: BackendErrorEnvelope;
}

export class NormalizedApiError extends Error {
  kind: ApiErrorKind;
  status?: number;
  code?: string;
  retryable: boolean;

  constructor({
    kind,
    message,
    status,
    code,
    retryable,
  }: {
    kind: ApiErrorKind;
    message: string;
    status?: number;
    code?: string;
    retryable?: boolean;
  }) {
    super(message);
    this.name = 'NormalizedApiError';
    this.kind = kind;
    this.status = status;
    this.code = code;
    this.retryable = retryable ?? false;
  }
}

export const BATCH_MERGE_FALLBACK_WARNING =
  'O memorial foi gerado, mas uma etapa automática de conferência demorou mais do que o esperado. O sistema usou as informações extraídas diretamente das pranchas para continuar. Recomendamos revisar os campos principais antes de usar o documento final.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toErrorLike(error: unknown): ErrorLike {
  return isRecord(error) ? error : {};
}

function toBackendErrorBody(data: unknown): BackendErrorBody {
  if (!isRecord(data)) return {};

  const error = isRecord(data.error)
    ? {
        code: typeof data.error.code === 'string' ? data.error.code : undefined,
        message: typeof data.error.message === 'string' ? data.error.message : undefined,
        request_id: typeof data.error.request_id === 'string' ? data.error.request_id : undefined,
      }
    : undefined;

  return {
    detail: data.detail,
    error,
  };
}

function detailToString(detail: unknown): string {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => isRecord(item) && typeof item.message === 'string' ? item.message : '')
      .filter(Boolean)
      .join(' ');
  }
  return '';
}

function isUnsafeMessage(message: string): boolean {
  return (
    message.length > 220 ||
    /traceback|stack trace|\/srv\/|\/tmp\/|\/home\/|secret|token|password|authorization/i.test(message) ||
    /[{}`]/.test(message)
  );
}

function normalizeUploadValidation(detail: string, status?: number): string | null {
  const normalized = detail.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

  if (normalized.includes('envie ao menos um arquivo')) {
    return 'Selecione ao menos um arquivo PDF antes de gerar o memorial.';
  }
  if (normalized.includes('arquivo vazio') || normalized.includes('vazio') || normalized.includes('empty file')) {
    return 'Um dos arquivos está vazio. Remova esse arquivo e tente novamente.';
  }
  if (normalized.includes('extensao nao suportada') || normalized.includes('content-type invalido')) {
    return 'Envie apenas arquivos PDF aceitos pelo memorial.';
  }
  if (status === 413 || normalized.includes('tamanho') || normalized.includes('grande demais') || normalized.includes('excede')) {
    return 'Um dos arquivos excede o tamanho permitido. Remova o arquivo maior e tente novamente.';
  }
  if (normalized.includes('muitos arquivos') || normalized.includes('arquivos demais') || normalized.includes('too many files')) {
    return 'Foram enviados arquivos demais. Remova alguns arquivos e tente novamente.';
  }

  return null;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (error instanceof NormalizedApiError) return error;

  const source = toErrorLike(error);
  const status = source.response?.status;
  const body = toBackendErrorBody(source.response?.data);
  const code = body.error?.code;
  const detail = detailToString(body.detail);
  const backendMessage = body.error?.message;
  const candidateMessage = backendMessage || detail || source.message || '';

  if (source.code === 'ECONNABORTED') {
    return new NormalizedApiError({
      kind: 'timeout',
      message: 'A API demorou mais do que o esperado. Tente novamente em instantes.',
      retryable: true,
    });
  }

  if (!source.response && (source.request || source.message === 'Network Error')) {
    return new NormalizedApiError({
      kind: 'network',
      message: 'Não foi possível conectar à API. Verifique se o serviço está ativo e tente novamente.',
      retryable: true,
    });
  }

  const uploadMessage = normalizeUploadValidation(detail || candidateMessage, status);
  if (uploadMessage) {
    return new NormalizedApiError({
      kind: 'validation',
      message: uploadMessage,
      status,
      code,
    });
  }

  if (code === 'generated_memorial_not_ready' || status === 409) {
    return new NormalizedApiError({
      kind: 'download',
      message: 'O memorial ainda não está disponível para download. Aguarde a conclusão da geração.',
      status,
      code,
      retryable: true,
    });
  }

  if (status === 404 && detail.toLowerCase().includes('arquivo do memorial')) {
    return new NormalizedApiError({
      kind: 'download',
      message: 'O arquivo do memorial não está mais disponível. Gere o memorial novamente.',
      status,
      code,
    });
  }

  if (status === 404 && detail.toLowerCase().includes('memorial')) {
    return new NormalizedApiError({
      kind: 'not_found',
      message: 'Este memorial não está mais disponível no histórico.',
      status,
      code,
    });
  }

  if (status === 500 || code === 'internal_server_error') {
    return new NormalizedApiError({
      kind: 'server',
      message: 'Erro interno ao processar a requisição. Tente novamente em instantes.',
      status,
      code,
      retryable: true,
    });
  }

  if (status === 503 || code === 'generated_memorial_storage_error') {
    return new NormalizedApiError({
      kind: 'server',
      message: 'A API está temporariamente indisponível para acessar o memorial. Tente novamente em instantes.',
      status,
      code,
      retryable: true,
    });
  }

  if (candidateMessage && !isUnsafeMessage(candidateMessage)) {
    return new NormalizedApiError({
      kind: status && status >= 400 && status < 500 ? 'validation' : 'unknown',
      message: candidateMessage,
      status,
      code,
      retryable: Boolean(status && status >= 500),
    });
  }

  return new NormalizedApiError({
    kind: 'unknown',
    message: 'Não foi possível concluir a solicitação. Tente novamente.',
    status,
    code,
    retryable: Boolean(status && status >= 500),
  });
}

export function toDashboardMemorialStatus(status: string): Memorial['status'] {
  if (status === 'ready' || status === 'succeeded') return 'ready';
  if (status === 'failed' || status === 'error') return 'error';
  return 'generating';
}

export function canDownloadApiStatus(status: string): boolean {
  return status === 'ready' || status === 'succeeded';
}

export function hasBatchMergeFallback(extractionReport: unknown): boolean {
  if (!isRecord(extractionReport)) return false;
  const crossValidation = extractionReport.cross_validation;
  return (
    isRecord(crossValidation) &&
    crossValidation.batch_merge_fallback_used === true
  );
}
