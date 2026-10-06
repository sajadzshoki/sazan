import type { LocalizedString, ProjectPricing, ProjectTimeline, PublishStatus } from '~~/types';
import type { ServiceKey } from './home';

export type PortfolioCategoryKey = ServiceKey;
export type PortfolioFilterKey = 'all' | PortfolioCategoryKey;
export type PortfolioVisualTone = 'primary' | 'accent' | 'mono' | 'warm' | 'cool';
export type PortfolioCardLayout = 'feature' | 'portrait' | 'landscape' | 'standard';
export type PortfolioGalleryOrientation = 'landscape' | 'portrait' | 'square' | 'wide';

export interface PortfolioVisual {
  tone: PortfolioVisualTone;
  composition: 'commerce' | 'dashboard' | 'mobile' | 'editorial' | 'backend' | 'system';
}

export interface PortfolioGalleryItem {
  id: string;
  title: LocalizedString;
  caption: LocalizedString;
  orientation: PortfolioGalleryOrientation;
  visual: PortfolioVisual;
}

export interface PortfolioVideo {
  title: LocalizedString;
  description: LocalizedString;
  label: LocalizedString;
}

export interface PortfolioResult {
  value: LocalizedString;
  label: LocalizedString;
}

export interface PortfolioMedia {
  desktop?: string;
  tablet?: string;
  mobile?: string;
}

export interface PortfolioProject {
  id: string;
  slug: string;
  title: LocalizedString;
  media?: PortfolioMedia;
  shortDescription: LocalizedString;
  fullDescription: LocalizedString;
  category: PortfolioCategoryKey;
  services: readonly ServiceKey[];
  technologies: readonly string[];
  coverVisual: PortfolioVisual;
  gallery: readonly PortfolioGalleryItem[];
  video?: PortfolioVideo;
  demoUrl?: string;
  projectUrl?: string;
  pricing?: ProjectPricing;
  timeline?: ProjectTimeline;
  year: string;
  featured: boolean;
  status: PublishStatus;
  overview: LocalizedString;
  challenge: LocalizedString;
  solution: LocalizedString;
  keyFeatures: readonly LocalizedString[];
  results: readonly PortfolioResult[];
  layout: PortfolioCardLayout;
}

export const portfolioCategories = [
  'websites',
  'webApps',
  'mobileApps',
  'ecommerce',
  'adminPanels',
  'backendSystems'
] as const satisfies readonly PortfolioCategoryKey[];

export const portfolioFilters = ['all', ...portfolioCategories] as const satisfies readonly PortfolioFilterKey[];

export const isPortfolioFilterKey = (value: unknown): value is PortfolioFilterKey => {
  return typeof value === 'string' && portfolioFilters.includes(value as PortfolioFilterKey);
};

const text = (en: string, fa: string): LocalizedString => ({ en, fa });

const shot = (url: string): PortfolioMedia => ({
  desktop: url,
  tablet: url,
  mobile: url
});

