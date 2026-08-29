import { createError } from 'h3';

export type StorageProvider = 'local' | 'minio';

export interface StorageRuntimeConfig {
  provider: StorageProvider;
  minio: {
    endpoint: string;
    bucket: string;
    isConfigured: boolean;
  };
}

const isStorageProvider = (value: string): value is StorageProvider => value === 'local' || value === 'minio';

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
    minio: {
      endpoint: config.minio.endpoint,
      bucket: config.minio.bucket,
      isConfigured: Boolean(config.minio.endpoint && config.minio.accessKey && config.minio.secretKey && config.minio.bucket)
    }
  };
};
