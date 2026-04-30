import { expect, test, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const apiPattern = 'http://127.0.0.1:8000/api/v1/memoriais**';
const samplePdfPath = fileURLToPath(new URL('./fixtures/sample.pdf', import.meta.url));

const readyMemorial = {
  id: 'mem-ready-1',
  type: 'telecom',
  project_name: 'Projeto Telecom Alpha',
  status: 'ready',
  observations: 'Memorial revisado para contrato E2E.',
  pdf_filenames: ['planta-alpha.pdf'],
  created_at: '2026-04-29T10:00:00Z',
  updated_at: '2026-04-29T10:05:00Z',
  download_url: 'http://127.0.0.1:8000/downloads/telecom-alpha.docx',
};

const processingMemorial = {
  id: 'mem-processing-1',
  type: 'telecom',
  project_name: 'Projeto Telecom Em Processamento',
  status: 'processing',
  observations: 'Ainda em geração.',
  pdf_filenames: ['planta-processing.pdf'],
  created_at: '2026-04-29T11:00:00Z',
  updated_at: '2026-04-29T11:01:00Z',
  download_url: '',
};

const failedMemorial = {
  id: 'mem-failed-1',
  type: 'telecom',
  project_name: 'Projeto Telecom Com Falha',
  status: 'failed',
  observations: 'Falha segura retornada pela API.',
  pdf_filenames: ['planta-failed.pdf'],
  created_at: '2026-04-29T12:00:00Z',
  updated_at: '2026-04-29T12:01:00Z',
  download_url: '',
};

async function mockMemorials(page: Page, memorials = [readyMemorial, processingMemorial, failedMemorial]) {
  await page.route(apiPattern, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (request.method() === 'GET' && path === '/api/v1/memoriais') {
      await route.fulfill({ json: { memorials } });
      return;
    }

    if (request.method() === 'GET' && path === '/api/v1/memoriais/mem-ready-1/download') {
      await route.fulfill({ json: { download_url: readyMemorial.download_url } });
      return;
    }

    if (request.method() === 'DELETE' && path === '/api/v1/memoriais/mem-ready-1') {
      await route.fulfill({ status: 204, body: '' });
      return;
    }

    if (request.method() === 'POST' && path === '/api/v1/memoriais/telecom/from-files/persist') {
      await route.fulfill({
        status: 503,
        json: {
          error: {
            code: 'generated_memorial_storage_error',
            message: 'Armazenamento do memorial indisponível.',
            request_id: 'req-e2e',
          },
        },
      });
      return;
    }

    await route.fulfill({ status: 404, json: { detail: 'Memorial não encontrado.' } });
  });

  await page.route('http://127.0.0.1:8000/downloads/telecom-alpha.docx', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      headers: {
        'content-disposition': 'attachment; filename="telecom-alpha.docx"',
      },
      body: 'docx e2e',
    });
  });
}

async function selectMemorial(page: Page, projectName: string) {
  await page.getByRole('button', { name: `Selecionar ${projectName}` }).click();
}

test('desktop opens generated memorials, selects detail, downloads and deletes', async ({ page }) => {
  await mockMemorials(page);
  await page.goto('/');

  await page.getByRole('button', { name: 'Memoriais gerados' }).click();
  await expect(page.getByRole('heading', { name: 'Memoriais gerados' })).toBeVisible();

  await selectMemorial(page, 'Projeto Telecom Alpha');
  await expect(page.getByRole('heading', { name: 'Projeto Telecom Alpha' })).toBeVisible();
  await expect(page.getByText('Pronto para download')).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Baixar Projeto Telecom Alpha' }).click();
  expect((await download).suggestedFilename()).toBe('telecom-alpha.docx');

  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Projeto Telecom Alpha');
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Excluir Projeto Telecom Alpha' }).click();
  await expect(page.getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' })).toBeHidden();
});

test('mobile 390 keeps generated memorials accessible without critical horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockMemorials(page);
  await page.goto('/');

  await page.getByRole('button', { name: 'Memoriais gerados' }).click();

  await expect(page.getByRole('heading', { name: 'Memoriais gerados' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Selecionar Projeto Telecom Alpha' })).toBeVisible();

  const hasCriticalHorizontalOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  ));
  expect(hasCriticalHorizontalOverflow).toBe(false);
});

test('loading history is not presented as a real empty state', async ({ page }) => {
  let releaseHistory: () => void = () => undefined;
  const historyIsPending = new Promise<void>((resolve) => {
    releaseHistory = resolve;
  });

  await page.route(apiPattern, async (route) => {
    if (route.request().method() === 'GET') {
      await historyIsPending;
      await route.fulfill({ json: { memorials: [] } });
      return;
    }
    await route.fulfill({ status: 404, json: { detail: 'Memorial não encontrado.' } });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Memoriais gerados' }).click();

  await expect(page.getByText('Carregando memoriais gerados...')).toBeVisible();
  await expect(page.getByText('Nenhum memorial nesta categoria')).toBeHidden();

  releaseHistory();
  await expect(page.getByText('Nenhum memorial nesta categoria')).toBeVisible();
});

test('failed and processing generations show safe state and block unavailable download', async ({ page }) => {
  await mockMemorials(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Memoriais gerados' }).click();

  await selectMemorial(page, 'Projeto Telecom Com Falha');
  await expect(page.getByRole('heading', { name: 'Projeto Telecom Com Falha' })).toBeVisible();
  await expect(page.getByText('Erro na geração')).toBeVisible();
  await expect(page.getByText('Falha segura retornada pela API.')).toBeVisible();

  await selectMemorial(page, 'Projeto Telecom Em Processamento');
  await expect(page.getByRole('heading', { name: 'Projeto Telecom Em Processamento' })).toBeVisible();
  await expect(page.getByText('Em geração', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Baixar Projeto Telecom Em Processamento' })).toBeDisabled();
});

test('recoverable upload error keeps selected file and hides technical details', async ({ page }) => {
  await mockMemorials(page);
  await page.goto('/');

  await page.locator('#memorial-files-telecomunicacoes').setInputFiles(samplePdfPath);
  await expect(page.getByText('sample.pdf')).toBeVisible();

  await page.getByRole('button', { name: 'Gerar memorial' }).click();

  await expect(page.getByText('A API está temporariamente indisponível para acessar o memorial. Tente novamente em instantes.')).toBeVisible();
  await expect(page.getByText('sample.pdf')).toBeVisible();
  await expect(page.getByText(/Traceback|stack trace|\/home\/|\/tmp\/|secret|token|password/i)).toHaveCount(0);
});

test('network error shows understandable safe message without stack trace or internal path', async ({ page }) => {
  await page.route(apiPattern, async (route) => {
    await route.abort('failed');
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Memoriais gerados' }).click();

  await expect(page.getByText('Não foi possível carregar o histórico')).toBeVisible();
  await expect(page.getByText('Verifique a conexão com a API e tente novamente.')).toBeVisible();
  await expect(page.getByText(/Traceback|stack trace|\/home\/|\/tmp\/|secret|token|password/i)).toHaveCount(0);
});
