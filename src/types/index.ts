export type MemorialType = 'telecomunicacoes' | 'eletrico' | 'gas_natural' | 'gas_glp';
export type ApiMemorialType = 'telecom' | 'eletrico' | 'gas-natural' | 'glp' | 'glp_v2';
export type ApiMemorialStatus = 'processing' | 'pending' | 'ready' | 'succeeded' | 'failed' | string;

export interface Memorial {
  id: string;
  type: MemorialType;
  projectName: string;
  createdAt: string;
  docxUrl?: string;
  observations?: string;
  pdfFilenames?: string[];
  warnings?: string[];
  finalContext?: Record<string, unknown>;
  extractionReport?: unknown;
  reviewItems?: MemorialReviewItem[];
  createdBy?: MemorialCreator;
  status: 'generating' | 'ready' | 'error';
}

export interface MemorialCreator {
  userId: string;
  displayName: string;
}

export type UserRole = 'owner' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  displayName?: string;
  role?: UserRole;
  status?: UserStatus;
}

export type ReviewItemCategory = 'missing' | 'default' | 'low_confidence' | 'conflict';
export type ReviewEditableType = 'text' | 'number' | 'boolean' | 'json';

export interface MemorialReviewItem {
  id: string;
  category: ReviewItemCategory;
  fieldPath: string;
  label: string;
  currentValue?: unknown;
  confidence?: string | null;
  evidence?: string | null;
  rule?: string | null;
  reason?: string | null;
  editableType: ReviewEditableType;
}

export interface GenerateMemorialPayload {
  type: MemorialType;
  observations: string;
  files: File[];
}

export interface CorrectMemorialPayload {
  memorialId: string;
  corrections: Record<string, unknown>;
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
  status: ApiMemorialStatus;
  observations?: string | null;
  pdf_filenames: string[];
  created_at: string;
  updated_at: string;
  download_url: string;
  final_context?: Record<string, unknown> | null;
  extraction_report?: unknown;
  review_items?: unknown;
  created_by?: {
    user_id: string;
    display_name: string;
  } | null;
}

export interface GeneratedMemorialListApiResponse {
  memorials: GeneratedMemorialApiResponse[];
}

export interface GeneratedMemorialDownloadApiResponse {
  download_url: string;
}

export interface UserProfileApiResponse {
  user_id: string;
  email: string;
  display_name: string;
  role: UserRole;
  status: UserStatus;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminUserListApiResponse {
  users: UserProfileApiResponse[];
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
