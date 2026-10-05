import type { TechKey } from './tech';

export type NavItemKey = 'home' | 'work' | 'services' | 'about' | 'contact';
export type FeaturedProjectKey = 'atlas' | 'nova' | 'pulse' | 'bazaar' | 'panelix';
export type ProjectTone = 'primary' | 'accent' | 'mono';
export type ProjectLayout = 'wide' | 'tall' | 'standard';
export type ServiceKey = 'websites' | 'webApps' | 'mobileApps' | 'ecommerce' | 'adminPanels' | 'backendSystems';
export type ProcessKey = 'discover' | 'design' | 'build' | 'launch' | 'evolve';

export interface NavItem {
  key: NavItemKey;
  path?: string;
  hash?: string;
}

export interface FeaturedProject {
  key: FeaturedProjectKey;
  slug: string;
  year: string;
  technologies: string[];
  tone: ProjectTone;
  layout: ProjectLayout;
}

export interface ServiceItem {
  key: ServiceKey;
  index: string;
  technologies: string[];
  logos: readonly TechKey[];
}

export interface ProcessStep {
  key: ProcessKey;
  index: string;
}

export const navItems: readonly NavItem[] = [
  { key: 'home', path: '/' },
  { key: 'work', path: '/projects' },
  { key: 'services', path: '/services' },
  { key: 'about', path: '/about' },
  { key: 'contact', path: '/contact' }
];

export const studioTechnologies = ['Nuxt', 'Vue', 'TypeScript', 'Node.js', 'AdonisJS', 'PostgreSQL', 'Docker', 'MinIO'] as const;

export const credibilityGroups = [
  { key: 'frontend', items: ['Nuxt', 'Vue', 'TypeScript'] },
  { key: 'backend', items: ['Node.js', 'AdonisJS', 'APIs'] },
  { key: 'data', items: ['PostgreSQL', 'MongoDB'] },
  { key: 'infrastructure', items: ['Docker', 'Nginx', 'Object storage'] }
] as const;

export const featuredProjects: readonly FeaturedProject[] = [
  {
    key: 'atlas',
    slug: 'atlas-commerce-studio',
    year: '2026',
    technologies: ['Nuxt', 'MongoDB', 'Stripe'],
    tone: 'primary',
    layout: 'wide'
  },
  {
    key: 'nova',
    slug: 'nova-health-portal',
    year: '2025',
    technologies: ['Vue', 'Node', 'Maps'],
    tone: 'accent',
    layout: 'tall'
  },
  {
    key: 'pulse',
    slug: 'pulse-finance-mobile',
    year: '2025',
    technologies: ['Flutter', 'API', 'Realtime'],
    tone: 'mono',
    layout: 'standard'
  },
  {
    key: 'bazaar',
    slug: 'bazaar-editorial-shop',
    year: '2024',
    technologies: ['Commerce', 'CMS', 'Analytics'],
    tone: 'primary',
    layout: 'standard'
  },
  {
    key: 'panelix',
    slug: 'panelix-operations-os',
    year: '2024',
    technologies: ['Admin', 'RBAC', 'Charts'],
    tone: 'accent',
    layout: 'wide'
  }
];

export const services: readonly ServiceItem[] = [
  { key: 'websites', index: '01', technologies: ['SEO', 'Performance'], logos: ['nuxt', 'vue', 'typescript'] },
  { key: 'webApps', index: '02', technologies: ['API', 'Realtime'], logos: ['vue', 'typescript', 'node'] },
  { key: 'mobileApps', index: '03', technologies: [], logos: ['flutter', 'android', 'apple'] },
  { key: 'ecommerce', index: '04', technologies: ['Checkout', 'Catalog'], logos: ['nuxt', 'node', 'postgres'] },
  { key: 'adminPanels', index: '05', technologies: ['RBAC', 'Dashboards'], logos: ['vue', 'typescript', 'node'] },
  { key: 'backendSystems', index: '06', technologies: ['Integrations'], logos: ['node', 'adonis', 'postgres', 'mongo', 'docker'] }
];

export const processSteps: readonly ProcessStep[] = [
  { key: 'discover', index: '01' },
  { key: 'design', index: '02' },
  { key: 'build', index: '03' },
  { key: 'launch', index: '04' },
  { key: 'evolve', index: '05' }
];

export const socialLinks = ['LinkedIn', 'Behance', 'Dribbble'] as const;
