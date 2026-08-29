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

export interface PortfolioProject {
  id: string;
  slug: string;
  title: LocalizedString;
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

export const portfolioProjects = [
  {
    id: 'proj_atlas_commerce',
    slug: 'atlas-commerce-studio',
    title: {
      en: 'Atlas Commerce Studio',
      fa: 'استودیو تجارت اطلس'
    },
    shortDescription: {
      en: 'A premium storefront and checkout system for a multi-category lifestyle retailer.',
      fa: 'یک فروشگاه و سیستم پرداخت ممتاز برای خرده‌فروشی سبک زندگی با چند دسته محصول.'
    },
    fullDescription: {
      en: 'Atlas needed a commerce experience that felt editorial without slowing down product discovery. SAZAN shaped a storefront system, campaign pages, checkout logic, and analytics-friendly components for a growing retail team.',
      fa: 'اطلس به تجربه فروشگاهی نیاز داشت که حس ادیتوریال داشته باشد اما کشف محصول را کند نکند. سازان سیستم فروشگاه، صفحات کمپین، منطق پرداخت و کامپوننت‌های آماده تحلیل را برای یک تیم در حال رشد شکل داد.'
    },
    category: 'ecommerce',
    services: ['ecommerce', 'websites', 'backendSystems'],
    technologies: ['Nuxt', 'Vue', 'TypeScript', 'MongoDB', 'Stripe'],
    coverVisual: { tone: 'primary', composition: 'commerce' },
    gallery: [
      {
        id: 'atlas-storefront',
        title: { en: 'Editorial storefront', fa: 'ویترین ادیتوریال' },
        caption: { en: 'Large campaign areas connect brand stories to shoppable product modules.', fa: 'فضاهای بزرگ کمپین، روایت برند را به ماژول‌های خریدنی محصول وصل می‌کنند.' },
        orientation: 'wide',
        visual: { tone: 'primary', composition: 'editorial' }
      },
      {
        id: 'atlas-checkout',
        title: { en: 'Checkout flow', fa: 'مسیر پرداخت' },
        caption: { en: 'A clean sequence reduces decisions at the most important moment.', fa: 'یک مسیر تمیز، تصمیم‌های اضافه را در مهم‌ترین لحظه کم می‌کند.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'commerce' }
      },
      {
        id: 'atlas-mobile',
        title: { en: 'Mobile catalog', fa: 'کاتالوگ موبایل' },
        caption: { en: 'Product discovery remains fast and tactile on smaller screens.', fa: 'کشف محصول روی صفحه‌های کوچک سریع و ملموس باقی می‌ماند.' },
        orientation: 'portrait',
        visual: { tone: 'warm', composition: 'mobile' }
      }
    ],
    video: {
      title: { en: 'Commerce interaction preview', fa: 'پیش‌نمایش تعامل فروشگاه' },
      description: { en: 'A placeholder motion area prepared for future product walkthroughs.', fa: 'یک فضای موشن موقت که برای walkthroughهای محصول در آینده آماده شده است.' },
      label: { en: 'Prototype reel', fa: 'ریل نمونه اولیه' }
    },
    demoUrl: 'https://example.com/atlas-demo',
    projectUrl: 'https://example.com/atlas',
    pricing: {
      visibility: 'public',
      currency: 'USD',
      min: 45000,
      max: 72000,
      note: { en: 'Public range: $45k–$72k', fa: 'بازه عمومی: ۴۵ تا ۷۲ هزار دلار' }
    },
    timeline: {
      durationWeeks: 12,
      note: { en: '12-week strategy, design, and build', fa: '۱۲ هفته استراتژی، طراحی و توسعه' }
    },
    year: '2026',
    featured: true,
    status: 'published',
    overview: {
      en: 'We built a modular commerce platform that combines brand storytelling with reliable conversion mechanics.',
      fa: 'یک پلتفرم فروشگاهی ماژولار ساختیم که روایت برند را با سازوکارهای قابل اتکای تبدیل ترکیب می‌کند.'
    },
    challenge: {
      en: 'The existing store treated every product category the same and made campaign launches dependent on engineering support.',
      fa: 'فروشگاه قبلی با همه دسته‌های محصول یکسان برخورد می‌کرد و انتشار کمپین‌ها را به پشتیبانی فنی وابسته کرده بود.'
    },
    solution: {
      en: 'SAZAN created reusable commerce sections, a cleaner checkout model, and a data structure that lets the team launch seasonal stories quickly.',
      fa: 'سازان سکشن‌های قابل استفاده مجدد، مدل پرداخت تمیزتر و ساختار داده‌ای ساخت که تیم بتواند داستان‌های فصلی را سریع منتشر کند.'
    },
    keyFeatures: [
      { en: 'Composable campaign and product landing pages', fa: 'صفحات کمپین و محصول قابل ترکیب' },
      { en: 'Checkout steps with fewer cognitive interruptions', fa: 'مراحل پرداخت با وقفه ذهنی کمتر' },
      { en: 'Analytics events mapped to product discovery behavior', fa: 'رویدادهای تحلیلی متصل به رفتار کشف محصول' }
    ],
    results: [
      { value: { en: '+18%', fa: '+۱۸٪' }, label: { en: 'checkout conversion', fa: 'رشد تبدیل پرداخت' } },
      { value: { en: '2.1s', fa: '۲.۱ ثانیه' }, label: { en: 'median page load', fa: 'میانه بارگذاری صفحه' } },
      { value: { en: '4x', fa: '۴ برابر' }, label: { en: 'faster campaign publishing', fa: 'انتشار سریع‌تر کمپین' } }
    ],
    layout: 'feature'
  },
  {
    id: 'proj_nova_health',
    slug: 'nova-health-portal',
    title: {
      en: 'Nova Health Portal',
      fa: 'پورتال سلامت نوا'
    },
    shortDescription: {
      en: 'A secure appointment, patient dashboard, and messaging portal for a private clinic network.',
      fa: 'پورتال امن نوبت‌دهی، داشبورد بیمار و پیام‌رسانی برای شبکه‌ای از کلینیک‌های خصوصی.'
    },
    fullDescription: {
      en: 'Nova wanted a calmer digital product for patients and a more practical workspace for coordinators. The portal balances privacy, scheduling speed, and a clear view of each patient journey.',
      fa: 'نوا محصول دیجیتال آرام‌تری برای بیماران و فضای کاری کاربردی‌تری برای هماهنگ‌کنندگان می‌خواست. این پورتال حریم خصوصی، سرعت زمان‌بندی و دید روشن از مسیر هر بیمار را متعادل می‌کند.'
    },
    category: 'webApps',
    services: ['webApps', 'adminPanels', 'backendSystems'],
    technologies: ['Vue', 'TypeScript', 'Node.js', 'MongoDB', 'WebSockets'],
    coverVisual: { tone: 'accent', composition: 'dashboard' },
    gallery: [
      {
        id: 'nova-dashboard',
        title: { en: 'Patient dashboard', fa: 'داشبورد بیمار' },
        caption: { en: 'Appointments, messages, and care notes are grouped in a single calm view.', fa: 'نوبت‌ها، پیام‌ها و یادداشت‌های مراقبتی در یک نمای آرام کنار هم قرار گرفته‌اند.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'dashboard' }
      },
      {
        id: 'nova-booking',
        title: { en: 'Booking flow', fa: 'جریان رزرو' },
        caption: { en: 'The booking sequence emphasizes clarity and fewer abandoned requests.', fa: 'مسیر رزرو روی شفافیت و کاهش درخواست‌های نیمه‌کاره تمرکز دارد.' },
        orientation: 'portrait',
        visual: { tone: 'cool', composition: 'mobile' }
      },
      {
        id: 'nova-ops',
        title: { en: 'Coordinator view', fa: 'نمای هماهنگ‌کننده' },
        caption: { en: 'Internal staff can triage requests without jumping between disconnected tools.', fa: 'تیم داخلی بدون جابه‌جایی بین ابزارهای جدا، درخواست‌ها را اولویت‌بندی می‌کند.' },
        orientation: 'wide',
        visual: { tone: 'mono', composition: 'system' }
      }
    ],
    demoUrl: 'https://example.com/nova-demo',
    pricing: {
      visibility: 'on-request',
      note: { en: 'Pricing shared after compliance scope', fa: 'قیمت پس از مشخص شدن دامنه الزامات محرمانه اعلام می‌شود' }
    },
    timeline: {
      durationWeeks: 14,
      note: { en: '14 weeks including privacy and workflow validation', fa: '۱۴ هفته همراه با بررسی حریم خصوصی و اعتبارسنجی فرآیند' }
    },
    year: '2025',
    featured: true,
    status: 'published',
    overview: {
      en: 'A healthcare portal designed to make patient actions obvious and internal coordination less fragmented.',
      fa: 'پورتالی در حوزه سلامت که اقدام‌های بیمار را واضح و هماهنگی داخلی را کمتر پراکنده می‌کند.'
    },
    challenge: {
      en: 'Patients were calling for status updates because the old digital experience hid the next step.',
      fa: 'بیماران برای پیگیری وضعیت تماس می‌گرفتند چون تجربه دیجیتال قبلی قدم بعدی را پنهان می‌کرد.'
    },
    solution: {
      en: 'We mapped the care journey into states, then designed patient and coordinator interfaces around those states.',
      fa: 'مسیر مراقبت را به وضعیت‌های مشخص تبدیل کردیم و سپس رابط بیمار و هماهنگ‌کننده را حول همان وضعیت‌ها طراحی کردیم.'
    },
    keyFeatures: [
      { en: 'Role-aware portal for patients and staff', fa: 'پورتال نقش‌محور برای بیمار و تیم داخلی' },
      { en: 'Secure message threads attached to appointments', fa: 'گفت‌وگوهای امن متصل به نوبت‌ها' },
      { en: 'Operational queues for intake and follow-up', fa: 'صف‌های عملیاتی برای پذیرش و پیگیری' }
    ],
    results: [
      { value: { en: '-32%', fa: '-۳۲٪' }, label: { en: 'status update calls', fa: 'کاهش تماس‌های پیگیری' } },
      { value: { en: '7 min', fa: '۷ دقیقه' }, label: { en: 'average booking time saved', fa: 'صرفه‌جویی میانگین در رزرو' } },
      { value: { en: '99.9%', fa: '۹۹.۹٪' }, label: { en: 'tracked service uptime', fa: 'پایداری سرویس پایش‌شده' } }
    ],
    layout: 'portrait'
  },
  {
    id: 'proj_pulse_mobile',
    slug: 'pulse-finance-mobile',
    title: {
      en: 'Pulse Finance Mobile',
      fa: 'موبایل مالی پالس'
    },
    shortDescription: {
      en: 'A mobile money companion for budget planning, recurring payments, and practical daily insight.',
      fa: 'همراه مالی موبایل برای برنامه‌ریزی بودجه، پرداخت‌های تکرارشونده و بینش روزمره کاربردی.'
    },
    fullDescription: {
      en: 'Pulse turns personal finance into a quieter routine. We designed a mobile product concept with compact dashboards, spending signals, and guidance that does not feel alarmist.',
      fa: 'پالس مدیریت مالی شخصی را به عادتی آرام‌تر تبدیل می‌کند. یک کانسپت محصول موبایل با داشبوردهای فشرده، سیگنال‌های خرج‌کرد و راهنمایی بدون اضطراب طراحی کردیم.'
    },
    category: 'mobileApps',
    services: ['mobileApps', 'webApps', 'backendSystems'],
    technologies: ['Flutter', 'Dart', 'Node.js', 'MongoDB', 'Realtime API'],
    coverVisual: { tone: 'mono', composition: 'mobile' },
    gallery: [
      {
        id: 'pulse-overview',
        title: { en: 'Daily pulse', fa: 'نبض روزانه' },
        caption: { en: 'A compact first screen balances confidence and restraint.', fa: 'صفحه اول فشرده، حس کنترل و سادگی را متعادل می‌کند.' },
        orientation: 'portrait',
        visual: { tone: 'mono', composition: 'mobile' }
      },
      {
        id: 'pulse-budgets',
        title: { en: 'Budget planning', fa: 'برنامه‌ریزی بودجه' },
        caption: { en: 'Budgets are framed as helpful boundaries instead of red warnings.', fa: 'بودجه‌ها به‌جای هشدارهای قرمز، مثل مرزهای کمک‌کننده نمایش داده می‌شوند.' },
        orientation: 'portrait',
        visual: { tone: 'primary', composition: 'mobile' }
      },
      {
        id: 'pulse-insights',
        title: { en: 'Insight system', fa: 'سیستم بینش' },
        caption: { en: 'Signals are grouped by actionability, not by technical category.', fa: 'سیگنال‌ها براساس قابلیت اقدام دسته‌بندی می‌شوند، نه دسته فنی.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'dashboard' }
      }
    ],
    video: {
      title: { en: 'Mobile prototype walkthrough', fa: 'نمایش نمونه اولیه موبایل' },
      description: { en: 'Prepared as a lightweight embed placeholder for future prototype captures.', fa: 'به‌عنوان جایگاه سبک برای ویدئوهای نمونه اولیه آینده آماده شده است.' },
      label: { en: 'Mobile motion study', fa: 'مطالعه حرکت موبایل' }
    },
    demoUrl: 'https://example.com/pulse-prototype',
    timeline: {
      durationWeeks: 8,
      note: { en: '8-week product design sprint and prototype', fa: '۸ هفته اسپرینت طراحی محصول و نمونه اولیه' }
    },
    year: '2025',
    featured: true,
    status: 'published',
    overview: {
      en: 'A finance app concept focused on habit formation and clear daily decision-making.',
      fa: 'کانسپت اپلیکیشن مالی با تمرکز بر شکل‌گیری عادت و تصمیم‌گیری روزانه روشن.'
    },
    challenge: {
      en: 'Most finance interfaces over-explain the numbers and under-design the behavior change.',
      fa: 'بیشتر رابط‌های مالی اعداد را بیش از حد توضیح می‌دهند و تغییر رفتار را کم‌طراحی می‌کنند.'
    },
    solution: {
      en: 'We built the experience around rhythms: what users need today, this week, and before the next payment cycle.',
      fa: 'تجربه را حول ریتم‌ها ساختیم: آنچه کاربر امروز، این هفته و پیش از چرخه پرداخت بعدی نیاز دارد.'
    },
    keyFeatures: [
      { en: 'Daily spending pulse and confidence score', fa: 'نبض خرج روزانه و امتیاز اطمینان' },
      { en: 'Recurring payment timeline', fa: 'خط زمانی پرداخت‌های تکرارشونده' },
      { en: 'Behavior-first notifications', fa: 'اعلان‌های مبتنی بر رفتار' }
    ],
    results: [
      { value: { en: '41', fa: '۴۱' }, label: { en: 'prototype screens', fa: 'صفحه نمونه اولیه' } },
      { value: { en: '6', fa: '۶' }, label: { en: 'tested onboarding paths', fa: 'مسیر ورود اولیه تست‌شده' } },
      { value: { en: '92%', fa: '۹۲٪' }, label: { en: 'task clarity in testing', fa: 'شفافیت وظیفه در تست' } }
    ],
    layout: 'standard'
  },
  {
    id: 'proj_bazaar_editorial',
    slug: 'bazaar-editorial-shop',
    title: {
      en: 'Bazaar Editorial Shop',
      fa: 'فروشگاه ادیتوریال بازار'
    },
    shortDescription: {
      en: 'A content-led shopping experience where discovery, story, and conversion share the same rhythm.',
      fa: 'تجربه خرید مبتنی بر محتوا که کشف، روایت و تبدیل با یک ریتم مشترک حرکت می‌کنند.'
    },
    fullDescription: {
      en: 'Bazaar needed to sell without losing the texture of an editorial brand. SAZAN created a magazine-like commerce experience with flexible publishing, curated product modules, and measurable journeys.',
      fa: 'بازار می‌خواست بفروشد بدون اینکه بافت یک برند ادیتوریال را از دست بدهد. سازان تجربه‌ای شبیه مجله برای تجارت ساخت؛ با انتشار منعطف، ماژول‌های محصول منتخب و مسیرهای قابل اندازه‌گیری.'
    },
    category: 'websites',
    services: ['websites', 'ecommerce'],
    technologies: ['Nuxt', 'CMS', 'TypeScript', 'Analytics'],
    coverVisual: { tone: 'primary', composition: 'editorial' },
    gallery: [
      {
        id: 'bazaar-story',
        title: { en: 'Story modules', fa: 'ماژول‌های روایت' },
        caption: { en: 'Articles can carry product moments without feeling like banners.', fa: 'مقاله‌ها می‌توانند لحظه‌های محصول را بدون حس بنر تبلیغاتی حمل کنند.' },
        orientation: 'wide',
        visual: { tone: 'primary', composition: 'editorial' }
      },
      {
        id: 'bazaar-product',
        title: { en: 'Product rhythm', fa: 'ریتم محصول' },
        caption: { en: 'Curated blocks give shoppers a direct next step inside long-form content.', fa: 'بلوک‌های منتخب در محتوای طولانی، قدم بعدی مستقیم به خریدار می‌دهند.' },
        orientation: 'landscape',
        visual: { tone: 'warm', composition: 'commerce' }
      },
      {
        id: 'bazaar-mobile',
        title: { en: 'Reading on mobile', fa: 'خواندن در موبایل' },
        caption: { en: 'The mobile layout protects editorial pace and purchase clarity.', fa: 'چیدمان موبایل هم ریتم ادیتوریال را حفظ می‌کند و هم شفافیت خرید را.' },
        orientation: 'portrait',
        visual: { tone: 'accent', composition: 'mobile' }
      }
    ],
    projectUrl: 'https://example.com/bazaar',
    pricing: {
      visibility: 'public',
      currency: 'EUR',
      min: 28000,
      max: 44000,
      note: { en: 'Public range: €28k–€44k', fa: 'بازه عمومی: ۲۸ تا ۴۴ هزار یورو' }
    },
    timeline: {
      durationWeeks: 9,
      note: { en: '9-week brand website and commerce layer', fa: '۹ هفته وب‌سایت برند و لایه فروشگاهی' }
    },
    year: '2024',
    featured: true,
    status: 'published',
    overview: {
      en: 'A publication-grade storefront that gives editorial teams control and gives shoppers a clearer route to purchase.',
      fa: 'فروشگاهی در سطح انتشار حرفه‌ای که به تیم محتوا کنترل می‌دهد و مسیر خرید را برای مخاطب روشن‌تر می‌کند.'
    },
    challenge: {
      en: 'Editorial and commerce were split across separate templates, making the brand feel inconsistent.',
      fa: 'محتوا و فروشگاه در قالب‌های جدا بودند و برند حس یکپارچگی نداشت.'
    },
    solution: {
      en: 'We designed a shared content-commerce system where products appear as part of the narrative instead of interrupting it.',
      fa: 'یک سیستم مشترک محتوا-تجارت طراحی کردیم که محصول به‌عنوان بخشی از روایت ظاهر می‌شود، نه وقفه‌ای در آن.'
    },
    keyFeatures: [
      { en: 'Modular editorial templates', fa: 'قالب‌های ادیتوریال ماژولار' },
      { en: 'Curated product drop system', fa: 'سیستم معرفی محصول منتخب' },
      { en: 'Analytics-ready content journeys', fa: 'مسیرهای محتوایی آماده تحلیل' }
    ],
    results: [
      { value: { en: '+24%', fa: '+۲۴٪' }, label: { en: 'product discovery clicks', fa: 'کلیک‌های کشف محصول' } },
      { value: { en: '3x', fa: '۳ برابر' }, label: { en: 'faster story publishing', fa: 'انتشار سریع‌تر روایت' } },
      { value: { en: '0.9s', fa: '۰.۹ ثانیه' }, label: { en: 'interaction readiness', fa: 'آمادگی تعامل' } }
    ],
    layout: 'landscape'
  },
  {
    id: 'proj_panelix_ops',
    slug: 'panelix-operations-os',
    title: {
      en: 'Panelix Operations OS',
      fa: 'سیستم عملیات پنلیکس'
    },
    shortDescription: {
      en: 'A custom admin environment for teams managing orders, roles, reporting, and operational exceptions.',
      fa: 'محیط مدیریتی سفارشی برای تیم‌هایی که سفارش‌ها، نقش‌ها، گزارش‌ها و استثناهای عملیاتی را مدیریت می‌کنند.'
    },
    fullDescription: {
      en: 'Panelix replaces disconnected spreadsheets and fragile dashboards with a role-aware operating layer for internal teams.',
      fa: 'پنلیکس صفحه‌گسترده‌های پراکنده و داشبوردهای شکننده را با یک لایه عملیاتی نقش‌محور برای تیم داخلی جایگزین می‌کند.'
    },
    category: 'adminPanels',
    services: ['adminPanels', 'backendSystems', 'webApps'],
    technologies: ['Vue', 'TypeScript', 'Node.js', 'MongoDB', 'RBAC'],
    coverVisual: { tone: 'accent', composition: 'dashboard' },
    gallery: [
      {
        id: 'panelix-queue',
        title: { en: 'Operational queue', fa: 'صف عملیاتی' },
        caption: { en: 'Critical work is sorted by urgency, ownership, and next action.', fa: 'کارهای مهم براساس فوریت، مالکیت و اقدام بعدی مرتب می‌شوند.' },
        orientation: 'wide',
        visual: { tone: 'accent', composition: 'dashboard' }
      },
      {
        id: 'panelix-permissions',
        title: { en: 'Permission model', fa: 'مدل دسترسی' },
        caption: { en: 'Role boundaries are visible and easier to maintain.', fa: 'مرزهای نقش‌ها قابل مشاهده و نگهداری آن‌ها ساده‌تر است.' },
        orientation: 'landscape',
        visual: { tone: 'mono', composition: 'system' }
      },
      {
        id: 'panelix-reporting',
        title: { en: 'Reporting surface', fa: 'سطح گزارش‌گیری' },
        caption: { en: 'Managers can move from summary to exception without losing context.', fa: 'مدیران بدون از دست دادن زمینه، از خلاصه به استثناها می‌رسند.' },
        orientation: 'landscape',
        visual: { tone: 'primary', composition: 'dashboard' }
      }
    ],
    demoUrl: 'https://example.com/panelix-demo',
    pricing: {
      visibility: 'private',
      note: { en: 'Private enterprise engagement', fa: 'قرارداد سازمانی محرمانه' }
    },
    timeline: {
      durationWeeks: 16,
      note: { en: '16 weeks across discovery, build, and rollout', fa: '۱۶ هفته از کشف تا ساخت و انتشار عملیاتی' }
    },
    year: '2024',
    featured: true,
    status: 'published',
    overview: {
      en: 'An internal product that makes daily operations easier to trust, audit, and improve.',
      fa: 'محصول داخلی که اعتماد، پایش و بهبود عملیات روزانه را ساده‌تر می‌کند.'
    },
    challenge: {
      en: 'Teams were using multiple tools to understand the same order state, creating delays and ownership confusion.',
      fa: 'تیم‌ها برای فهم وضعیت یک سفارش از چند ابزار استفاده می‌کردند و این موضوع تأخیر و ابهام مالکیت ایجاد می‌کرد.'
    },
    solution: {
      en: 'We designed a unified operations model with role-aware views, clear queues, and reporting that connects to real workflows.',
      fa: 'یک مدل عملیاتی یکپارچه با نماهای نقش‌محور، صف‌های روشن و گزارش‌گیری متصل به فرآیند واقعی طراحی کردیم.'
    },
    keyFeatures: [
      { en: 'Role-based access and approvals', fa: 'دسترسی و تأیید نقش‌محور' },
      { en: 'Exception queues for operational risk', fa: 'صف استثناها برای ریسک عملیاتی' },
      { en: 'Performance dashboards grounded in workflow data', fa: 'داشبوردهای عملکرد مبتنی بر داده فرآیند' }
    ],
    results: [
      { value: { en: '-46%', fa: '-۴۶٪' }, label: { en: 'manual reconciliation', fa: 'کاهش تطبیق دستی' } },
      { value: { en: '18', fa: '۱۸' }, label: { en: 'role rules simplified', fa: 'قانون نقش ساده‌سازی‌شده' } },
      { value: { en: '5 teams', fa: '۵ تیم' }, label: { en: 'operating from one system', fa: 'فعال در یک سیستم' } }
    ],
    layout: 'feature'
  },
  {
    id: 'proj_orion_console',
    slug: 'orion-cloud-console',
    title: {
      en: 'Orion Cloud Console',
      fa: 'کنسول ابری اوریون'
    },
    shortDescription: {
      en: 'A technical control surface for provisioning services, monitoring usage, and handling billing events.',
      fa: 'سطح کنترل فنی برای ساخت سرویس‌ها، پایش مصرف و مدیریت رویدادهای مالی.'
    },
    fullDescription: {
      en: 'Orion needed an interface for complex cloud operations without overwhelming small engineering teams. The result is an admin-like console with guided provisioning and careful technical hierarchy.',
      fa: 'اوریون برای عملیات پیچیده ابری به رابطی نیاز داشت که تیم‌های مهندسی کوچک را خسته نکند. نتیجه، کنسولی شبیه ادمین با راه‌اندازی سرویس هدایت‌شده و سلسله‌مراتب فنی دقیق است.'
    },
    category: 'backendSystems',
    services: ['backendSystems', 'adminPanels', 'webApps'],
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma'],
    coverVisual: { tone: 'cool', composition: 'backend' },
    gallery: [
      {
        id: 'orion-services',
        title: { en: 'Service topology', fa: 'توپولوژی سرویس' },
        caption: { en: 'Teams can see dependencies before shipping risky changes.', fa: 'تیم‌ها پیش از انتشار تغییرات حساس، وابستگی‌ها را می‌بینند.' },
        orientation: 'wide',
        visual: { tone: 'cool', composition: 'backend' }
      },
      {
        id: 'orion-usage',
        title: { en: 'Usage intelligence', fa: 'هوشمندی مصرف' },
        caption: { en: 'Usage, spend, and alerts share one focused interface.', fa: 'مصرف، هزینه و هشدارها در یک رابط متمرکز کنار هم هستند.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'dashboard' }
      }
    ],
    demoUrl: 'https://example.com/orion-console',
    timeline: {
      durationWeeks: 11,
      note: { en: '11-week design system and console build', fa: '۱۱ هفته طراحی سیستم و ساخت کنسول' }
    },
    year: '2026',
    featured: false,
    status: 'published',
    overview: {
      en: 'A console for technical teams that makes infrastructure decisions more legible.',
      fa: 'کنسولی برای تیم‌های فنی که تصمیم‌های زیرساختی را خواناتر می‌کند.'
    },
    challenge: {
      en: 'The product had powerful backend capabilities but the interface made every action feel high-risk.',
      fa: 'محصول قابلیت‌های بک‌اند قدرتمندی داشت اما رابط، هر اقدام را پرریسک نشان می‌داد.'
    },
    solution: {
      en: 'We separated setup, monitoring, and billing into distinct workflows with shared technical primitives.',
      fa: 'راه‌اندازی، پایش و مالی را به فرآیندهای جدا با الگوهای فنی مشترک تقسیم کردیم.'
    },
    keyFeatures: [
      { en: 'Provisioning flows with dependency checks', fa: 'فرآیندهای راه‌اندازی سرویس با بررسی وابستگی' },
      { en: 'Usage and billing event timeline', fa: 'خط زمانی مصرف و رویدادهای مالی' },
      { en: 'Service health overview for engineering teams', fa: 'نمای سلامت سرویس برای تیم مهندسی' }
    ],
    results: [
      { value: { en: '-28%', fa: '-۲۸٪' }, label: { en: 'support tickets during setup', fa: 'کاهش تیکت‌های راه‌اندازی' } },
      { value: { en: '12', fa: '۱۲' }, label: { en: 'service states mapped', fa: 'وضعیت سرویس مدل‌شده' } }
    ],
    layout: 'landscape'
  },
  {
    id: 'proj_lumin_architecture',
    slug: 'lumin-architecture-website',
    title: {
      en: 'Lumin Architecture Website',
      fa: 'وب‌سایت معماری لومین'
    },
    shortDescription: {
      en: 'A quiet, image-forward website for an architecture practice with a precise editorial system.',
      fa: 'وب‌سایتی آرام و تصویرمحور برای یک استودیوی معماری با سیستم ادیتوریال دقیق.'
    },
    fullDescription: {
      en: 'Lumin needed a portfolio site that would not compete with the work. We developed a restrained editorial language, flexible project storytelling, and fast content structure.',
      fa: 'لومین به وب‌سایت پورتفولیویی نیاز داشت که با خود آثار رقابت نکند. زبان ادیتوریال کنترل‌شده، روایت منعطف پروژه و ساختار محتوای سریع توسعه داده شد.'
    },
    category: 'websites',
    services: ['websites'],
    technologies: ['Nuxt', 'TypeScript', 'Content', 'SEO'],
    coverVisual: { tone: 'mono', composition: 'editorial' },
    gallery: [
      {
        id: 'lumin-index',
        title: { en: 'Project index', fa: 'فهرست پروژه' },
        caption: { en: 'A sparse index gives each architectural project room to breathe.', fa: 'فهرست خلوت به هر پروژه معماری فضای کافی برای دیده شدن می‌دهد.' },
        orientation: 'wide',
        visual: { tone: 'mono', composition: 'editorial' }
      },
      {
        id: 'lumin-case',
        title: { en: 'Case study rhythm', fa: 'ریتم مطالعه موردی' },
        caption: { en: 'Text, images, and technical notes create a gallery-like reading experience.', fa: 'متن، تصویر و یادداشت‌های فنی تجربه خواندنی شبیه گالری می‌سازند.' },
        orientation: 'landscape',
        visual: { tone: 'warm', composition: 'editorial' }
      }
    ],
    projectUrl: 'https://example.com/lumin',
    pricing: {
      visibility: 'public',
      currency: 'EUR',
      min: 18000,
      max: 30000,
      note: { en: 'Public range: €18k–€30k', fa: 'بازه عمومی: ۱۸ تا ۳۰ هزار یورو' }
    },
    timeline: {
      durationWeeks: 7,
      note: { en: '7-week website design and build', fa: '۷ هفته طراحی و توسعه وب‌سایت' }
    },
    year: '2025',
    featured: false,
    status: 'published',
    overview: {
      en: 'A portfolio website with a strong editorial structure and almost invisible interface behavior.',
      fa: 'وب‌سایت پورتفولیو با ساختار ادیتوریال قوی و رفتار رابط تقریباً نامرئی.'
    },
    challenge: {
      en: 'The studio wanted a site that felt premium without adding visual noise around photography and plans.',
      fa: 'استودیو سایتی ممتاز می‌خواست بدون اضافه کردن نویز بصری اطراف عکس‌ها و پلان‌ها.'
    },
    solution: {
      en: 'We built a typography-led grid, minimal navigation, and project templates that support both visual and technical narratives.',
      fa: 'گرید متکی بر تایپوگرافی، ناوبری مینیمال و قالب‌های پروژه برای روایت تصویری و فنی ساختیم.'
    },
    keyFeatures: [
      { en: 'Editorial project templates', fa: 'قالب‌های ادیتوریال پروژه' },
      { en: 'Fast image-conscious frontend', fa: 'فرانت‌اند سریع و حساس به تصویر' },
      { en: 'SEO-ready practice and project structure', fa: 'ساختار آماده سئو برای استودیو و پروژه‌ها' }
    ],
    results: [
      { value: { en: '96', fa: '۹۶' }, label: { en: 'performance score', fa: 'امتیاز عملکرد' } },
      { value: { en: '2x', fa: '۲ برابر' }, label: { en: 'longer project reading', fa: 'زمان مطالعه پروژه' } }
    ],
    layout: 'portrait'
  },
  {
    id: 'proj_craftline_booking',
    slug: 'craftline-booking-platform',
    title: {
      en: 'Craftline Booking Platform',
      fa: 'پلتفرم رزرو کرافت‌لاین'
    },
    shortDescription: {
      en: 'A booking and inventory web app for workshops, instructors, ticketing, and customer reminders.',
      fa: 'وب‌اپ رزرو و موجودی برای کارگاه‌ها، مربیان، بلیت‌ها و یادآوری مشتریان.'
    },
    fullDescription: {
      en: 'Craftline coordinates physical workshops across multiple venues. SAZAN shaped the booking logic, instructor workspace, and customer-facing schedule experience.',
      fa: 'کرافت‌لاین کارگاه‌های حضوری را در چند مکان هماهنگ می‌کند. سازان منطق رزرو، فضای کاری مربی و تجربه برنامه زمان‌بندی مشتری را شکل داد.'
    },
    category: 'webApps',
    services: ['webApps', 'adminPanels', 'backendSystems'],
    technologies: ['Vue', 'Node.js', 'MongoDB', 'Calendars', 'Email API'],
    coverVisual: { tone: 'primary', composition: 'system' },
    gallery: [
      {
        id: 'craftline-schedule',
        title: { en: 'Schedule builder', fa: 'سازنده برنامه' },
        caption: { en: 'Workshops, inventory, rooms, and instructors are planned in one surface.', fa: 'کارگاه‌ها، موجودی، اتاق‌ها و مربیان در یک سطح برنامه‌ریزی می‌شوند.' },
        orientation: 'wide',
        visual: { tone: 'primary', composition: 'system' }
      },
      {
        id: 'craftline-ticket',
        title: { en: 'Ticket state', fa: 'وضعیت بلیت' },
        caption: { en: 'Ticket capacity and reminders update without manual spreadsheet work.', fa: 'ظرفیت بلیت و یادآوری‌ها بدون کار دستی در صفحه‌گسترده به‌روزرسانی می‌شوند.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'dashboard' }
      }
    ],
    demoUrl: 'https://example.com/craftline-demo',
    timeline: {
      durationWeeks: 10,
      note: { en: '10-week MVP build', fa: '۱۰ هفته ساخت نسخه اولیه' }
    },
    year: '2025',
    featured: false,
    status: 'published',
    overview: {
      en: 'A booking platform that connects customer schedules with operational realities.',
      fa: 'پلتفرم رزروی که زمان‌بندی مشتری را به واقعیت‌های عملیاتی متصل می‌کند.'
    },
    challenge: {
      en: 'Availability depended on venue, teacher, inventory, and ticket capacity — but those rules lived in separate places.',
      fa: 'ظرفیت به مکان، مربی، موجودی و تعداد بلیت وابسته بود؛ اما این قوانین در جاهای جدا قرار داشتند.'
    },
    solution: {
      en: 'We created a shared booking model and designed interfaces around conflicts, capacity, and reminder timing.',
      fa: 'مدل رزرو مشترک ساختیم و رابط‌ها را حول تداخل‌ها، ظرفیت و زمان‌بندی یادآوری طراحی کردیم.'
    },
    keyFeatures: [
      { en: 'Multi-venue booking logic', fa: 'منطق رزرو چندمکانه' },
      { en: 'Instructor and staff workspace', fa: 'فضای کاری مربی و تیم' },
      { en: 'Automated customer reminder sequences', fa: 'زنجیره یادآوری خودکار مشتری' }
    ],
    results: [
      { value: { en: '-11h', fa: '-۱۱ ساعت' }, label: { en: 'weekly admin effort', fa: 'کاهش کار هفتگی ادمین' } },
      { value: { en: '+21%', fa: '+۲۱٪' }, label: { en: 'completed bookings', fa: 'رزروهای کامل‌شده' } }
    ],
    layout: 'standard'
  },
  {
    id: 'proj_seedlink_marketplace',
    slug: 'seedlink-marketplace',
    title: {
      en: 'Seedlink Marketplace',
      fa: 'مارکت‌پلیس سیدلینک'
    },
    shortDescription: {
      en: 'A niche B2B marketplace for producers, buyers, approvals, and order negotiation.',
      fa: 'مارکت‌پلیس تخصصی B2B برای تولیدکنندگان، خریداران، تأییدها و مذاکره سفارش.'
    },
    fullDescription: {
      en: 'Seedlink needed trust and negotiation built into the marketplace experience. We designed listing tools, verified buyer flows, and a backend model for staged orders.',
      fa: 'سیدلینک به اعتماد و مذاکره درون تجربه مارکت‌پلیس نیاز داشت. ابزارهای ثبت محصول، مسیر خریدار تأییدشده و مدل بک‌اند سفارش مرحله‌ای طراحی شد.'
    },
    category: 'ecommerce',
    services: ['ecommerce', 'webApps', 'backendSystems'],
    technologies: ['Nuxt', 'Node.js', 'MongoDB', 'Search', 'Payments'],
    coverVisual: { tone: 'warm', composition: 'commerce' },
    gallery: [
      {
        id: 'seedlink-listing',
        title: { en: 'Verified listings', fa: 'لیستینگ‌های تأییدشده' },
        caption: { en: 'Producer listings carry enough detail for buyer confidence.', fa: 'لیستینگ تولیدکننده جزئیات کافی برای اعتماد خریدار دارد.' },
        orientation: 'wide',
        visual: { tone: 'warm', composition: 'commerce' }
      },
      {
        id: 'seedlink-negotiation',
        title: { en: 'Negotiation flow', fa: 'جریان مذاکره' },
        caption: { en: 'Orders can move through terms, revisions, and approvals without leaving the product.', fa: 'سفارش‌ها از شرایط، بازبینی و تأیید بدون خروج از محصول عبور می‌کنند.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'dashboard' }
      }
    ],
    projectUrl: 'https://example.com/seedlink',
    pricing: {
      visibility: 'on-request',
      note: { en: 'Scoped by marketplace rules and integrations', fa: 'براساس قوانین مارکت‌پلیس و یکپارچه‌سازی‌ها برآورد می‌شود' }
    },
    timeline: {
      durationWeeks: 15,
      note: { en: '15-week marketplace MVP', fa: '۱۵ هفته ساخت نسخه اولیه مارکت‌پلیس' }
    },
    year: '2026',
    featured: false,
    status: 'published',
    overview: {
      en: 'A marketplace foundation that balances product discovery with B2B trust mechanics.',
      fa: 'زیرساخت مارکت‌پلیس که کشف محصول را با سازوکارهای اعتماد B2B متعادل می‌کند.'
    },
    challenge: {
      en: 'B2B buyers needed context before committing, while producers needed a faster way to manage qualified interest.',
      fa: 'خریداران B2B پیش از تعهد به زمینه نیاز داشتند و تولیدکنندگان راه سریع‌تری برای مدیریت علاقه‌مندی معتبر می‌خواستند.'
    },
    solution: {
      en: 'We built a staged order model and marketplace interface that makes trust signals visible before negotiation starts.',
      fa: 'مدل سفارش مرحله‌ای و رابط مارکت‌پلیسی ساختیم که نشانه‌های اعتماد را پیش از شروع مذاکره قابل مشاهده می‌کند.'
    },
    keyFeatures: [
      { en: 'Verified producer profiles', fa: 'پروفایل تولیدکننده تأییدشده' },
      { en: 'Staged quote and order negotiation', fa: 'مذاکره مرحله‌ای قیمت و سفارش' },
      { en: 'Search filters designed for procurement intent', fa: 'فیلترهای جست‌وجو متناسب با هدف خرید سازمانی' }
    ],
    results: [
      { value: { en: '34%', fa: '۳۴٪' }, label: { en: 'higher qualified inquiries', fa: 'افزایش درخواست معتبر' } },
      { value: { en: '5', fa: '۵' }, label: { en: 'order states unified', fa: 'وضعیت سفارش یکپارچه' } }
    ],
    layout: 'feature'
  },
  {
    id: 'proj_rhythm_learning',
    slug: 'rhythm-learning-app',
    title: {
      en: 'Rhythm Learning App',
      fa: 'اپلیکیشن آموزشی ریتم'
    },
    shortDescription: {
      en: 'A mobile-first learning experience for short lessons, practice loops, and progress confidence.',
      fa: 'تجربه آموزشی موبایل‌محور برای درس‌های کوتاه، حلقه‌های تمرین و اطمینان از پیشرفت.'
    },
    fullDescription: {
      en: 'Rhythm makes learning feel less like a course archive and more like a daily practice. The design emphasizes small wins, repeatable exercises, and gentle progress feedback.',
      fa: 'ریتم یادگیری را کمتر شبیه آرشیو دوره و بیشتر شبیه تمرین روزانه می‌کند. طراحی روی موفقیت‌های کوچک، تمرین‌های تکرارپذیر و بازخورد آرام پیشرفت تمرکز دارد.'
    },
    category: 'mobileApps',
    services: ['mobileApps', 'webApps'],
    technologies: ['Flutter', 'Firebase', 'TypeScript', 'Design System'],
    coverVisual: { tone: 'accent', composition: 'mobile' },
    gallery: [
      {
        id: 'rhythm-lesson',
        title: { en: 'Lesson loop', fa: 'حلقه درس' },
        caption: { en: 'Lessons are short enough to complete and specific enough to remember.', fa: 'درس‌ها آن‌قدر کوتاه‌اند که کامل شوند و آن‌قدر مشخص‌اند که در ذهن بمانند.' },
        orientation: 'portrait',
        visual: { tone: 'accent', composition: 'mobile' }
      },
      {
        id: 'rhythm-progress',
        title: { en: 'Progress confidence', fa: 'اطمینان از پیشرفت' },
        caption: { en: 'Progress feedback rewards consistency instead of pressure.', fa: 'بازخورد پیشرفت به جای فشار، پیوستگی را تقویت می‌کند.' },
        orientation: 'landscape',
        visual: { tone: 'primary', composition: 'dashboard' }
      }
    ],
    demoUrl: 'https://example.com/rhythm-demo',
    timeline: {
      durationWeeks: 9,
      note: { en: '9-week UX and prototype engagement', fa: '۹ هفته طراحی تجربه و نمونه اولیه' }
    },
    year: '2024',
    featured: false,
    status: 'published',
    overview: {
      en: 'A mobile learning product designed around repeat behavior and clear practice structure.',
      fa: 'محصول یادگیری موبایل که حول رفتار تکرارشونده و ساختار تمرین روشن طراحی شده است.'
    },
    challenge: {
      en: 'The existing product had content depth but weak day-to-day motivation.',
      fa: 'محصول موجود عمق محتوایی داشت اما انگیزه روزمره ضعیف بود.'
    },
    solution: {
      en: 'We reframed lessons as practice loops with short feedback moments and a lighter mobile navigation model.',
      fa: 'درس‌ها را به حلقه‌های تمرین با بازخوردهای کوتاه و مدل ناوبری سبک‌تر موبایل تبدیل کردیم.'
    },
    keyFeatures: [
      { en: 'Daily practice loops', fa: 'حلقه‌های تمرین روزانه' },
      { en: 'Progress signals without gamification clutter', fa: 'سیگنال‌های پیشرفت بدون شلوغی گیمیفیکیشن' },
      { en: 'Mobile-first content structure', fa: 'ساختار محتوای موبایل‌محور' }
    ],
    results: [
      { value: { en: '+37%', fa: '+۳۷٪' }, label: { en: 'prototype lesson completion', fa: 'تکمیل درس در نمونه اولیه' } },
      { value: { en: '22', fa: '۲۲' }, label: { en: 'learning components', fa: 'کامپوننت یادگیری' } }
    ],
    layout: 'standard'
  },
  {
    id: 'proj_caspian_logistics',
    slug: 'caspian-logistics-backend',
    title: {
      en: 'Caspian Logistics Backend',
      fa: 'بک‌اند لجستیک کاسپین'
    },
    shortDescription: {
      en: 'A backend system for routing, shipment states, partner integrations, and operational reliability.',
      fa: 'سیستم بک‌اند برای مسیریابی، وضعیت‌های ارسال، یکپارچه‌سازی شرکا و پایداری عملیاتی.'
    },
    fullDescription: {
      en: 'Caspian required a more dependable backend foundation before expanding its logistics product. We mapped shipment states, API boundaries, partner events, and internal monitoring surfaces.',
      fa: 'کاسپین پیش از گسترش محصول لجستیک، به زیرساخت بک‌اند قابل اتکاتری نیاز داشت. وضعیت‌های ارسال، مرزهای API، رویدادهای شرکا و سطوح پایش داخلی مدل‌سازی شد.'
    },
    category: 'backendSystems',
    services: ['backendSystems', 'adminPanels'],
    technologies: ['Node.js', 'MongoDB', 'Queues', 'REST API', 'Observability'],
    coverVisual: { tone: 'mono', composition: 'backend' },
    gallery: [
      {
        id: 'caspian-states',
        title: { en: 'Shipment states', fa: 'وضعیت‌های ارسال' },
        caption: { en: 'The state model clarifies what can happen and who needs to know.', fa: 'مدل وضعیت روشن می‌کند چه اتفاقی می‌تواند بیفتد و چه کسی باید بداند.' },
        orientation: 'wide',
        visual: { tone: 'mono', composition: 'backend' }
      },
      {
        id: 'caspian-monitoring',
        title: { en: 'Monitoring view', fa: 'نمای پایش' },
        caption: { en: 'Operations can spot partner delays and retry failures faster.', fa: 'عملیات تأخیر شریک و خطاهای تلاش مجدد را سریع‌تر تشخیص می‌دهد.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'dashboard' }
      }
    ],
    pricing: {
      visibility: 'private',
      note: { en: 'Private infrastructure scope', fa: 'دامنه زیرساختی محرمانه' }
    },
    timeline: {
      durationWeeks: 13,
      note: { en: '13-week backend architecture and operations layer', fa: '۱۳ هفته معماری بک‌اند و لایه عملیات' }
    },
    year: '2025',
    featured: false,
    status: 'published',
    overview: {
      en: 'A backend engagement focused on service reliability and operational visibility.',
      fa: 'پروژه بک‌اند با تمرکز بر پایداری سرویس و دید عملیاتی.'
    },
    challenge: {
      en: 'Partner integrations produced inconsistent events, making shipment status hard to trust.',
      fa: 'یکپارچه‌سازی شرکا رویدادهای ناسازگار تولید می‌کرد و اعتماد به وضعیت ارسال سخت شده بود.'
    },
    solution: {
      en: 'We normalized event handling, clarified API ownership, and created operational views for the states that matter.',
      fa: 'پردازش رویدادها را استاندارد، مالکیت API را روشن و نماهای عملیاتی برای وضعیت‌های مهم ایجاد کردیم.'
    },
    keyFeatures: [
      { en: 'Normalized shipment state machine', fa: 'ماشین وضعیت استاندارد ارسال' },
      { en: 'Partner integration retry model', fa: 'مدل تلاش مجدد برای یکپارچه‌سازی شرکا' },
      { en: 'Operational monitoring surface', fa: 'سطح پایش عملیاتی' }
    ],
    results: [
      { value: { en: '-52%', fa: '-۵۲٪' }, label: { en: 'manual status corrections', fa: 'کاهش اصلاح دستی وضعیت' } },
      { value: { en: '8', fa: '۸' }, label: { en: 'partner events normalized', fa: 'رویداد شریک استاندارد' } }
    ],
    layout: 'landscape'
  },
  {
    id: 'proj_northstar_studio',
    slug: 'northstar-studio-website',
    title: {
      en: 'Northstar Studio Website',
      fa: 'وب‌سایت استودیو نورث‌استار'
    },
    shortDescription: {
      en: 'A high-contrast brand website for a creative studio with strong typography and fast case-study browsing.',
      fa: 'وب‌سایت برند با کنتراست بالا برای استودیوی خلاق با تایپوگرافی قوی و مرور سریع مطالعه موردی.'
    },
    fullDescription: {
      en: 'Northstar wanted a website that felt confident without becoming loud. We created a typographic system, bold case-study entry points, and compact service storytelling.',
      fa: 'نورث‌استار وب‌سایتی می‌خواست که مطمئن باشد اما پر سر و صدا نشود. سیستم تایپوگرافی، ورودی‌های جسورانه مطالعه موردی و روایت فشرده خدمات طراحی شد.'
    },
    category: 'websites',
    services: ['websites'],
    technologies: ['Nuxt', 'UnoCSS', 'TypeScript', 'SEO'],
    coverVisual: { tone: 'primary', composition: 'editorial' },
    gallery: [
      {
        id: 'northstar-hero',
        title: { en: 'Typographic hero', fa: 'هیروی تایپوگرافیک' },
        caption: { en: 'The homepage leads with a strong verbal and visual position.', fa: 'صفحه اصلی با موضع کلامی و بصری قوی شروع می‌شود.' },
        orientation: 'wide',
        visual: { tone: 'primary', composition: 'editorial' }
      },
      {
        id: 'northstar-cases',
        title: { en: 'Case-study shelf', fa: 'قفسه مطالعه موردی' },
        caption: { en: 'Selected work is scannable without flattening the identity.', fa: 'نمونه‌کارها قابل مرورند بدون اینکه هویت بصری تخت شود.' },
        orientation: 'landscape',
        visual: { tone: 'mono', composition: 'system' }
      }
    ],
    projectUrl: 'https://example.com/northstar',
    timeline: {
      durationWeeks: 6,
      note: { en: '6-week brand website launch', fa: '۶ هفته تا انتشار وب‌سایت برند' }
    },
    year: '2024',
    featured: false,
    status: 'published',
    overview: {
      en: 'A compact brand website that uses editorial confidence instead of decorative excess.',
      fa: 'وب‌سایت برند فشرده‌ای که به جای تزئینات اضافه، از اعتماد ادیتوریال استفاده می‌کند.'
    },
    challenge: {
      en: 'The studio had strong work but a generic digital presence that made every project feel similar.',
      fa: 'استودیو آثار قوی داشت اما حضور دیجیتال عمومی باعث می‌شد همه پروژه‌ها شبیه هم به نظر برسند.'
    },
    solution: {
      en: 'We introduced a sharper typography system and a project browsing rhythm that gives each case a distinct point of view.',
      fa: 'سیستم تایپوگرافی تیزتر و ریتم مرور پروژه ساختیم که به هر نمونه‌کار زاویه دید مستقل می‌دهد.'
    },
    keyFeatures: [
      { en: 'High-impact typographic homepage', fa: 'صفحه اصلی تایپوگرافیک و اثرگذار' },
      { en: 'Fast case-study browsing', fa: 'مرور سریع مطالعه موردی' },
      { en: 'Service narrative without marketing clutter', fa: 'روایت خدمات بدون شلوغی بازاریابی' }
    ],
    results: [
      { value: { en: '5', fa: '۵' }, label: { en: 'signature layouts', fa: 'چیدمان شاخص' } },
      { value: { en: '+29%', fa: '+۲۹٪' }, label: { en: 'inquiry quality', fa: 'کیفیت درخواست‌ها' } }
    ],
    layout: 'standard'
  },
  {
    id: 'proj_mina_analytics',
    slug: 'mina-analytics-admin',
    title: {
      en: 'Mina Analytics Admin',
      fa: 'ادمین تحلیل مینا'
    },
    shortDescription: {
      en: 'An analytics admin panel for performance reports, stakeholder exports, and data quality review.',
      fa: 'پنل مدیریتی تحلیل برای گزارش عملکرد، خروجی ذی‌نفعان و بررسی کیفیت داده.'
    },
    fullDescription: {
      en: 'Mina needed to make analytics useful to non-technical operators. We designed a reporting system that moves from business questions to data evidence without dashboard sprawl.',
      fa: 'مینا باید تحلیل داده را برای اپراتورهای غیرفنی کاربردی می‌کرد. سیستم گزارشی طراحی شد که از سوال کسب‌وکار به شواهد داده‌ای می‌رسد بدون رشد بی‌رویه داشبورد.'
    },
    category: 'adminPanels',
    services: ['adminPanels', 'webApps'],
    technologies: ['Vue', 'Charts', 'TypeScript', 'Node.js', 'Exports'],
    coverVisual: { tone: 'cool', composition: 'dashboard' },
    gallery: [
      {
        id: 'mina-reports',
        title: { en: 'Report builder', fa: 'سازنده گزارش' },
        caption: { en: 'Reports are organized by questions, not by chart type.', fa: 'گزارش‌ها براساس سوال‌ها سازمان‌دهی شده‌اند، نه نوع نمودار.' },
        orientation: 'wide',
        visual: { tone: 'cool', composition: 'dashboard' }
      },
      {
        id: 'mina-quality',
        title: { en: 'Data quality review', fa: 'بررسی کیفیت داده' },
        caption: { en: 'Quality warnings explain what changed and why it matters.', fa: 'هشدارهای کیفیت توضیح می‌دهند چه چیزی تغییر کرده و چرا مهم است.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'system' }
      }
    ],
    demoUrl: 'https://example.com/mina-demo',
    pricing: {
      visibility: 'public',
      currency: 'USD',
      min: 22000,
      max: 38000,
      note: { en: 'Public range: $22k–$38k', fa: 'بازه عمومی: ۲۲ تا ۳۸ هزار دلار' }
    },
    timeline: {
      durationWeeks: 8,
      note: { en: '8-week reporting admin product', fa: '۸ هفته محصول ادمین گزارش‌گیری' }
    },
    year: '2025',
    featured: false,
    status: 'published',
    overview: {
      en: 'An admin panel that turns analytics into practical decisions for operators and stakeholders.',
      fa: 'پنل ادمینی که تحلیل داده را برای اپراتورها و ذی‌نفعان به تصمیم کاربردی تبدیل می‌کند.'
    },
    challenge: {
      en: 'The team had many charts but few answers, and exporting reports required repeated manual cleanup.',
      fa: 'تیم نمودارهای زیادی داشت اما جواب‌های کمی می‌گرفت و خروجی گزارش‌ها پاکسازی دستی تکراری می‌خواست.'
    },
    solution: {
      en: 'We designed report templates around recurring business questions and added quality states before export.',
      fa: 'قالب‌های گزارش را حول سوال‌های تکرارشونده کسب‌وکار طراحی کردیم و پیش از خروجی، وضعیت‌های کیفیت اضافه شد.'
    },
    keyFeatures: [
      { en: 'Question-led report templates', fa: 'قالب‌های گزارش بر اساس سوال' },
      { en: 'Export-ready stakeholder views', fa: 'نماهای آماده خروجی برای ذی‌نفعان' },
      { en: 'Data quality warnings and review states', fa: 'هشدارها و وضعیت‌های بررسی کیفیت داده' }
    ],
    results: [
      { value: { en: '-64%', fa: '-۶۴٪' }, label: { en: 'manual report cleanup', fa: 'کاهش پاکسازی دستی گزارش' } },
      { value: { en: '11', fa: '۱۱' }, label: { en: 'recurring questions modeled', fa: 'سوال تکراری مدل‌شده' } }
    ],
    layout: 'portrait'
  },
  {
    id: 'proj_verdant_mobile',
    slug: 'verdant-commerce-mobile',
    title: {
      en: 'Verdant Commerce Mobile',
      fa: 'موبایل فروشگاهی وردنت'
    },
    shortDescription: {
      en: 'A mobile commerce experience for subscription produce boxes, delivery windows, and flexible preferences.',
      fa: 'تجربه تجارت موبایل برای اشتراک جعبه محصولات، بازه ارسال و ترجیح‌های منعطف.'
    },
    fullDescription: {
      en: 'Verdant needed mobile commerce that felt fresh and practical. We designed subscription flows, preference controls, and delivery visibility for weekly produce customers.',
      fa: 'وردنت به تجارت موبایلی نیاز داشت که هم تازه و هم کاربردی باشد. جریان‌های اشتراک، کنترل ترجیح‌ها و شفافیت ارسال برای مشتریان هفتگی طراحی شد.'
    },
    category: 'mobileApps',
    services: ['mobileApps', 'ecommerce'],
    technologies: ['Flutter', 'Commerce API', 'Subscriptions', 'Push'],
    coverVisual: { tone: 'warm', composition: 'mobile' },
    gallery: [
      {
        id: 'verdant-subscription',
        title: { en: 'Subscription rhythm', fa: 'ریتم اشتراک' },
        caption: { en: 'Customers can adjust the next box without fighting account settings.', fa: 'مشتری می‌تواند جعبه بعدی را بدون درگیری با تنظیمات حساب تغییر دهد.' },
        orientation: 'portrait',
        visual: { tone: 'warm', composition: 'mobile' }
      },
      {
        id: 'verdant-delivery',
        title: { en: 'Delivery clarity', fa: 'شفافیت ارسال' },
        caption: { en: 'Delivery windows and preferences stay visible at the moments they matter.', fa: 'بازه ارسال و ترجیح‌ها در لحظه‌های مهم قابل مشاهده می‌مانند.' },
        orientation: 'landscape',
        visual: { tone: 'accent', composition: 'commerce' }
      }
    ],
    demoUrl: 'https://example.com/verdant-mobile',
    timeline: {
      durationWeeks: 10,
      note: { en: '10-week mobile commerce prototype', fa: '۱۰ هفته نمونه اولیه تجارت موبایل' }
    },
    year: '2024',
    featured: false,
    status: 'published',
    overview: {
      en: 'A mobile commerce concept built around recurring purchase behavior and delivery clarity.',
      fa: 'کانسپت تجارت موبایل براساس رفتار خرید تکرارشونده و شفافیت ارسال.'
    },
    challenge: {
      en: 'Subscription customers needed flexibility, but too many settings made weekly changes feel tedious.',
      fa: 'مشتریان اشتراکی انعطاف می‌خواستند اما تنظیمات زیاد، تغییرات هفتگی را خسته‌کننده می‌کرد.'
    },
    solution: {
      en: 'We surfaced preference controls directly inside the next-delivery context and simplified subscription states.',
      fa: 'کنترل‌های ترجیح را مستقیماً در زمینه ارسال بعدی آوردیم و وضعیت‌های اشتراک را ساده کردیم.'
    },
    keyFeatures: [
      { en: 'Next-box preference controls', fa: 'کنترل ترجیح‌های جعبه بعدی' },
      { en: 'Subscription state clarity', fa: 'شفافیت وضعیت اشتراک' },
      { en: 'Delivery window communication', fa: 'اطلاع‌رسانی بازه ارسال' }
    ],
    results: [
      { value: { en: '3', fa: '۳' }, label: { en: 'subscription states', fa: 'وضعیت اشتراک' } },
      { value: { en: '+19%', fa: '+۱۹٪' }, label: { en: 'prototype preference updates', fa: 'به‌روزرسانی ترجیح در نمونه اولیه' } }
    ],
    layout: 'standard'
  },
  {
    id: 'proj_helio_api',
    slug: 'helio-api-platform',
    title: {
      en: 'Helio API Platform',
      fa: 'پلتفرم API هلیو'
    },
    shortDescription: {
      en: 'A developer-facing API portal with documentation patterns, keys, usage states, and onboarding flows.',
      fa: 'پورتال API برای توسعه‌دهندگان با الگوهای مستندات، کلیدها، وضعیت مصرف و مسیر ورود اولیه.'
    },
    fullDescription: {
      en: 'Helio had strong APIs but weak developer onboarding. SAZAN designed a portal that makes setup, credentials, usage limits, and examples easier to understand.',
      fa: 'هلیو APIهای قوی داشت اما ورود اولیه توسعه‌دهنده ضعیف بود. سازان پورتالی طراحی کرد که راه‌اندازی، دسترسی‌ها، محدودیت مصرف و مثال‌ها را قابل فهم‌تر می‌کند.'
    },
    category: 'backendSystems',
    services: ['backendSystems', 'webApps', 'websites'],
    technologies: ['Nuxt', 'Node.js', 'OpenAPI', 'MongoDB', 'Docs'],
    coverVisual: { tone: 'primary', composition: 'backend' },
    gallery: [
      {
        id: 'helio-docs',
        title: { en: 'Documentation system', fa: 'سیستم مستندات' },
        caption: { en: 'Guides, examples, and reference docs share the same navigation model.', fa: 'راهنماها، مثال‌ها و مرجع API یک مدل ناوبری مشترک دارند.' },
        orientation: 'wide',
        visual: { tone: 'primary', composition: 'backend' }
      },
      {
        id: 'helio-keys',
        title: { en: 'Key management', fa: 'مدیریت کلید' },
        caption: { en: 'Credentials and usage states are explicit without exposing operational complexity.', fa: 'دسترسی‌ها و وضعیت مصرف روشن‌اند بدون اینکه پیچیدگی عملیات آشکار شود.' },
        orientation: 'landscape',
        visual: { tone: 'mono', composition: 'system' }
      }
    ],
    demoUrl: 'https://example.com/helio-portal',
    pricing: {
      visibility: 'on-request',
      note: { en: 'Depends on documentation depth and API complexity', fa: 'وابسته به عمق مستندات و پیچیدگی API' }
    },
    timeline: {
      durationWeeks: 9,
      note: { en: '9-week developer portal foundation', fa: '۹ هفته زیرساخت پورتال توسعه‌دهنده' }
    },
    year: '2026',
    featured: false,
    status: 'published',
    overview: {
      en: 'A developer portal that treats technical clarity as part of the product experience.',
      fa: 'پورتال توسعه‌دهنده‌ای که شفافیت فنی را بخشی از تجربه محصول می‌داند.'
    },
    challenge: {
      en: 'Developers could not quickly understand which API path, key, and limit applied to their use case.',
      fa: 'توسعه‌دهندگان سریع نمی‌فهمیدند کدام مسیر API، کلید و محدودیت به کاربردشان مربوط است.'
    },
    solution: {
      en: 'We connected documentation, onboarding, credential management, and usage states into one developer journey.',
      fa: 'مستندات، ورود اولیه، مدیریت دسترسی و وضعیت مصرف را به یک مسیر توسعه‌دهنده متصل کردیم.'
    },
    keyFeatures: [
      { en: 'OpenAPI-powered documentation structure', fa: 'ساختار مستندات مبتنی بر OpenAPI' },
      { en: 'Credential and usage management', fa: 'مدیریت دسترسی و مصرف' },
      { en: 'Developer onboarding flows', fa: 'مسیر ورود اولیه توسعه‌دهنده' }
    ],
    results: [
      { value: { en: '-38%', fa: '-۳۸٪' }, label: { en: 'integration questions', fa: 'کاهش سوال‌های یکپارچه‌سازی' } },
      { value: { en: '14', fa: '۱۴' }, label: { en: 'API examples documented', fa: 'مثال API مستندسازی‌شده' } }
    ],
    layout: 'feature'
  }
] as const satisfies readonly PortfolioProject[];

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
