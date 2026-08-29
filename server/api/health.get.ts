export default defineEventHandler(() => {
  const config = useRuntimeConfig();

  return {
    ok: true,
    service: 'sazan',
    phase: 'lead-generation-flow',
    i18n: {
      locales: ['fa', 'en'],
      defaultLocale: config.public.defaultLocale
    },
    database: {
      provider: 'mongodb',
      configured: Boolean(config.mongodbUri),
      database: config.mongodbDatabase || 'sazan'
    },
    notifications: {
      provider: config.notifications.webhookProviderName || 'webhook',
      configured: Boolean(config.notifications.webhookUrl),
      fallback: 'development-log'
    },
    storage: {
      provider: config.storageProvider,
      minioPrepared: Boolean(config.minio.endpoint && config.minio.bucket)
    }
  };
});
