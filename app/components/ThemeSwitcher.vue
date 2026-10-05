<script setup lang="ts">
import { nextTick } from 'vue';

const { t } = useI18n();
const { resolvedTheme, setThemePreference } = useAppTheme();

const isDark = computed(() => resolvedTheme.value === 'dark');
const nextLabel = computed(() => t(isDark.value ? 'theme.light' : 'theme.dark'));

const toggleTheme = (event: MouseEvent) => {
  const next = isDark.value ? 'light' : 'dark';
  const root = document.documentElement;
  root.style.setProperty('--theme-x', `${event.clientX}px`);
  root.style.setProperty('--theme-y', `${event.clientY}px`);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canTransition = typeof document.startViewTransition === 'function';

  if (reduceMotion || !canTransition) {
    setThemePreference(next);
    return;
  }

  document.startViewTransition(async () => {
    setThemePreference(next);
    await nextTick();
  });
};
</script>

<template>
  <button
    type="button"
    class="theme-switch"
    :class="{ 'is-dark': isDark }"
    :aria-pressed="isDark"
    :aria-label="$t('theme.switchTo', { theme: nextLabel })"
    @click="toggleTheme"
  >
    <span class="theme-switch-icon theme-switch-sun" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M6 6l1.3 1.3M16.7 16.7 18 18M18 6l-1.3 1.3M7.3 16.7 6 18" stroke-linecap="round" />
      </svg>
    </span>
    <span class="theme-switch-icon theme-switch-moon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.2 3.4a8.2 8.2 0 1 0 5.4 12.8A8.5 8.5 0 0 1 15.2 3.4Z" />
      </svg>
    </span>
    <span class="theme-switch-knob" aria-hidden="true">
      <svg v-if="!isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="3.2" />
        <path d="M12 4.2v1.6M12 18.2v1.6M4.2 12h1.6M18.2 12h1.6M6.4 6.4l1.1 1.1M16.5 16.5l1.1 1.1M17.6 6.4l-1.1 1.1M7.5 16.5l-1.1 1.1" stroke-linecap="round" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.2 3.4a8.2 8.2 0 1 0 5.4 12.8A8.5 8.5 0 0 1 15.2 3.4Z" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.theme-switch {
  position: relative;
  display: inline-flex;
  width: 3.35rem;
  height: 1.9rem;
  align-items: center;
  border: 1px solid rgb(var(--color-border));
  border-radius: 999px;
  background: rgb(var(--color-surface-muted));
  color: rgb(var(--color-muted));
  transition: background 280ms var(--ease-studio), border-color 280ms var(--ease-studio);
}

.theme-switch.is-dark {
  border-color: rgb(var(--color-border-strong));
  background: rgb(var(--color-foreground));
  color: rgb(var(--color-background));
}

.theme-switch-icon {
  position: absolute;
  top: 50%;
  display: grid;
  width: 0.85rem;
  height: 0.85rem;
  place-items: center;
  transform: translateY(-50%);
  opacity: 0.7;
}

.theme-switch-icon svg {
  width: 0.85rem;
  height: 0.85rem;
}

.theme-switch-sun {
  inset-inline-start: 0.38rem;
}

.theme-switch-moon {
  inset-inline-end: 0.38rem;
}

.theme-switch.is-dark .theme-switch-sun,
.theme-switch:not(.is-dark) .theme-switch-moon {
  opacity: 0.35;
}

.theme-switch-knob {
  position: absolute;
  top: 2px;
  inset-inline-start: 2px;
  display: grid;
  width: 1.5rem;
  height: 1.5rem;
  place-items: center;
  border-radius: 999px;
  background: rgb(var(--color-surface));
  color: rgb(var(--color-primary));
  box-shadow: 0 4px 10px rgb(15 23 42 / 0.12);
  transition: inset-inline-start 420ms var(--ease-studio), background 280ms var(--ease-studio), color 280ms var(--ease-studio);
}

.theme-switch.is-dark .theme-switch-knob {
  inset-inline-start: calc(100% - 1.5rem - 2px);
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));
}

.theme-switch-knob svg {
  width: 0.9rem;
  height: 0.9rem;
}
</style>
