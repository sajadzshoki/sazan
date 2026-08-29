import {
  getPortfolioProjectBySlug,
  getRelatedPortfolioProjects,
  portfolioCategories,
  portfolioFilters,
  portfolioProjects,
  type PortfolioCategoryKey,
  type PortfolioFilterKey,
  type PortfolioGalleryItem,
  type PortfolioProject,
  type PortfolioResult,
  type PortfolioVideo
} from '~/data/projects';
import type { LocaleCode, LocalizedString, ProjectPricing, ProjectTimeline } from '~~/types';

export interface LocalizedPortfolioGalleryItem extends Omit<PortfolioGalleryItem, 'title' | 'caption'> {
  title: string;
  caption: string;
}

export interface LocalizedPortfolioVideo extends Omit<PortfolioVideo, 'title' | 'description' | 'label'> {
  title: string;
  description: string;
  label: string;
}

export interface LocalizedPortfolioResult extends Omit<PortfolioResult, 'value' | 'label'> {
  value: string;
  label: string;
}

export type LocalizedProjectPricing = Omit<ProjectPricing, 'note'> & {
  note?: string;
};

export type LocalizedProjectTimeline = Omit<ProjectTimeline, 'note'> & {
  note?: string;
};

export interface LocalizedPortfolioProject extends Omit<PortfolioProject,
  | 'title'
  | 'shortDescription'
  | 'fullDescription'
  | 'overview'
  | 'challenge'
  | 'solution'
  | 'keyFeatures'
  | 'gallery'
  | 'video'
  | 'pricing'
  | 'timeline'
  | 'results'
> {
  title: string;
  shortDescription: string;
  fullDescription: string;
  overview: string;
  challenge: string;
  solution: string;
  keyFeatures: string[];
  gallery: LocalizedPortfolioGalleryItem[];
  video: LocalizedPortfolioVideo | undefined;
  pricing: LocalizedProjectPricing | undefined;
  timeline: LocalizedProjectTimeline | undefined;
  results: LocalizedPortfolioResult[];
  raw: PortfolioProject;
}

const getLocaleCode = (locale: string): LocaleCode => (locale === 'fa' ? 'fa' : 'en');

const localizeString = (value: LocalizedString, locale: LocaleCode) => value[locale] || value.en || value.fa;

const localizePricing = (pricing: ProjectPricing | undefined, locale: LocaleCode): LocalizedProjectPricing | undefined => {
  if (!pricing) {
    return undefined;
  }

  const { note, ...rest } = pricing;

  return note ? { ...rest, note: localizeString(note, locale) } : rest;
};

const localizeTimeline = (timeline: ProjectTimeline | undefined, locale: LocaleCode): LocalizedProjectTimeline | undefined => {
  if (!timeline) {
    return undefined;
  }

  const { note, ...rest } = timeline;

  return note ? { ...rest, note: localizeString(note, locale) } : rest;
};

export const usePortfolio = () => {
  const { locale, t } = useI18n();

  const activeLocale = computed(() => getLocaleCode(locale.value));

  const localizeProject = (project: PortfolioProject): LocalizedPortfolioProject => {
    const localeCode = activeLocale.value;
    const video = project.video
      ? {
          title: localizeString(project.video.title, localeCode),
          description: localizeString(project.video.description, localeCode),
          label: localizeString(project.video.label, localeCode)
        }
      : undefined;

    return {
      ...project,
      title: localizeString(project.title, localeCode),
      shortDescription: localizeString(project.shortDescription, localeCode),
      fullDescription: localizeString(project.fullDescription, localeCode),
      overview: localizeString(project.overview, localeCode),
      challenge: localizeString(project.challenge, localeCode),
      solution: localizeString(project.solution, localeCode),
      keyFeatures: project.keyFeatures.map((feature) => localizeString(feature, localeCode)),
      gallery: project.gallery.map((item) => ({
        ...item,
        title: localizeString(item.title, localeCode),
        caption: localizeString(item.caption, localeCode)
      })),
      video,
      pricing: localizePricing(project.pricing, localeCode),
      timeline: localizeTimeline(project.timeline, localeCode),
      results: project.results.map((result) => ({
        value: localizeString(result.value, localeCode),
        label: localizeString(result.label, localeCode)
      })),
      raw: project
    };
  };

  const projects = computed(() => portfolioProjects
    .filter((project) => project.status === 'published')
    .map((project) => localizeProject(project)));

  const featuredProjects = computed(() => projects.value.filter((project) => project.featured));

  const getCategoryLabel = (category: PortfolioFilterKey) => {
    return t(`portfolio.categories.${category}`);
  };

  const getProjectBySlug = (slug: string) => {
    const project = getPortfolioProjectBySlug(slug);

    return project ? localizeProject(project) : undefined;
  };

  const getRelatedProjects = (project: PortfolioProject, limit = 3) => {
    return getRelatedPortfolioProjects(project, limit).map((relatedProject) => localizeProject(relatedProject));
  };

  return {
    categories: portfolioCategories,
    filters: portfolioFilters,
    projects,
    featuredProjects,
    getCategoryLabel,
    getProjectBySlug,
    getRelatedProjects,
    localizeProject
  };
};

export type { PortfolioCategoryKey, PortfolioFilterKey };
