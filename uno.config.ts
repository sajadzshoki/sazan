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
      soft: 'rgb(var(--color-background-soft) / <alpha-value>)',
      foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
      muted: 'rgb(var(--color-muted) / <alpha-value>)',
      subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
      border: 'rgb(var(--color-border) / <alpha-value>)',
      surface: 'rgb(var(--color-surface) / <alpha-value>)',
      elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
      primary: 'rgb(var(--color-primary) / <alpha-value>)',
      primaryHover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
      onPrimary: 'rgb(var(--color-on-primary) / <alpha-value>)',
      accent: 'rgb(var(--color-accent) / <alpha-value>)'
    },
    fontFamily: {
      sans: 'Manrope, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
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
    'sazan-container': 'mx-auto w-full max-w-[82rem] px-5 sm:px-8 lg:px-10',
    'sazan-focus': 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'sazan-surface': 'border border-border bg-surface text-foreground',
    'sazan-link': 'sazan-focus rounded-sm text-sm font-medium text-muted transition-colors hover:text-foreground',
    'sazan-chip': 'inline-flex h-max items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold leading-5 text-muted transition-colors',
    'sazan-button-primary': 'sazan-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-onPrimary shadow-[var(--shadow-button)] transition duration-200 hover:bg-primaryHover active:translate-y-px',
    'sazan-button-secondary': 'sazan-focus inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition duration-200 hover:border-primary/50 hover:text-primary'
  }
});
