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
  devtools: { enabled: true },

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
        { name: 'color-scheme', content: 'light dark' }
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
    minio: {
      endpoint: process.env.MINIO_ENDPOINT || '',
      accessKey: process.env.MINIO_ACCESS_KEY || '',
      secretKey: process.env.MINIO_SECRET_KEY || '',
      bucket: process.env.MINIO_BUCKET || 'sazan-media'
    },
    public: {
      siteName: 'SAZAN',
      defaultLocale: 'fa'
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
