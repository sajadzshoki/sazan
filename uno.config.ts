import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
  presets: [
    presetUno({
      dark: 'class'
    })
  ],
  theme: {
    colors: {
      background: 'rgb(var(--color-background) / <alpha-value>)',
      foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
      muted: 'rgb(var(--color-muted) / <alpha-value>)',
      border: 'rgb(var(--color-border) / <alpha-value>)',
      surface: 'rgb(var(--color-surface) / <alpha-value>)',
      elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      accent: 'rgb(var(--color-accent) / <alpha-value>)'
    },
    borderRadius: {
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-xl)',
      '2xl': 'var(--radius-2xl)',
      '3xl': 'var(--radius-3xl)'
    },
    spacing: {
      gutter: 'var(--space-gutter)',
      section: 'var(--space-section)'
    }
  },
  shortcuts: {
    'sazan-container': 'mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-10',
    'sazan-focus': 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'sazan-surface': 'border border-border bg-surface text-foreground shadow-sm',
    'sazan-link': 'sazan-focus rounded-full text-sm font-medium text-muted transition-colors hover:text-foreground',
    'sazan-button-primary': 'sazan-focus inline-flex items-center justify-center rounded-full border border-primary bg-primary px-5 py-3 text-sm font-semibold text-background shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0',
    'sazan-button-secondary': 'sazan-focus inline-flex items-center justify-center rounded-full border border-border bg-surface/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/45 hover:bg-elevated/80 active:translate-y-0'
  }
});
