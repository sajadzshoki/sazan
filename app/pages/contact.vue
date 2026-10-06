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
const { data: siteSettings } = await useFetch('/api/site-settings', { key: 'site-settings' });
const localePath = useLocalePath();
const { t } = useI18n();
const startProjectPath = computed(() => localePath('/start-a-project'));
const projectsPath = computed(() => localePath('/projects'));

const cleanPhoneForHref = (value: string) => value.replace(/[^+\d]/g, '');
const cleanTelegramHandle = (value: string) => value.replace(/^@/, '').replace(/^https?:\/\/t\.me\//, '');

const contactConfig = computed(() => {
  const configuredContact = config.public.contact;
  const managedContact = siteSettings.value?.contact;

  return {
    email: managedContact?.email || configuredContact?.email || 'hello@sazan.studio',
    whatsapp: managedContact?.whatsapp || configuredContact?.whatsapp || '',
    telegram: managedContact?.telegram || configuredContact?.telegram || '',
    phone: managedContact?.phone || configuredContact?.phone || '',
    social: {
      linkedin: managedContact?.social?.linkedin || configuredContact?.social?.linkedin || '',
      behance: managedContact?.social?.behance || configuredContact?.social?.behance || '',
      dribbble: managedContact?.social?.dribbble || configuredContact?.social?.dribbble || ''
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

usePublicSeo({
  title: () => t('contact.seo.title'),
  description: () => t('contact.seo.description'),
  structuredData: () => ({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('contact.seo.title'),
    description: t('contact.seo.description'),
    email: contactConfig.value.email
  })
});
</script>

<template>
  <div>
    <section class="page-intro border-b border-border">
      <BaseContainer>
        <p class="sazan-eyebrow">
          {{ t('contact.hero.eyebrow') }}
        </p>
        <h1 class="page-intro-title">
          {{ t('contact.hero.title') }}
        </h1>
        <p class="page-intro-lead">
          {{ t('contact.hero.lead') }}
        </p>
        <NuxtLink :to="startProjectPath" class="sazan-button-primary mt-4 w-full sm:w-max">
          {{ t('common.startProject') }}
          <span class="arrow-icon" aria-hidden="true">→</span>
        </NuxtLink>
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
                class="contact-card"
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

            <div class="contact-social">
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
                    class="contact-social-item sazan-focus"
                  >
                    <span class="block font-black text-foreground">{{ social.label }}</span>
                    <span class="mt-2 block truncate text-muted">{{ social.value }}</span>
                  </a>
                  <div v-else class="contact-social-item">
                    <span class="block font-black text-foreground">{{ social.label }}</span>
                    <span class="mt-2 block truncate text-muted">{{ social.value }}</span>
                  </div>
                </template>
              </div>
            </div>

            <div class="contact-cta">
              <div class="contact-cta-mark" aria-hidden="true" />
              <div class="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p class="sazan-eyebrow">
                    {{ t('contact.cta.eyebrow') }}
                  </p>
                  <h2 class="sazan-heading-lg mt-4 max-w-3xl text-balance text-foreground">
                    {{ t('contact.cta.title') }}
                  </h2>
                  <p class="mt-5 max-w-2xl text-base leading-8 text-muted">
                    {{ t('contact.cta.lead') }}
                  </p>
                </div>

                <div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <NuxtLink :to="startProjectPath" class="sazan-button-primary">
                    {{ t('common.startProject') }}
                    <span class="arrow-icon" aria-hidden="true">→</span>
                  </NuxtLink>
                  <NuxtLink :to="projectsPath" class="sazan-button-secondary">
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

<style scoped>
.contact-card,
.contact-social,
.contact-cta {
  border: 1px solid rgb(var(--color-border));
  border-radius: 1.35rem;
  box-shadow: var(--shadow-soft);
}

.contact-card,
.contact-social-item {
  background: rgb(var(--color-surface));
  transition: border-color 200ms var(--ease-studio), transform 200ms var(--ease-studio);
}

.contact-card {
  padding: 1.25rem;
}

.contact-card:hover,
.contact-social-item:hover {
  border-color: rgb(var(--color-primary) / 0.45);
}

.contact-social {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  background:
    radial-gradient(420px 180px at 100% 0%, rgb(var(--color-primary) / 0.08), transparent 62%),
    rgb(var(--color-background) / 0.72);
}

.contact-social-item {
  display: block;
  border: 1px solid rgb(var(--color-border));
  border-radius: 1rem;
  padding: 1rem;
  font-size: 0.875rem;
}

.contact-cta {
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  background:
    radial-gradient(520px 240px at 100% 0%, rgb(var(--color-primary) / 0.18), transparent 58%),
    linear-gradient(165deg, rgb(var(--color-surface-elevated)), rgb(var(--color-surface)));
}

.contact-cta-mark {
  position: absolute;
  inset-inline-end: -3.5rem;
  bottom: -4.5rem;
  width: 14rem;
  height: 14rem;
  border-radius: 999px;
  background: rgb(var(--color-primary) / 0.12);
}

html[dir='rtl'] .contact-social {
  background:
    radial-gradient(420px 180px at 0% 0%, rgb(var(--color-primary) / 0.08), transparent 62%),
    rgb(var(--color-background) / 0.72);
}

html[dir='rtl'] .contact-cta {
  background:
    radial-gradient(520px 240px at 0% 0%, rgb(var(--color-primary) / 0.18), transparent 58%),
    linear-gradient(195deg, rgb(var(--color-surface-elevated)), rgb(var(--color-surface)));
}

@media (min-width: 768px) {
  .contact-social {
    grid-template-columns: 0.35fr 0.65fr;
    align-items: center;
  }
}

@media (min-width: 640px) {
  .contact-cta {
    padding: 2rem;
  }
}
</style>
