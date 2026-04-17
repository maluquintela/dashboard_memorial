import axios from 'axios';
import type {
  MemorialType,
  GenerateMemorialResponse,
  CorrectMemorialResponse,
  ListMemorialsResponse,
  Memorial,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const client = axios.create({
  baseURL: BASE_URL,
});

/**
 * POST /memorial/generate
 * Sends PDFs and observations to generate a new memorial document.
 * Replace the endpoint path and field names to match your backend.
 */
export async function generateMemorial(
  type: MemorialType,
  files: File[],
  observations: string
): Promise<GenerateMemorialResponse> {
  const form = new FormData();
  form.append('type', type);
  form.append('observations', observations);
  files.forEach((file) => form.append('files', file));

  const { data } = await client.post<GenerateMemorialResponse>(
    '/memorial/generate',
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
}

/**
 * POST /memorial/:id/correct
 * Sends correction feedback for a previously generated memorial.
 */
export async function correctMemorial(
  memorialId: string,
  feedback: string
): Promise<CorrectMemorialResponse> {
  const { data } = await client.post<CorrectMemorialResponse>(
    `/memorial/${memorialId}/correct`,
    { feedback }
  );
  return data;
}

/**
 * GET /memorial?type=<type>
 * Lists all generated memorials, optionally filtered by type.
 */
export async function listMemorials(
  type?: MemorialType
): Promise<ListMemorialsResponse> {
  const { data } = await client.get<ListMemorialsResponse>('/memorial', {
    params: type ? { type } : undefined,
  });
  return data;
}

/**
 * GET /memorial/:id
 * Returns details of a single memorial.
 */
export async function getMemorial(id: string): Promise<Memorial> {
  const { data } = await client.get<Memorial>(`/memorial/${id}`);
  return data;
}
