const themeInitScript = `
(function () {
  try {
    var preference = window.localStorage.getItem('sazan-theme') || 'system';
    var isDark = preference === 'dark' || (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var theme = isDark ? 'dark' : 'light';
    var root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = theme;
  } catch (_) {}
})();
`;

export default defineNuxtConfig({
  compatibilityDate: '2026-08-29',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: ['@nuxt/ui', '@unocss/nuxt', '@nuxtjs/i18n'],

  ui: {
    fonts: false,
    colorMode: false
  },

  css: ['@unocss/reset/tailwind.css', '~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'fa-IR',
        dir: 'rtl'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'theme-color', content: '#f8f7f3', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#090a0a', media: '(prefers-color-scheme: dark)' },
        { name: 'application-name', content: 'SAZAN' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          innerHTML: themeInitScript,
          tagPosition: 'head'
        }
      ]
    }
  },

  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI || '',
    mongodbDatabase: process.env.MONGODB_DATABASE || 'sazan',
    storageProvider: process.env.STORAGE_PROVIDER || 'local',
    notifications: {
      webhookUrl: process.env.NOTIFICATION_WEBHOOK_URL || '',
      webhookToken: process.env.NOTIFICATION_WEBHOOK_TOKEN || '',
      webhookProviderName: process.env.NOTIFICATION_WEBHOOK_PROVIDER_NAME || 'webhook'
    },
    admin: {
      email: process.env.ADMIN_EMAIL || '',
      password: process.env.ADMIN_PASSWORD || '',
      sessionSecret: process.env.ADMIN_SESSION_SECRET || '',
      sessionMaxAgeSeconds: Number(process.env.ADMIN_SESSION_MAX_AGE_SECONDS || 60 * 60 * 8)
    },
    minio: {
      endpoint: process.env.MINIO_ENDPOINT || '',
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
      bucket: process.env.MINIO_BUCKET || 'sazan-media'
    },
    public: {
      siteName: 'SAZAN',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://sazan.studio',
      defaultLocale: 'fa',
      contact: {
        email: process.env.NUXT_PUBLIC_CONTACT_EMAIL || 'hello@sazan.studio',
        whatsapp: process.env.NUXT_PUBLIC_CONTACT_WHATSAPP || '',
        telegram: process.env.NUXT_PUBLIC_CONTACT_TELEGRAM || '',
        phone: process.env.NUXT_PUBLIC_CONTACT_PHONE || '',
        social: {
          linkedin: process.env.NUXT_PUBLIC_SOCIAL_LINKEDIN || '',
          behance: process.env.NUXT_PUBLIC_SOCIAL_BEHANCE || '',
          dribbble: process.env.NUXT_PUBLIC_SOCIAL_DRIBBBLE || ''
        }
      }
    }
  },

  i18n: {
    defaultLocale: 'fa',
    strategy: 'prefix',
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'fa',
        name: 'فارسی',
        language: 'fa-IR',
        dir: 'rtl'
      },
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
        dir: 'ltr'
      }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'sazan_locale',
      redirectOn: 'root',
      fallbackLocale: 'fa'
    }
  },

  typescript: {
    strict: true
  }
});
