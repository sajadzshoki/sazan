export default defineEventHandler(() => {
  const config = useRuntimeConfig();

  return {
    ok: true,
    service: 'sazan',
    phase: 'portfolio-public-experience',
    i18n: {
      locales: ['fa', 'en'],
      defaultLocale: config.public.defaultLocale
    },
    database: {
      provider: 'mongodb',
      configured: Boolean(config.mongodbUri),
      database: config.mongodbDatabase || 'sazan'
    },
    storage: {
      provider: config.storageProvider,
      minioPrepared: Boolean(config.minio.endpoint && config.minio.bucket)
    }
  };
});
