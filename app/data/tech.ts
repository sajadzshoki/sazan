export type TechKey =
  | 'nuxt'
  | 'vue'
  | 'typescript'
  | 'node'
  | 'adonis'
  | 'postgres'
  | 'mongo'
  | 'docker'
  | 'nginx'
  | 'flutter'
  | 'android'
  | 'apple'
  | 'minio';

export interface TechLogo {
  name: string;
  src: string;
  mono?: boolean;
}

export const techLogos: Record<TechKey, TechLogo> = {
  nuxt: { name: 'Nuxt', src: '/tech/nuxt.svg' },
  vue: { name: 'Vue', src: '/tech/vuedotjs.svg' },
  typescript: { name: 'TypeScript', src: '/tech/typescript.svg' },
  node: { name: 'Node.js', src: '/tech/nodedotjs.svg' },
  adonis: { name: 'AdonisJS', src: '/tech/adonisjs.svg' },
  postgres: { name: 'PostgreSQL', src: '/tech/postgresql.svg' },
  mongo: { name: 'MongoDB', src: '/tech/mongodb.svg' },
  docker: { name: 'Docker', src: '/tech/docker.svg' },
  nginx: { name: 'Nginx', src: '/tech/nginx.svg' },
  flutter: { name: 'Flutter', src: '/tech/flutter.svg' },
  android: { name: 'Android', src: '/tech/android.svg' },
  apple: { name: 'iOS', src: '/tech/apple.svg', mono: true },
  minio: { name: 'MinIO', src: '/tech/minio.svg' }
};

export const studioTechKeys: readonly TechKey[] = [
  'nuxt',
  'vue',
  'typescript',
  'node',
  'adonis',
  'postgres',
  'mongo',
  'docker',
  'nginx',
  'flutter',
  'android',
  'minio'
];
