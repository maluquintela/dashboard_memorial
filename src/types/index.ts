export type MemorialType = 'telecomunicacoes' | 'eletrico' | 'gas_natural' | 'gas_glp';

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

export const MEMORIAL_TYPE_LABELS: Record<MemorialType, string> = {
  telecomunicacoes: 'Telecomunicações',
  eletrico: 'Elétrico',
  gas_natural: 'Gas Natural',
  gas_glp: 'Gas GLP',
};
