import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { createStaticServer } from './server.mjs';

const distDir = await mkdtemp(path.join(tmpdir(), 'dashboard-static-'));

try {
  await mkdir(path.join(distDir, 'assets'));
  await writeFile(path.join(distDir, 'index.html'), '<main>Dashboard Memorial</main>');
  await writeFile(path.join(distDir, 'assets', 'app.js'), 'console.log("ok");');

  const server = createStaticServer({ distDir });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    const root = await fetch(`${baseUrl}/`);
    assert.equal(root.status, 200);
    assert.equal(await root.text(), '<main>Dashboard Memorial</main>');
    assert.equal(root.headers.get('content-type'), 'text/html; charset=utf-8');

    const head = await fetch(`${baseUrl}/`, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
    assert.equal(head.headers.get('content-type'), 'text/html; charset=utf-8');

    const asset = await fetch(`${baseUrl}/assets/app.js`);
    assert.equal(asset.status, 200);
    assert.equal(await asset.text(), 'console.log("ok");');
    assert.equal(asset.headers.get('content-type'), 'text/javascript; charset=utf-8');

    const route = await fetch(`${baseUrl}/projetos/123`);
    assert.equal(route.status, 200);
    assert.equal(await route.text(), '<main>Dashboard Memorial</main>');

    const missingAsset = await fetch(`${baseUrl}/assets/missing.js`);
    assert.equal(missingAsset.status, 404);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
} finally {
  await rm(distDir, { recursive: true, force: true });
}
