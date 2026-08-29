<script setup lang="ts">
const { t } = useI18n();
const { preference, resolvedTheme, cycleThemePreference } = useAppTheme();

const currentThemeLabel = computed(() => t(`theme.${preference.value}`));
const themeSymbol = computed(() => (resolvedTheme.value === 'dark' ? '●' : '○'));
</script>

<template>
  <button
    type="button"
    class="sazan-focus group inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface/70 px-3 text-xs font-bold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary/45 hover:bg-elevated/70"
    :aria-label="$t('theme.switchTo', { theme: currentThemeLabel })"
    @click="cycleThemePreference"
  >
    <span
      class="grid h-4 w-4 place-items-center rounded-full border border-primary/50 text-[0.55rem] text-primary transition group-hover:scale-110"
      aria-hidden="true"
    >
      {{ themeSymbol }}
    </span>
    <span>{{ currentThemeLabel }}</span>
  </button>
</template>
