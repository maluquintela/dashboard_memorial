import http from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DIST_DIR = path.join(__dirname, 'dist');
const DEFAULT_PORT = 8080;
const HOST = '0.0.0.0';

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getContentType(filePath) {
  return CONTENT_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function fileExists(filePath) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

function sendFile(request, response, filePath) {
  response.writeHead(200, {
    'Content-Type': getContentType(filePath),
    'Cache-Control': filePath.includes(`${path.sep}assets${path.sep}`)
      ? 'public, max-age=31536000, immutable'
      : 'no-cache',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

function sendNotFound(response) {
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

export function createStaticServer({ distDir = DEFAULT_DIST_DIR } = {}) {
  const rootDir = path.resolve(distDir);
  const indexPath = path.join(rootDir, 'index.html');

  return http.createServer(async (request, response) => {
    if (!request.url || !['GET', 'HEAD'].includes(request.method ?? '')) {
      sendNotFound(response);
      return;
    }

    const url = new URL(request.url, 'http://localhost');
    const decodedPath = decodeURIComponent(url.pathname);
    const requestedPath = path.join(rootDir, decodedPath);

    if (!isInside(rootDir, requestedPath)) {
      sendNotFound(response);
      return;
    }

    if (await fileExists(requestedPath)) {
      sendFile(request, response, requestedPath);
      return;
    }

    const looksLikeAsset = path.extname(decodedPath) || decodedPath.startsWith('/assets/');
    if (looksLikeAsset) {
      sendNotFound(response);
      return;
    }

    sendFile(request, response, indexPath);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10);
  const server = createStaticServer();

  server.listen(port, HOST, () => {
    console.log(`Dashboard Memorial listening on http://${HOST}:${port}`);
  });
}
