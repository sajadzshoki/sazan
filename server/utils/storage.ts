import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { createError } from 'h3';
import type { MediaAsset, MediaProvider } from '~~/types';

export type StorageProvider = MediaProvider;

export interface StorageRuntimeConfig {
  provider: StorageProvider;
  local: {
    baseDir: string;
    publicBaseUrl: string;
  };
  minio: {
    endpoint: string;
    bucket: string;
    isConfigured: boolean;
  };
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'application/pdf'
]);

const maxUploadBytes = 8 * 1024 * 1024;
const isStorageProvider = (value: string): value is StorageProvider => value === 'local' || value === 'minio';

const extensionFromMime = (mimeType = '') => {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'application/pdf': '.pdf'
  };

  return map[mimeType] || '';
};

const sanitizeFilename = (filename = 'media') => filename
  .toLowerCase()
  .replace(/[^a-z0-9._-]+/g, '-')
  .replace(/-{2,}/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 90) || 'media';

export const getStorageRuntimeConfig = (): StorageRuntimeConfig => {
  const config = useRuntimeConfig();
  const provider = String(config.storageProvider || 'local');

  if (!isStorageProvider(provider)) {
    throw createError({
      statusCode: 500,
      statusMessage: `Unsupported storage provider: ${provider}`
    });
  }

  return {
    provider,
    local: {
      baseDir: join(process.cwd(), 'public', 'uploads', 'admin'),
      publicBaseUrl: '/uploads/admin'
    },
    minio: {
      endpoint: config.minio.endpoint,
      bucket: config.minio.bucket,
      isConfigured: Boolean(config.minio.endpoint && config.minio.accessKey && config.minio.secretKey && config.minio.bucket)
    }
  };
};

export const getMediaProviderStatus = () => {
  const config = getStorageRuntimeConfig();

  return {
    provider: config.provider,
    local: {
      enabled: config.provider === 'local',
      publicBaseUrl: config.local.publicBaseUrl
    },
    minio: {
      enabled: config.provider === 'minio',
      configured: config.minio.isConfigured,
      endpoint: config.minio.endpoint ? 'configured' : 'missing',
      bucket: config.minio.bucket || ''
    }
  };
};

export const saveMediaPart = async (part: { filename?: string; type?: string; data: Buffer }): Promise<MediaAsset> => {
  const config = getStorageRuntimeConfig();
  const mimeType = part.type || 'application/octet-stream';

  if (!allowedMimeTypes.has(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported media type' });
  }

  if (part.data.byteLength > maxUploadBytes) {
    throw createError({ statusCode: 413, statusMessage: 'Media file is too large' });
  }

  if (config.provider === 'minio') {
    throw createError({
      statusCode: 501,
      statusMessage: config.minio.isConfigured
        ? 'MinIO upload adapter is configured for future implementation'
        : 'MinIO storage is not configured'
    });
  }

  const safeName = sanitizeFilename(part.filename);
  const ext = extname(safeName) || extensionFromMime(mimeType);
  const key = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}${ext}`;
  const targetPath = join(config.local.baseDir, key);

  await mkdir(join(config.local.baseDir, key.split('/')[0] || ''), { recursive: true });
  await writeFile(targetPath, part.data);

  return {
    provider: 'local',
    key,
    url: `${config.local.publicBaseUrl}/${key}`,
    mimeType,
    size: part.data.byteLength
  };
};
