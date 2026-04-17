import type { CSSProperties } from 'react';

/** Paleta fixa TecPred — use inline (hex) para o visual NUNCA depender só do CSS bundle */
export const TP = {
  headerFrom: '#3B3FAF',
  headerTo: '#4C4FBF',
  accent: '#FF7A45',
  accentStrong: '#F97316',
  page: '#F5F6FA',
  card: '#FFFFFF',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  primary: '#4C4FBF',
  primaryDark: '#3B3FAF',
  navActiveBg: 'rgba(76, 79, 191, 0.1)',
  accentSoft: '#FFF5F0',
  shadowCard: '0 4px 16px rgba(31, 41, 55, 0.1)',
  shadowHeader: '0 4px 24px rgba(59, 63, 175, 0.45)',
} as const;

export const tpCardStyle: CSSProperties = {
  backgroundColor: TP.card,
  border: `1px solid ${TP.border}`,
  borderTop: `4px solid ${TP.accent}`,
  borderRadius: 12,
  boxShadow: TP.shadowCard,
};
