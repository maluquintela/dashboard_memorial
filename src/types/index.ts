export type MemorialType = 'telecomunicacoes' | 'eletrico' | 'gas_natural' | 'gas_glp';
export type ApiMemorialType = 'telecom' | 'eletrico' | 'gas-natural' | 'glp';

export interface Memorial {
  id: string;
  type: MemorialType;
  projectName: string;
  createdAt: string;
  docxUrl?: string;
  observations?: string;
  pdfFilenames?: string[];
  status: 'generating' | 'ready' | 'error';
}

export interface GenerateMemorialPayload {
  type: MemorialType;
  observations: string;
  files: File[];
}

export interface CorrectMemorialPayload {
  memorialId: string;
  feedback: string;
}

export interface CorrectMemorialResponse {
  memorial: Memorial;
}

export interface GenerateMemorialResponse {
  memorial: Memorial;
}

export interface ListMemorialsResponse {
  memorials: Memorial[];
}

export interface GeneratedMemorialApiResponse {
  id: string;
  type: ApiMemorialType;
  project_name: string;
  status: Memorial['status'];
  observations?: string | null;
  pdf_filenames: string[];
  created_at: string;
  updated_at: string;
  download_url: string;
}

export interface GeneratedMemorialListApiResponse {
  memorials: GeneratedMemorialApiResponse[];
}

export interface GeneratedMemorialDownloadApiResponse {
  download_url: string;
}

export interface ApiDetailError {
  detail: string;
}

export interface ApiValidationIssue {
  path: string;
  message: string;
  validator: string;
}

export interface ApiValidationError {
  detail: string;
  errors: ApiValidationIssue[];
  extraction_report?: unknown;
}

export const MEMORIAL_TYPE_LABELS: Record<MemorialType, string> = {
  telecomunicacoes: 'Telecomunicações',
  eletrico: 'Elétrico',
  gas_natural: 'Gas Natural',
  gas_glp: 'Gas GLP',
};
