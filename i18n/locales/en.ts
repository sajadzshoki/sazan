export default {
  brand: {
    name: 'SAZAN',
    tagline: 'Digital product agency',
    shortTagline: 'Product Lab'
  },
  common: {
    startProject: 'Start a Project',
    exploreWork: 'Explore Our Work',
    viewAllProjects: 'View All Projects',
    viewCaseStudy: 'View Case Study'
  },
  navigation: {
    primary: 'Primary navigation',
    home: 'Home',
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    links: {
      projects: 'Projects',
      services: 'Services',
      process: 'Process',
      contact: 'Contact'
    }
  },
  home: {
    hero: {
      eyebrow: 'Digital products with craft and precision',
      title: 'We design and build digital products that feel inevitable.',
      lead: 'SAZAN partners with ambitious teams to shape websites, applications, commerce experiences, admin systems, and backends that are fast, elegant, and ready to scale.',
      signalTitle: 'Strategy, design, and engineering in one studio.',
      signalText: 'A compact team for products that need taste and technical depth.',
      visual: {
        kicker: 'Product architecture',
        title: 'Interface systems for real businesses',
        badge: 'SZN',
        module: 'Live product module'
      },
      metrics: {
        products: {
          value: '15+',
          label: 'product stories prepared for the portfolio system'
        },
        disciplines: {
          value: '06',
          label: 'core disciplines from brand sites to backend systems'
        },
        languages: {
          value: 'FA / EN',
          label: 'bilingual experience with native RTL and LTR layouts'
        }
      }
    },
    selectedWork: {
      eyebrow: 'Selected work',
      title: 'A curated preview of digital products with distinct systems and sharp execution.',
      lead: 'A compact homepage edit of product stories showing how strategy, interface design, and engineering come together.',
      note: 'Editorial layouts, large visuals, and concise technical context make each case study easy to scan.',
      projectLabel: 'Project {number}',
      projects: {
        atlas: {
          title: 'Atlas Commerce Studio',
          description: 'A premium commerce platform with modular landing pages, a refined checkout, and a performance-first storefront architecture.',
          category: 'E-commerce Platform'
        },
        nova: {
          title: 'Nova Health Portal',
          description: 'A responsive web application for bookings, patient dashboards, secure messaging, and operational workflows.',
          category: 'Web Application'
        },
        pulse: {
          title: 'Pulse Finance Mobile',
          description: 'A mobile product concept for money tracking, budgets, notifications, and calm daily financial decisions.',
          category: 'Mobile Application'
        },
        bazaar: {
          title: 'Bazaar Editorial Shop',
          description: 'A content-led shopping experience combining editorial storytelling, product discovery, and measurable conversion paths.',
          category: 'Website + Commerce'
        },
        panelix: {
          title: 'Panelix Operations OS',
          description: 'A custom admin environment for internal teams with role-based access, reporting, and clean operational dashboards.',
          category: 'Admin Panel'
        }
      }
    },
    services: {
      eyebrow: 'Services',
      title: 'From expressive frontends to resilient backend systems.',
      lead: 'SAZAN works across the full digital product stack, choosing the right level of design detail and engineering rigor for each business problem.',
      items: {
        websites: {
          title: 'Websites',
          description: 'High-performing brand, marketing, and content websites with strong typography, SEO structure, and fast user journeys.'
        },
        webApps: {
          title: 'Web Applications',
          description: 'Product interfaces, dashboards, portals, and real-time workflows designed to make complex tasks feel simple.'
        },
        mobileApps: {
          title: 'Mobile Applications',
          description: 'Focused iOS and Android experiences with clear interaction patterns and product thinking from the first screen.'
        },
        ecommerce: {
          title: 'E-commerce',
          description: 'Storefronts and commerce systems for curated catalogs, smooth checkout flows, and data-informed growth.'
        },
        adminPanels: {
          title: 'Admin Panels',
          description: 'Internal tools that respect real operations: permissions, workflows, reporting, and dependable day-to-day speed.'
        },
        backendSystems: {
          title: 'Backend Systems',
          description: 'APIs, data models, integrations, and service foundations that keep products secure, maintainable, and scalable.'
        }
      }
    },
    process: {
      eyebrow: 'How we work',
      title: 'A clear path from early idea to shipped product.',
      lead: 'The process stays lean, collaborative, and transparent so momentum never comes at the cost of quality.',
      steps: {
        discover: {
          title: 'Discover',
          description: 'We clarify goals, users, constraints, and the product opportunity before deciding what should be built.'
        },
        design: {
          title: 'Design',
          description: 'We turn strategy into flows, interfaces, content hierarchy, and a design system that can scale.'
        },
        build: {
          title: 'Build',
          description: 'We implement with modern architecture, clean code, performance discipline, and practical technical decisions.'
        },
        launch: {
          title: 'Launch',
          description: 'We prepare the release, test the details, and support iteration after real users start interacting.'
        }
      }
    },
    statement: {
      eyebrow: 'Agency philosophy',
      title: 'Not just pages. Product moments people return to.',
      lead: 'A digital product should feel intentional: the message, interface, data, and code all moving in the same direction.',
      support: 'That is where SAZAN works best — close to the business, close to the user, and close enough to the technology to make ambitious ideas real.'
    },
    cta: {
      eyebrow: 'Start light, think big',
      title: 'Have an idea? We can shape the first version together.',
      lead: 'You do not need a perfect brief. Bring the challenge, the product idea, or the messy notes — we will help translate them into a clear digital plan.',
      note: 'Send a short note and we will help turn the first conversation into a practical next step.'
    }
  },
  portfolio: {
    seo: {
      title: 'Projects',
      description: 'Explore SAZAN portfolio projects across websites, web apps, mobile apps, e-commerce, admin panels, and backend systems.'
    },
    categories: {
      all: 'All',
      websites: 'Websites',
      webApps: 'Web Apps',
      mobileApps: 'Mobile Apps',
      ecommerce: 'E-commerce',
      adminPanels: 'Admin Panels',
      backendSystems: 'Backend Systems'
    },
    hero: {
      eyebrow: 'Portfolio',
      title: 'Selected work, built to be used.',
      lead: 'A deeper look at digital products where interface craft, technical architecture, and business clarity work together.',
      countLabel: 'public projects'
    },
    filters: {
      label: 'Filter projects by category'
    },
    listing: {
      showing: '{count} projects / {category}',
      note: 'Each project is represented with local mock data now, structured so it can later be replaced by MongoDB-backed content.'
    },
    card: {
      openProject: 'Open {title} case study'
    },
    empty: {
      title: 'No projects in this category yet.',
      description: 'Try another category or return to all projects.'
    },
    detail: {
      backToProjects: 'Back to all projects',
      heroVisualLabel: 'Case study visual',
      challenge: 'Challenge',
      solution: 'Solution',
      projectDetails: 'Project details',
      notSpecified: 'Not specified',
      weeks: '{count} weeks',
      pricing: {
        private: 'Private engagement',
        onRequest: 'Available on request',
        public: 'Public range available'
      },
      meta: {
        category: 'Category',
        services: 'Services',
        timeline: 'Timeline',
        year: 'Year',
        pricing: 'Pricing'
      },
      links: {
        viewProduct: 'View Product',
        openDemo: 'Open Demo',
        visitWebsite: 'Visit Website'
      },
      overview: {
        eyebrow: 'Project overview'
      },
      features: {
        title: 'What mattered most'
      },
      gallery: {
        eyebrow: 'Visual system',
        title: 'Screens, states, and product moments.',
        lead: 'Abstract project visuals stand in for final media while keeping the case study rhythm close to the future content model.',
        visualLabel: 'Interface fragment'
      },
      video: {
        eyebrow: 'Video',
        placeholder: 'Video infrastructure is intentionally lightweight in this phase.'
      },
      technologies: {
        eyebrow: 'Technology',
        title: 'Stack and product architecture'
      },
      related: {
        eyebrow: 'Related projects',
        title: 'More work in a similar direction.',
        lead: 'Related projects are selected by category and overlapping services.'
      }
    }
  },

  language: {
    label: 'Language',
    switchTo: 'Switch to {locale}'
  },
  theme: {
    label: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    switchTo: 'Switch theme. Current preference: {theme}'
  },
  footer: {
    statement: 'Premium digital products for teams that care about craft, clarity, and reliable execution.',
    email: "hello{'@'}sazan.studio",
    navigation: 'Navigation',
    services: 'Services',
    social: 'Social',
    copyright: '© {year} SAZAN. All rights reserved.',
    location: 'Built for international and Persian-speaking audiences.'
  }
} as const;
