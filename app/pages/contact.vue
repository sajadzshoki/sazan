<script setup lang="ts">
type ContactChannel = {
  key: 'email' | 'whatsapp' | 'telegram' | 'phone';
  label: string;
  value: string;
  href: string | undefined;
  note: string;
};

type SocialChannel = {
  key: 'linkedin' | 'behance' | 'dribbble';
  label: string;
  value: string;
  href: string | undefined;
};

const config = useRuntimeConfig();
const localePath = useLocalePath();
const { t } = useI18n();
const startProjectPath = computed(() => localePath('/start-a-project'));
const projectsPath = computed(() => localePath('/projects'));

const cleanPhoneForHref = (value: string) => value.replace(/[^+\d]/g, '');
const cleanTelegramHandle = (value: string) => value.replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');

const contactConfig = computed(() => {
  const configuredContact = config.public.contact;

  return {
    email: configuredContact?.email || 'hello@sazan.studio',
    whatsapp: configuredContact?.whatsapp || '',
    telegram: configuredContact?.telegram || '',
    phone: configuredContact?.phone || '',
    social: {
      linkedin: configuredContact?.social?.linkedin || '',
      behance: configuredContact?.social?.behance || '',
      dribbble: configuredContact?.social?.dribbble || ''
    }
  };
});

const channels = computed<ContactChannel[]>(() => {
  const email = contactConfig.value.email || 'hello@sazan.studio';
  const whatsapp = contactConfig.value.whatsapp || '';
  const telegram = contactConfig.value.telegram || '';
  const phone = contactConfig.value.phone || '';

  return [
    {
      key: 'email',
      label: t('contact.channels.email.label'),
      value: email,
      href: `mailto:${email}`,
      note: t('contact.channels.email.note')
    },
    {
      key: 'whatsapp',
      label: t('contact.channels.whatsapp.label'),
      value: whatsapp || t('contact.channels.whatsapp.placeholder'),
      href: whatsapp ? `https://wa.me/${cleanPhoneForHref(whatsapp)}` : undefined,
      note: t('contact.channels.whatsapp.note')
    },
    {
      key: 'telegram',
      label: t('contact.channels.telegram.label'),
      value: telegram || t('contact.channels.telegram.placeholder'),
      href: telegram ? `https://t.me/${cleanTelegramHandle(telegram)}` : undefined,
      note: t('contact.channels.telegram.note')
    },
    {
      key: 'phone',
      label: t('contact.channels.phone.label'),
      value: phone || t('contact.channels.phone.placeholder'),
      href: phone ? `tel:${cleanPhoneForHref(phone)}` : undefined,
      note: t('contact.channels.phone.note')
    }
  ];
});

const socialChannels = computed<SocialChannel[]>(() => {
  const social = contactConfig.value.social;

  return [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: social.linkedin || t('contact.social.placeholder'),
      href: social.linkedin || undefined
    },
    {
      key: 'behance',
      label: 'Behance',
      value: social.behance || t('contact.social.placeholder'),
      href: social.behance || undefined
    },
    {
      key: 'dribbble',
      label: 'Dribbble',
      value: social.dribbble || t('contact.social.placeholder'),
      href: social.dribbble || undefined
    }
  ];
});

useSeoMeta({
  title: () => t('contact.seo.title'),
  ogTitle: () => t('contact.seo.title'),
  description: () => t('contact.seo.description'),
  ogDescription: () => t('contact.seo.description')
});
</script>

