import axios from 'axios';
import type {
  ApiMemorialType,
  MemorialType,
  GenerateMemorialResponse,
  CorrectMemorialResponse,
  ListMemorialsResponse,
  Memorial,
  GeneratedMemorialApiResponse,
  GeneratedMemorialListApiResponse,
  GeneratedMemorialDownloadApiResponse,
} from '../types';

const LOCAL_API_URL = 'http://localhost:8000';
const PRODUCTION_API_URL = 'https://api-memorial-production.up.railway.app';
const configuredApiUrl = import.meta.env.VITE_API_URL;

const BASE_URL = import.meta.env.PROD
  ? configuredApiUrl?.includes('localhost')
    ? PRODUCTION_API_URL
    : configuredApiUrl || PRODUCTION_API_URL
  : configuredApiUrl || LOCAL_API_URL;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('A requisição excedeu o tempo limite. Tente novamente.');
    }
    if (!error.response) {
      throw new Error('Não foi possível conectar ao servidor. Verifique se a API está ativa.');
    }
    const data = error.response.data;
    if (data?.detail) {
      throw new Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail));
    }
    throw error;
  }
);

const API_TYPE_BY_UI_TYPE: Record<MemorialType, ApiMemorialType> = {
  telecomunicacoes: 'telecom',
  eletrico: 'eletrico',
  gas_natural: 'gas-natural',
  gas_glp: 'glp',
};

const UI_TYPE_BY_API_TYPE: Record<ApiMemorialType, MemorialType> = {
  telecom: 'telecomunicacoes',
  eletrico: 'eletrico',
  'gas-natural': 'gas_natural',
  glp: 'gas_glp',
};

function toMemorial(api: GeneratedMemorialApiResponse): Memorial {
  return {
    id: api.id,
    type: UI_TYPE_BY_API_TYPE[api.type],
    projectName: api.project_name,
    createdAt: api.created_at,
    docxUrl: api.download_url,
    observations: api.observations ?? undefined,
    pdfFilenames: api.pdf_filenames,
    status: api.status,
  };
}

export async function generateMemorial(
  type: MemorialType,
  files: File[],
  observations: string
): Promise<GenerateMemorialResponse> {
  const apiType = API_TYPE_BY_UI_TYPE[type];
  const form = new FormData();
  files.forEach((file) => form.append('files', file));
  if (observations.trim()) {
    form.append('observations', observations.trim());
  }

  const { data } = await client.post<GeneratedMemorialApiResponse>(
    `/api/v1/memoriais/${apiType}/from-files/persist`,
    form
  );
  return { memorial: toMemorial(data) };
}

export async function correctMemorial(): Promise<CorrectMemorialResponse> {
  throw new Error('Correção por sessão ainda não está habilitada neste dashboard.');
}

export async function listMemorials(
  type?: MemorialType
): Promise<ListMemorialsResponse> {
  const { data } = await client.get<GeneratedMemorialListApiResponse>(
    '/api/v1/memoriais',
    { params: type ? { type: API_TYPE_BY_UI_TYPE[type] } : undefined }
  );
  return { memorials: data.memorials.map(toMemorial) };
}

export async function getMemorial(id: string): Promise<Memorial> {
  const { data } = await client.get<GeneratedMemorialApiResponse>(
    `/api/v1/memoriais/${id}`
  );
  return toMemorial(data);
}

export async function refreshMemorialDownloadUrl(id: string): Promise<string> {
  const { data } = await client.get<GeneratedMemorialDownloadApiResponse>(
    `/api/v1/memoriais/${id}/download`
  );
  return data.download_url;
}
