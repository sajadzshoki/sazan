import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { createError, getRouterParam, sendStream, setHeader } from 'h3';

const mimeByExtension: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf'
};

export default defineEventHandler(async (event) => {
  const rawPath = String(getRouterParam(event, 'path') || '');
  const decodedPath = decodeURIComponent(rawPath);

  if (!decodedPath || decodedPath.includes('..') || decodedPath.includes('\\') || decodedPath.startsWith('/')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' });
  }

  const baseDir = join(process.cwd(), 'public', 'uploads', 'admin');
  const targetPath = normalize(join(baseDir, decodedPath));
  const lockedBase = normalize(baseDir + sep);

  if (targetPath !== normalize(baseDir) && !targetPath.startsWith(lockedBase)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' });
  }

  const fileStat = await stat(targetPath).catch(() => null);

  if (!fileStat?.isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }

  const mimeType = mimeByExtension[extname(targetPath).toLowerCase()] || 'application/octet-stream';
  setHeader(event, 'content-type', mimeType);
  setHeader(event, 'cache-control', 'public, max-age=31536000, immutable');

  return sendStream(event, createReadStream(targetPath));
});