<template>
  <div>
    <section class="sazan-section-tight border-b border-border">
      <BaseContainer>
        <div class="grid gap-10 lg:grid-cols-[0.62fr_0.38fr] lg:items-end lg:gap-12">
          <div>
            <p class="sazan-eyebrow motion-fade-up">
              {{ t('contact.hero.eyebrow') }}
            </p>
            <h1 class="sazan-display motion-fade-up motion-delay-1 mt-7 max-w-5xl text-balance text-foreground sm:mt-8">
              {{ t('contact.hero.title') }}
            </h1>
          </div>

          <div class="motion-fade-up motion-delay-2 grid gap-6 lg:justify-items-end lg:text-end">
            <p class="sazan-body-lg max-w-md text-pretty">
              {{ t('contact.hero.lead') }}
            </p>
            <NuxtLink :to="startProjectPath" class="sazan-button-primary w-full sm:w-max">
              {{ t('common.startProject') }}
            </NuxtLink>
          </div>
        </div>
      </BaseContainer>
    </section>

    <section class="sazan-section">
      <BaseContainer>
        <div class="grid gap-10 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12">
          <aside class="lg:sticky lg:top-28 lg:self-start">
            <p class="sazan-meta text-primary">
              {{ t('contact.directory.eyebrow') }}
            </p>
            <h2 class="sazan-heading-lg mt-5 max-w-md text-balance text-foreground">
              {{ t('contact.directory.title') }}
            </h2>
            <p class="mt-5 max-w-md text-base leading-8 text-muted">
              {{ t('contact.directory.lead') }}
            </p>
          </aside>

          <div class="grid gap-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div
                v-for="channel in channels"
                :key="channel.key"
                class="group border border-border bg-surface p-5 shadow-sm transition hover:border-primary/45"
              >
                <p class="sazan-meta text-primary">
                  {{ channel.label }}
                </p>
                <a
                  v-if="channel.href"
                  :href="channel.href"
                  class="sazan-focus mt-4 inline-flex break-all text-2xl font-black tracking-[-0.04em] text-foreground hover:text-primary"
                  :dir="channel.key === 'email' ? 'ltr' : undefined"
                >
                  {{ channel.value }}
                </a>
                <p v-else class="mt-4 text-2xl font-black tracking-[-0.04em] text-muted">
                  {{ channel.value }}
                </p>
                <p class="mt-4 text-sm leading-7 text-muted">
                  {{ channel.note }}
                </p>
              </div>
            </div>

            <div class="grid gap-4 border border-border bg-background/68 p-5 md:grid-cols-[0.35fr_0.65fr] md:items-center">
              <div>
                <p class="sazan-meta text-primary">
                  {{ t('contact.social.eyebrow') }}
                </p>
                <h3 class="sazan-title-tight mt-3 text-2xl font-black text-foreground">
                  {{ t('contact.social.title') }}
                </h3>
              </div>

              <div class="grid gap-3 sm:grid-cols-3">
                <template v-for="social in socialChannels" :key="social.key">
                  <a
                    v-if="social.href"
                    :href="social.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="sazan-focus border border-border bg-surface px-4 py-4 text-sm transition hover:border-primary/45 hover:text-primary"
                  >
                    <span class="block font-black text-foreground">{{ social.label }}</span>
                    <span class="mt-2 block truncate text-muted">{{ social.value }}</span>
                  </a>
                  <div v-else class="border border-border bg-surface px-4 py-4 text-sm">
                    <span class="block font-black text-foreground">{{ social.label }}</span>
                    <span class="mt-2 block truncate text-muted">{{ social.value }}</span>
                  </div>
                </template>
              </div>
            </div>

            <div class="relative overflow-hidden border border-border bg-foreground p-6 text-background shadow-[var(--shadow-soft)] sm:p-8">
              <div class="absolute -end-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" aria-hidden="true" />
              <div class="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p class="sazan-meta text-background/58">
                    {{ t('contact.cta.eyebrow') }}
                  </p>
                  <h2 class="sazan-heading-lg mt-4 max-w-3xl text-balance">
                    {{ t('contact.cta.title') }}
                  </h2>
                  <p class="mt-5 max-w-2xl text-base leading-8 text-background/72">
                    {{ t('contact.cta.lead') }}
                  </p>
                </div>

                <div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <NuxtLink :to="startProjectPath" class="sazan-button-primary">
                    {{ t('common.startProject') }}
                  </NuxtLink>
                  <NuxtLink :to="projectsPath" class="sazan-button-secondary border-background/24 bg-background/10 text-background hover:bg-background/20">
                    {{ t('common.exploreProjects') }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>
