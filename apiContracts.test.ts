import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  BATCH_MERGE_FALLBACK_WARNING,
  canDownloadApiStatus,
  hasBatchMergeFallback,
  normalizeApiError,
  toDashboardMemorialStatus,
} from './src/services/apiContracts.ts';

test('normalizes network failures as API unavailable', () => {
  const error = normalizeApiError({ request: {}, message: 'Network Error' });

  assert.equal(error.kind, 'network');
  assert.equal(error.message, 'Não foi possível conectar à API. Verifique se o serviço está ativo e tente novamente.');
});

test('prefers safe backend 500 envelope without leaking raw details', () => {
  const error = normalizeApiError({
    response: {
      status: 500,
      data: {
        detail: 'Traceback /srv/app/private.py SECRET_TOKEN=abc',
        error: {
          code: 'internal_server_error',
          message: 'Erro interno ao processar a requisição.',
        },
      },
    },
  });

  assert.equal(error.kind, 'server');
  assert.equal(error.message, 'Erro interno ao processar a requisição. Tente novamente em instantes.');
  assert.equal(error.message.includes('/srv/app'), false);
  assert.equal(error.message.includes('SECRET_TOKEN'), false);
});

test('normalizes upload validation details into actionable messages', () => {
  assert.equal(
    normalizeApiError({ response: { status: 400, data: { detail: 'Envie ao menos um arquivo PDF ou DOCX.' } } }).message,
    'Selecione ao menos um arquivo PDF antes de gerar o memorial.'
  );
  assert.equal(
    normalizeApiError({ response: { status: 400, data: { detail: 'Extensao nao suportada para upload: planta.txt.' } } }).message,
    'Envie apenas arquivos PDF aceitos pelo memorial.'
  );
  assert.equal(
    normalizeApiError({ response: { status: 413, data: { detail: 'Arquivo excede o tamanho máximo permitido.' } } }).message,
    'Um dos arquivos excede o tamanho permitido. Remova o arquivo maior e tente novamente.'
  );
  assert.equal(
    normalizeApiError({ response: { status: 400, data: { detail: 'Muitos arquivos enviados.' } } }).message,
    'Foram enviados arquivos demais. Remova alguns arquivos e tente novamente.'
  );
  assert.equal(
    normalizeApiError({ response: { status: 400, data: { detail: 'Arquivo vazio enviado.' } } }).message,
    'Um dos arquivos está vazio. Remova esse arquivo e tente novamente.'
  );
});

test('maps backend generation statuses without treating failed or processing as ready', () => {
  assert.equal(toDashboardMemorialStatus('ready'), 'ready');
  assert.equal(toDashboardMemorialStatus('succeeded'), 'ready');
  assert.equal(toDashboardMemorialStatus('processing'), 'generating');
  assert.equal(toDashboardMemorialStatus('pending'), 'generating');
  assert.equal(toDashboardMemorialStatus('failed'), 'error');

  assert.equal(canDownloadApiStatus('ready'), true);
  assert.equal(canDownloadApiStatus('succeeded'), true);
  assert.equal(canDownloadApiStatus('processing'), false);
  assert.equal(canDownloadApiStatus('pending'), false);
  assert.equal(canDownloadApiStatus('failed'), false);
});

test('normalizes unavailable download and missing artifact responses', () => {
  assert.equal(
    normalizeApiError({
      response: {
        status: 409,
        data: {
          detail: 'Memorial ainda não está disponível para download.',
          error: { code: 'generated_memorial_not_ready' },
        },
      },
    }).message,
    'O memorial ainda não está disponível para download. Aguarde a conclusão da geração.'
  );

  assert.equal(
    normalizeApiError({
      response: {
        status: 404,
        data: { detail: 'Arquivo do memorial não está mais disponível.' },
      },
    }).message,
    'O arquivo do memorial não está mais disponível. Gere o memorial novamente.'
  );
});

test('detects batch merge fallback and exposes a non-technical warning', () => {
  assert.equal(
    hasBatchMergeFallback({
      cross_validation: {
        batch_merge_fallback_used: true,
        batch_merge_errors: [
          {
            batch_index: 0,
            error_type: 'TimeoutError',
            files: ['a.pdf', 'b.pdf'],
          },
        ],
      },
    }),
    true
  );

  assert.equal(hasBatchMergeFallback({ cross_validation: {} }), false);
  assert.equal(
    BATCH_MERGE_FALLBACK_WARNING,
    'O memorial foi gerado, mas uma etapa automática de conferência demorou mais do que o esperado. O sistema usou as informações extraídas diretamente das pranchas para continuar. Recomendamos revisar os campos principais antes de usar o documento final.'
  );
});