export const portfolioProjects = [
  {
    id: 'proj_ham_sakhteman',
    slug: 'ham-sakhteman',
    title: text('Ham Sakhteman', 'هم‌ساختمان'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/eeb89f83-5bf4-4e13-b648-ed7ca0255707.png'),
    shortDescription: text(
      'A building management app that stays simple, secure, and modern.',
      'اپ مدیریت ساختمان؛ ساده، امن، و بدون شلوغی اضافه.'
    ),
    fullDescription: text(
      'Ham Sakhteman is a building management product for day-to-day residential operations, with a live English and Persian experience.',
      'هم‌ساختمان برای کارهای روزمره مجتمع مسکونی است؛ به فارسی و انگلیسی.'
    ),
    category: 'webApps',
    services: ['webApps', 'adminPanels'],
    technologies: [],
    coverVisual: { tone: 'primary', composition: 'dashboard' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3001/en',
    year: '2026',
    featured: true,
    status: 'published',
    overview: text(
      'A focused product for running a building without a heavy operations tool.',
      'ابزاری جمع‌وجور برای اداره ساختمان، نه یک سیستم عملیاتی سنگین.'
    ),
    challenge: text(
      'Building managers need a clear place for everyday work, not a generic dashboard.',
      'مدیر ساختمان به جایی روشن برای کار هر روز نیاز دارد، نه یک داشبورد کلی.'
    ),
    solution: text(
      'Ham Sakhteman keeps building management simple, secure, and available in both Persian and English.',
      'هم‌ساختمان کار مدیریت ساختمان را ساده و امن نگه می‌دارد؛ به فارسی و انگلیسی.'
    ),
    keyFeatures: [
      text('Building management workflows', 'کارهای روزمره مدیریت ساختمان'),
      text('Persian and English experience', 'فارسی و انگلیسی'),
      text('A live product people can open', 'محصول زنده، قابل باز کردن')
    ],
    results: [],
    layout: 'feature'
  },
  {
    id: 'proj_sazan',
    slug: 'sazan',
    title: text('Sazan', 'سازان'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/8cc5320a-bf90-4db8-9f0a-e92d77876778.png'),
    shortDescription: text(
      'A bilingual agency site with portfolio, project requests, and a protected admin panel.',
      'سایت دوزبانه استودیو؛ نمونه‌کار، درخواست پروژه، و پنل مدیریت محافظت‌شده.'
    ),
    fullDescription: text(
      'SAZAN is a bilingual Persian and English digital product agency website. It includes the public marketing site, portfolio and case studies, a guided project-request flow, a contact page, and a small protected admin panel.',
      'سازان سایت دوزبانه یک استودیو محصول دیجیتال است: معرفی، نمونه‌کار، مسیر درخواست پروژه، صفحه تماس، و یک پنل مدیریت کوچک.'
    ),
    category: 'websites',
    services: ['websites', 'webApps', 'adminPanels'],
    technologies: ['Nuxt', 'Vue', 'TypeScript', 'UnoCSS', 'Nuxt UI', 'MongoDB'],
    coverVisual: { tone: 'accent', composition: 'editorial' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3002',
    year: '2026',
    featured: true,
    status: 'published',
    overview: text(
      'The public site and the internal tools that keep the studio’s work publishable.',
      'سایت عمومی، و ابزار داخلی که کار استودیو را قابل انتشار نگه می‌دارد.'
    ),
    challenge: text(
      'The studio needed one bilingual place for marketing, case studies, and incoming project requests.',
      'استودیو یک جای دوزبانه می‌خواست برای معرفی، نمونه‌کار، و درخواست‌های ورودی.'
    ),
    solution: text(
      'Sazan combines the marketing site, portfolio, request flow, and a protected admin panel in one Nuxt application.',
      'سازان سایت معرفی، نمونه‌کار، مسیر درخواست و پنل مدیریت را در یک اپ Nuxt جمع کرده است.'
    ),
    keyFeatures: [
      text('Persian and English marketing site', 'سایت معرفی فارسی و انگلیسی'),
      text('Portfolio and case-study pages', 'صفحه نمونه‌کار و شرح پروژه'),
      text('Guided project requests and admin review', 'درخواست پروژه و بررسی در پنل')
    ],
    results: [],
    layout: 'landscape'
  },
  {
    id: 'proj_work_quest',
    slug: 'work-quest',
    title: text('Work Quest', 'ورک‌کوئست'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/f5745e4e-a58d-46ee-8e1b-cd6d920ae79c.png'),
    shortDescription: text(
      'A Persian-first, multi-tenant SaaS for employee performance, with a gamification layer.',
      'نرم‌افزار عملکرد کارکنان؛ اول فارسی، با فضای جدا برای هر سازمان و یک لایه بازی.'
    ),
    fullDescription: text(
      'Work Quest is a Persian-first, multi-tenant employee performance management product. Teams track work and progress through a gamification layer instead of a plain score sheet.',
      'ورک‌کوئست برای مدیریت عملکرد کارکنان است. هر سازمان فضای خودش را دارد و رابطش اول فارسی است. تیم‌ها کار و پیشرفت را از یک لایه بازی دنبال می‌کنند، نه یک برگه امتیاز.'
    ),
    category: 'webApps',
    services: ['webApps', 'adminPanels'],
    technologies: [],
    coverVisual: { tone: 'warm', composition: 'dashboard' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3009',
    year: '2026',
    featured: true,
    status: 'published',
    overview: text(
      'Performance management built for Persian teams, with progress that feels like a quest.',
      'مدیریت عملکرد برای تیم‌های فارسی؛ پیشرفت حس مأموریت دارد، نه حس جدول.'
    ),
    challenge: text(
      'Performance tools are often English-first and reduce people to a spreadsheet.',
      'ابزارهای عملکرد اغلب اول انگلیسی‌اند و آدم را به یک جدول تقلیل می‌دهند.'
    ),
    solution: text(
      'Work Quest gives each organization its own space and wraps performance in a gamification layer.',
      'ورک‌کوئست به هر سازمان فضای جدا می‌دهد و عملکرد را داخل یک لایه بازی می‌گذارد.'
    ),
    keyFeatures: [
      text('Multi-tenant organizations', 'فضای جدا برای هر سازمان'),
      text('Persian-first interface', 'رابط با اولویت فارسی'),
      text('Gamified performance tracking', 'پیگیری عملکرد با لایه بازی')
    ],
    results: [],
    layout: 'standard'
  },
  {
    id: 'proj_sajad_portfolio',
    slug: 'sajad-portfolio',
    title: text('Sajad Portfolio', 'پورتفولیو سجاد'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/f0d5ca58-bd1f-4688-ba2d-b9f67c88f4f7.png'),
    shortDescription: text(
      'A bilingual editorial portfolio with a Swiss grid and neo-brutalist edges.',
      'نمونه‌کار شخصی دوزبانه؛ گرید سوئیسی و لبه‌های نئوبروتالیست.'
    ),
    fullDescription: text(
      'A bilingual English and Persian editorial portfolio built with Nuxt 4. The layout uses a Swiss grid and neo-brutalist edges.',
      'نمونه‌کار شخصی به انگلیسی و فارسی، با Nuxt 4. چیدمان روی گرید سوئیسی است و لبه‌ها نئوبروتالیست‌اند.'
    ),
    category: 'websites',
    services: ['websites'],
    technologies: ['Nuxt'],
    coverVisual: { tone: 'mono', composition: 'editorial' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3003/',
    year: '2026',
    featured: true,
    status: 'published',
    overview: text(
      'A personal portfolio that treats layout as part of the work.',
      'نمونه‌کاری شخصی که چیدمان را بخشی از خود کار حساب می‌کند.'
    ),
    challenge: text(
      'A personal site had to feel editorial in both English and Persian without losing a strict grid.',
      'سایت باید در هر دو زبان حال‌وهوای مجله داشته باشد و گرید سخت‌گیرانه‌اش را از دست ندهد.'
    ),
    solution: text(
      'The portfolio pairs a Swiss grid with neo-brutalist edges on a bilingual Nuxt site.',
      'گرید سوئیسی و لبه‌های نئوبروتالیست روی یک سایت دوزبانه Nuxt کنار هم نشسته‌اند.'
    ),
    keyFeatures: [
      text('English and Persian pages', 'صفحات انگلیسی و فارسی'),
      text('Swiss grid layout', 'گرید سوئیسی'),
      text('Neo-brutalist editorial edges', 'لبه‌های نئوبروتالیست')
    ],
    results: [],
    layout: 'portrait'
  },
  {
    id: 'proj_artivo',
    slug: 'artivo',
    title: text('Artivo', 'آرتیوو'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/2a7aa534-3964-4125-81ed-b4668de61fb7.png'),
    shortDescription: text(
      'A creativity marketplace that connects clients with graphic designers and photographers.',
      'مارکت‌پلیس برای وصل کردن کارفرما به طراح گرافیک و عکاس.'
    ),
    fullDescription: text(
      'Artivo is a creativity platform and marketplace. It connects clients with graphic designers and photographers.',
      'آرتیوو مارکت‌پلیسی است که کارفرما را به طراح گرافیک و عکاس وصل می‌کند.'
    ),
    category: 'webApps',
    services: ['webApps', 'websites'],
    technologies: ['Nuxt'],
    coverVisual: { tone: 'primary', composition: 'editorial' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3005',
    year: '2026',
    featured: true,
    status: 'published',
    overview: text(
      'A marketplace for commissioning graphic design and photography.',
      'جایی برای سفارش طراحی گرافیک و عکاسی.'
    ),
    challenge: text(
      'Clients and independent visual creators did not have a shared place to find each other.',
      'کارفرما و طراح یا عکاس مستقل جای مشترکی برای پیدا کردن هم نداشتند.'
    ),
    solution: text(
      'Artivo is the marketplace layer between clients, graphic designers, and photographers.',
      'آرتیوو لایه میانی است بین کارفرما، طراح گرافیک و عکاس.'
    ),
    keyFeatures: [
      text('Client and creator matching', 'پیدا شدن کارفرما و طراح'),
      text('Graphic design commissions', 'سفارش طراحی گرافیک'),
      text('Photography commissions', 'سفارش عکاسی')
    ],
    results: [],
    layout: 'landscape'
  },
  {
    id: 'proj_chapkhaneh',
    slug: 'chapkhaneh',
    title: text('Chapkhaneh', 'چاپخانه'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/6da54e1e-5355-4912-845e-88c38cabf946.png'),
    shortDescription: text(
      'A Persian-first website product for large professional printing companies.',
      'سایت برای چاپخانه‌های بزرگ؛ اول فارسی.'
    ),
    fullDescription: text(
      'Chapkhaneh is a production-oriented website product for large professional printing companies. It is Persian-first and RTL by default, with full English support. The current demo brand is Mobin Bartar.',
      'چاپخانه سایتی است برای کار واقعی چاپخانه‌های بزرگ. پیش‌فرضش فارسی و راست‌به‌چپ است و انگلیسی کامل هم دارد. برند دموی فعلی، مبین برتر است.'
    ),
    category: 'websites',
    services: ['websites', 'webApps'],
    technologies: ['Nuxt', 'Drizzle'],
    coverVisual: { tone: 'cool', composition: 'editorial' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3004',
    year: '2026',
    featured: true,
    status: 'published',
    overview: text(
      'A website system made for how a large print shop actually sells and presents work.',
      'سایتی که چاپخانه بزرگ با آن کارش را معرفی کند و بفروشد، نه یک قالب معرفی عمومی.'
    ),
    challenge: text(
      'Large print companies need a production-minded site, not a generic brochure template.',
      'چاپخانه بزرگ به سایتی نیاز دارد که منطق تولید را بفهمد، نه یک قالب معرفی آماده.'
    ),
    solution: text(
      'Chapkhaneh ships Persian-first and RTL, with English support and a demo brand for Mobin Bartar.',
      'چاپخانه اول فارسی و راست‌به‌چپ است، انگلیسی دارد، و دموی فعلی‌اش برند مبین برتر است.'
    ),
    keyFeatures: [
      text('Persian-first, RTL by default', 'اول فارسی، راست‌به‌چپ'),
      text('Full English support', 'انگلیسی کامل'),
      text('Built for professional print production', 'برای کار چاپ حرفه‌ای')
    ],
    results: [],
    layout: 'feature'
  },
  {
    id: 'proj_trado',
    slug: 'trado',
    title: text('Trado', 'ترادو'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/62285a70-bc66-493e-9169-2b03de6d3eb6.png'),
    shortDescription: text(
      'A personal spot-trading journal for recording crypto buys, sells, capital, and profit or loss.',
      'دفتر شخصی معاملات اسپات؛ ثبت خرید و فروش رمزارز، سرمایه، و سود یا زیان.'
    ),
    fullDescription: text(
      'Trado is a personal spot trading journal and portfolio tracker. It is not an exchange. You record cryptocurrency buys and sells yourself, group them into trades, and review capital and profit or loss in USD and Toman.',
      'ترادو دفتر شخصی معاملات اسپات است، نه صرافی. خرید و فروش رمزارز را خودتان ثبت می‌کنید، در قالب معامله دسته‌بندی می‌کنید، و سرمایه و سود یا زیان را به دلار و تومان می‌بینید.'
    ),
    category: 'webApps',
    services: ['webApps'],
    technologies: [],
    coverVisual: { tone: 'mono', composition: 'dashboard' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3010',
    year: '2026',
    featured: false,
    status: 'published',
    overview: text(
      'A private ledger for spot trades, counted in USD and Toman.',
      'دفتر خصوصی معاملات اسپات، به دلار و تومان.'
    ),
    challenge: text(
      'Traders needed a record of their own buys and sells without turning the tool into an exchange.',
      'معامله‌گر به ثبت خرید و فروش خودش نیاز داشت، بدون اینکه ابزار تبدیل به صرافی شود.'
    ),
    solution: text(
      'Trado groups manual entries into trades and shows capital and profit or loss in USD and Toman.',
      'ترادو ثبت‌های دستی را به معامله تبدیل می‌کند و سرمایه و سود یا زیان را به دلار و تومان نشان می‌دهد.'
    ),
    keyFeatures: [
      text('Manual buy and sell records', 'ثبت دستی خرید و فروش'),
      text('Trades grouped from entries', 'تبدیل ثبت‌ها به معامله'),
      text('USD and Toman profit and loss', 'سود و زیان به دلار و تومان')
    ],
    results: [],
    layout: 'standard'
  },
  {
    id: 'proj_tuneroom',
    slug: 'tuneroom',
    title: text('TuneRoom', 'تیون‌روم'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/ef520726-dd07-4e81-b5fe-ef1138c44a9c.png'),
    shortDescription: text(
      'A shared music room where a small group drops in tracks and each person controls their own playback.',
      'اتاق موسیقی برای یک گروه کوچک؛ هر کس آهنگ می‌گذارد و پخش خودش را دارد.'
    ),
    fullDescription: text(
      'TuneRoom is a shared music room for a small group. Create a room, share the link, and let everyone add their own tracks. Each person controls their own playback. There are no accounts, feeds, recommendations, or synchronized watch parties.',
      'تیون‌روم یک اتاق موسیقی مشترک برای جمع کوچک است. اتاق می‌سازید، لینک را می‌فرستید، و هر کس آهنگ خودش را می‌گذارد. پخش برای هر نفر جداست. حساب کاربری، فید، پیشنهاد، یا پخش هم‌زمان ندارد.'
    ),
    category: 'webApps',
    services: ['webApps'],
    technologies: [],
    coverVisual: { tone: 'warm', composition: 'system' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3008',
    year: '2026',
    featured: false,
    status: 'published',
    overview: text(
      'A room, a shared library, and a player that keeps going while you move around.',
      'یک اتاق، یک کتابخانه مشترک، و پخشی که با جابه‌جایی قطع نمی‌شود.'
    ),
    challenge: text(
      'Listening together usually means accounts, feeds, or forcing everyone onto the same playback.',
      'با هم گوش دادن معمولاً یعنی حساب کاربری، فید، یا اینکه همه به یک پخش قفل شوند.'
    ),
    solution: text(
      'TuneRoom is only a room and a library. People add tracks and keep their own playback.',
      'تیون‌روم فقط اتاق و کتابخانه است. آدم‌ها آهنگ می‌گذارند و پخش خودشان را نگه می‌دارند.'
    ),
    keyFeatures: [
      text('Shareable room link', 'لینک قابل اشتراک'),
      text('A library built by the group', 'کتابخانه‌ای که گروه می‌سازد'),
      text('Independent playback for each person', 'پخش جدا برای هر نفر')
    ],
    results: [],
    layout: 'landscape'
  },
  {
    id: 'proj_invoicer',
    slug: 'invoicer',
    title: text('Invoicer', 'اینوویسر'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/228f932b-3f65-483a-87ed-db042beeeeac.png'),
    shortDescription: text(
      'A Persian accounting app for small businesses: RTL, mobile-first, and deliberately polished.',
      'اپ حسابداری فارسی برای کسب‌وکار کوچک؛ راست‌به‌چپ، اول برای گوشی، با طراحی حساب‌شده.'
    ),
    fullDescription: text(
      'Invoicer, also called Dayan, is a Persian accounting application for small businesses. It is right-to-left, mobile-first, and designed to feel modern and premium.',
      'اینوویسر، که به آن دایان هم می‌گویند، اپ حسابداری فارسی برای کسب‌وکارهای کوچک است. راست‌به‌چپ است، اول برای گوشی طراحی شده، و ظاهرش عمداً دقیق درآمده.'
    ),
    category: 'mobileApps',
    services: ['mobileApps', 'webApps'],
    technologies: [],
    coverVisual: { tone: 'cool', composition: 'mobile' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3011',
    year: '2026',
    featured: false,
    status: 'published',
    overview: text(
      'Small-business accounting that starts on the phone and reads naturally in Persian.',
      'حسابداری کسب‌وکار کوچک که از گوشی شروع می‌شود و فارسی را طبیعی می‌خواند.'
    ),
    challenge: text(
      'Small businesses needed accounting that fits a phone and a right-to-left reading order.',
      'کسب‌وکار کوچک به حسابداری‌ای نیاز داشت که با گوشی جور باشد و راست‌به‌چپ خوانده شود.'
    ),
    solution: text(
      'Invoicer is a mobile-first Persian accounting app with a more considered visual design.',
      'اینوویسر اپ حسابداری فارسی است، اول برای گوشی، با طراحی بصری دقیق‌تر.'
    ),
    keyFeatures: [
      text('Persian, right-to-left accounting', 'حسابداری فارسی و راست‌به‌چپ'),
      text('Mobile-first screens', 'صفحه‌ها اول برای گوشی'),
      text('Made for small businesses', 'برای کسب‌وکار کوچک')
    ],
    results: [],
    layout: 'portrait'
  },
  {
    id: 'proj_waqtino',
    slug: 'waqtino',
    title: text('Waqtino', 'وقتینو'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/a380eeb9-3a91-4a87-bf04-4cc80ca50431.png'),
    shortDescription: text(
      'A mobile-first Persian appointment booking app, prepared to ship as Android with Capacitor.',
      'اپ رزرو نوبت؛ اول فارسی و اول برای گوشی، آماده تبدیل به اندروید با Capacitor.'
    ),
    fullDescription: text(
      'Waqtino is the frontend for a Persian, mobile-first appointment booking app. It uses Nuxt 4, TypeScript, and Nuxt UI, and is intended to become an Android app with Capacitor. The AdonisJS backend stays separate and connects later through a service layer.',
      'وقتینو فرانت رزرو نوبت است: اول برای گوشی، اول فارسی، راست‌به‌چپ، با Nuxt 4 و TypeScript و Nuxt UI. قرار است با Capacitor به اپ اندروید تبدیل شود. بک‌اند AdonisJS جدا می‌ماند و بعداً از لایه سرویس وصل می‌شود.'
    ),
    category: 'mobileApps',
    services: ['mobileApps', 'webApps'],
    technologies: ['Nuxt', 'TypeScript', 'Nuxt UI', 'Capacitor'],
    coverVisual: { tone: 'accent', composition: 'mobile' },
    gallery: [],
    year: '2026',
    featured: false,
    status: 'published',
    overview: text(
      'Appointment booking that is built as a phone interface first.',
      'رزرو نوبت که از اول به‌شکل رابط گوشی ساخته شده.'
    ),
    challenge: text(
      'Booking had to feel like a Persian mobile app, while the backend remained a separate service.',
      'رزرو باید حس اپ موبایل فارسی را بدهد و بک‌اندش جدا بماند.'
    ),
    solution: text(
      'Waqtino is a Nuxt frontend aimed at Capacitor on Android, with a later connection to AdonisJS.',
      'وقتینو فرانت Nuxt است، برای Capacitor روی اندروید، و بعداً به AdonisJS وصل می‌شود.'
    ),
    keyFeatures: [
      text('Persian, RTL, mobile-first booking', 'رزرو فارسی، راست‌به‌چپ، اول برای گوشی'),
      text('Nuxt 4 and Nuxt UI interface', 'رابط Nuxt 4 و Nuxt UI'),
      text('Path to an Android app via Capacitor', 'مسیر اپ اندروید با Capacitor')
    ],
    results: [],
    layout: 'portrait'
  },
  {
    id: 'proj_motomeet',
    slug: 'motomeet',
    title: text('MotoMeet', 'موتومیت'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/2305f788-b928-43bf-b92b-65bfff4bb4a2.png'),
    shortDescription: text(
      'A Persian social platform for motorcycle riders: rides, clubs, and community.',
      'شبکه اجتماعی فارسی برای موتورسوارها: تور، کلاب و انجمن.'
    ),
    fullDescription: text(
      'MotoMeet is a Persian, right-to-left social platform for motorcycle riders. It is built around rides, clubs, and community.',
      'موتومیت شبکه اجتماعی فارسی و راست‌به‌چپ برای موتورسوارهاست. محور کارش تور، کلاب و انجمن است.'
    ),
    category: 'webApps',
    services: ['webApps', 'mobileApps'],
    technologies: [],
    coverVisual: { tone: 'primary', composition: 'mobile' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3006',
    year: '2026',
    featured: false,
    status: 'published',
    overview: text(
      'A rider community organized around going out together.',
      'انجمن موتورسوارها، حول با هم بیرون رفتن.'
    ),
    challenge: text(
      'Riders needed a Persian place for rides and clubs, not a general social feed.',
      'موتورسوارها جای فارسی برای تور و کلاب می‌خواستند، نه یک فید اجتماعی عمومی.'
    ),
    solution: text(
      'MotoMeet centers the product on rides, clubs, and the rider community.',
      'موتومیت روی تور، کلاب و جمع موتورسوارها متمرکز است.'
    ),
    keyFeatures: [
      text('Ride planning', 'برنامه‌ریزی تور'),
      text('Rider clubs', 'کلاب موتورسواری'),
      text('Persian, right-to-left community', 'انجمن فارسی و راست‌به‌چپ')
    ],
    results: [],
    layout: 'standard'
  },
  {
    id: 'proj_motofix',
    slug: 'motofix',
    title: text('MotoFix', 'موتوفیکس'),
    media: shot('http://188.121.107.118:9000/projects-hub/covers/c9cffca9-cecc-4932-bbd2-4464b4936468.png'),
    shortDescription: text(
      'A way to find nearby motorcycle services: repair, electrical, tires, oil, parts, and roadside help.',
      'پیدا کردن خدمات موتور نزدیک: تعمیر، برق، لاستیک، روغن، قطعه و امداد.'
    ),
    fullDescription: text(
      'MotoFix helps riders find motorcycle services nearby: workshops, motorcycle electrical work, tires and puncture repair, oil changes, spare parts, helmets, tuning, and roadside assistance.',
      'موتوفیکس کمک می‌کند خدمات موتورسیکلت نزدیک را پیدا کنید: تعمیرگاه، برق موتور، لاستیک و پنچرگیری، تعویض روغن، قطعه یدکی، کلاه کاسکت، تیونینگ و امداد.'
    ),
    category: 'webApps',
    services: ['webApps', 'mobileApps'],
    technologies: [],
    coverVisual: { tone: 'accent', composition: 'system' },
    gallery: [],
    projectUrl: 'http://188.121.107.118:3007',
    year: '2026',
    featured: false,
    status: 'published',
    overview: text(
      'Nearby motorcycle help, listed as the services riders actually search for.',
      'خدمات نزدیک موتور، با همان اسم‌هایی که موتورسوار واقعاً جستجو می‌کند.'
    ),
    challenge: text(
      'Service search is useless if it does not speak the jobs a rider needs that day.',
      'جستجوی خدمات به درد نمی‌خورد اگر کار همان روز موتورسوار را نشناسد.'
    ),
    solution: text(
      'MotoFix organizes nearby results around repair, electrical work, tires, oil, parts, gear, tuning, and assistance.',
      'موتوفیکس نتیجه نزدیک را حول تعمیر، برق، لاستیک، روغن، قطعه، تجهیزات، تیونینگ و امداد می‌چیند.'
    ),
    keyFeatures: [
      text('Nearby motorcycle workshops', 'تعمیرگاه موتور در نزدیکی'),
      text('Tires, oil, parts, and gear', 'لاستیک، روغن، قطعه و تجهیزات'),
      text('Tuning and roadside assistance', 'تیونینگ و امداد جاده‌ای')
    ],
    results: [],
    layout: 'landscape'
  }
] satisfies readonly PortfolioProject[];

export const getPortfolioProjectBySlug = (slug: string) => {
  return portfolioProjects.find((project) => project.slug === slug);
};

export const getRelatedPortfolioProjects = (project: PortfolioProject, limit = 3) => {
  const scoredProjects = portfolioProjects
    .filter((candidate) => candidate.slug !== project.slug && candidate.status === 'published')
    .map((candidate) => {
      const serviceOverlap = candidate.services.filter((service) => project.services.includes(service)).length;
      const score = (candidate.category === project.category ? 10 : 0) + serviceOverlap + (candidate.featured ? 1 : 0);

      return { project: candidate, score };
    })
    .sort((a, b) => b.score - a.score);

  return scoredProjects.slice(0, limit).map(({ project: relatedProject }) => relatedProject);
};
