/**
 * Route-aware SEO shell for Flutter SPA.
 * Runs synchronously before Flutter boot so crawlers and first paint get
 * page-specific titles, meta tags, JSON-LD, and semantic HTML per URL.
 */
(function (global) {
  'use strict';

  var OG_IMAGE = 'https://teqanat.com/icons/og-banner.png';
  var SITE_ORIGIN = 'https://teqanat.com';

  function appBasePath() {
    var el = document.querySelector('base');
    var href = (el && el.getAttribute('href')) || '/';
    try {
      if (/^https?:/i.test(href)) href = new URL(href).pathname;
    } catch (e) { /* keep href */ }
    if (!href || href === '/') return '';
    return href.replace(/\/$/, '');
  }

  function stripAppBase(pathname) {
    var base = appBasePath();
    var p = pathname || '/';
    if (base && (p === base || p.indexOf(base + '/') === 0)) {
      p = p.slice(base.length) || '/';
    }
    return p;
  }

  function normalizePath(pathname) {
    if (!pathname || pathname === '/') return '/';
    var p = pathname.split('?')[0];
    if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
    if (p === '/home') return '/';
    return p;
  }

  function parseLocalePath(pathname) {
    var decoded = pathname || '/';
    try {
      decoded = decodeURI(decoded);
    } catch (e) { /* keep raw pathname */ }
    var p = normalizePath(stripAppBase(decoded));
    if (p === '/ar') return { lang: 'ar', route: '/' };
    if (p.indexOf('/ar/') === 0) return { lang: 'ar', route: normalizePath(p.slice(3) || '/') };
    if (p === '/en') return { lang: 'en', route: '/' };
    if (p.indexOf('/en/') === 0) return { lang: 'en', route: normalizePath(p.slice(3) || '/') };
    return { lang: 'ar', route: p };
  }

  function localizedPath(route, lang) {
    var r = normalizePath(route);
    lang = lang === 'en' ? 'en' : 'ar';
    if (r === '/') return '/' + lang;
    return '/' + lang + r;
  }

  function localizedAbsoluteUrl(route, lang) {
    return SITE_ORIGIN + localizedPath(route, lang);
  }

  function isArabic() {
    return parseLocalePath(global.location.pathname).lang === 'ar';
  }

  function currentLang() {
    return parseLocalePath(global.location.pathname).lang;
  }

  function canonicalUrl(route, lang) {
    return localizedAbsoluteUrl(route, lang || currentLang());
  }

  function hreflangUrl(route, lang) {
    return localizedAbsoluteUrl(route, lang);
  }

  function updateHreflangLinks(route, lang) {
    var existing = document.querySelectorAll('link[data-teqanat-hreflang]');
    for (var i = 0; i < existing.length; i++) {
      existing[i].parentNode.removeChild(existing[i]);
    }

    var specs = [
      { lang: 'ar', href: hreflangUrl(route, 'ar') },
      { lang: 'en', href: hreflangUrl(route, 'en') },
      { lang: 'x-default', href: hreflangUrl(route, 'ar') }
    ];

    for (var j = 0; j < specs.length; j++) {
      var link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = specs[j].lang;
      link.href = specs[j].href;
      link.setAttribute('data-teqanat-hreflang', '1');
      document.head.appendChild(link);
    }
  }

  function pageUrl(route, lang) {
    return canonicalUrl(route, lang);
  }

  var PAGES = {
  '/': {
    ar: {
      title: 'تقنات | حلول و انظمة بتقانة متطورة',
      description: 'تقنات — شركة برمجيات متخصصة في تطوير تطبيقات الجوال والمواقع الإلكترونية وتصميم UI/UX والهوية البصرية والتحول الرقمي.',
      socialDescription: 'شركة برمجيات متخصصة في تطوير التطبيقات والمواقع وتصميم الهوية الرقمية والتحول الرقمي.',
      h1: 'تقنات — حلول وأنظمة بتقانة متطورة',
      lead: 'نطوّر تطبيقات الجوال والمواقع الإلكترونية، ونصمم واجهات المستخدم UI/UX، ونبني هوية العلامة التجارية ونقود التحول الرقمي للشركات في السعودية والمنطقة.',
      sections: [
        { h2: 'خدماتنا', items: ['تطوير تطبيقات iOS و Android و Flutter', 'تطوير المواقع والمتاجر الإلكترونية', 'تصميم UI/UX والهوية البصرية', 'التحول الرقمي والاستشارات التقنية'] }
      ]
    },
    en: {
      title: 'Teqanat | Software Development & Digital Solutions',
      description: 'Teqanat — Professional software company specializing in mobile app development, web solutions, UI/UX design, brand identity, and digital transformation.',
      socialDescription: 'Professional software company specializing in mobile apps, web solutions, UI/UX design, and digital transformation.',
      h1: 'Teqanat — Software Development & Digital Solutions',
      lead: 'We build mobile apps, websites, UI/UX experiences, brand identity, and digital transformation solutions for businesses in Saudi Arabia and the region.',
      sections: [
        { h2: 'Our Services', items: ['Mobile app development (iOS, Android, Flutter)', 'Web development & e-commerce', 'UI/UX design & brand identity', 'Digital transformation consulting'] }
      ]
    }
  },
  '/about': {
    ar: {
      title: 'من نحن | تقنات',
      description: 'تعرف على تقنات — فريق سعودي متخصص في تطوير البرمجيات والتحول الرقمي وتصميم تجارب المستخدم.',
      socialDescription: 'شركة برمجيات سعودية متخصصة في التطبيقات والمواقع والهوية الرقمية.',
      h1: 'من نحن — تقنات',
      lead: 'تقنات شركة برمجيات سعودية تقدم حلولاً تقنية متكاملة: تطبيقات جوال، مواقع إلكترونية، تصميم UI/UX، وهوية بصرية، وتحول رقمي.',
      sections: [
        { h2: 'رؤيتنا', items: ['تمكين الشركات بحلول رقمية عالية الجودة', 'شراكات طويلة الأمد مع عملائنا', 'فريق محترف يجمع الخبرة التقنية والإبداع'] }
      ]
    },
    en: {
      title: 'About Us | Teqanat',
      description: 'Learn about Teqanat — a Saudi software team specializing in digital transformation, UI/UX, and custom development.',
      socialDescription: 'Saudi software company specializing in apps, websites, and digital identity.',
      h1: 'About Teqanat',
      lead: 'Teqanat is a Saudi software company delivering mobile apps, web platforms, UI/UX design, brand identity, and digital transformation.',
      sections: [
        { h2: 'Our Vision', items: ['Empower businesses with quality digital solutions', 'Long-term partnerships with our clients', 'A professional team blending tech and design'] }
      ]
    }
  },
  '/contact': {
    ar: {
      title: 'تواصل معنا | تقنات',
      description: 'تواصل مع فريق تقنات لبدء مشروعك — تطبيقات، مواقع، تصميم UI/UX، واستشارات تقنية.',
      socialDescription: 'ابدأ مشروعك مع تقنات — استشارة وتطوير برمجيات احترافي.',
      h1: 'تواصل معنا',
      lead: 'نسعد باستقبال استفساراتكم ومشاريعكم الرقمية. راسلونا عبر البريد أو نموذج التواصل في الموقع.',
      sections: [
        { h2: 'طرق التواصل', items: ['البريد: info@teqanat.com', 'نموذج تواصل إلكتروني على الموقع', 'استجابة خلال 24–48 ساعة عمل'] }
      ]
    },
    en: {
      title: 'Contact Us | Teqanat',
      description: 'Contact Teqanat to start your digital project — apps, websites, UI/UX, and technical consulting.',
      socialDescription: 'Start your project with Teqanat — professional software development.',
      h1: 'Contact Teqanat',
      lead: 'We welcome your inquiries and project ideas. Reach us by email or through the contact form on this page.',
      sections: [
        { h2: 'Get in Touch', items: ['Email: info@teqanat.com', 'Online contact form on this website', 'Response within 24–48 business hours'] }
      ]
    }
  },
  '/services': {
    ar: {
      title: 'خدماتنا | تقنات',
      description: 'خدمات تقنات: تطوير تطبيقات الجوال، المواقع الإلكترونية، UI/UX، الهوية البصرية، والتحول الرقمي.',
      socialDescription: 'تطوير تطبيقات ومواقع وتصميم واجهات — حلول تقنات المتكاملة.',
      h1: 'خدمات تقنات',
      lead: 'نقدم حزمة متكاملة من الخدمات التقنية للشركات والمؤسسات.',
      sections: [
        { h2: 'ما نقدمه', items: ['تطوير تطبيقات الجوال', 'تطوير المواقع والأنظمة الإلكترونية', 'تصميم UI/UX', 'الهوية البصرية والتحول الرقمي'] }
      ]
    },
    en: {
      title: 'Our Services | Teqanat',
      description: 'Teqanat services: mobile apps, web development, UI/UX design, brand identity, and digital transformation.',
      socialDescription: 'Apps, websites, and UI/UX — Teqanat end-to-end software services.',
      h1: 'Teqanat Services',
      lead: 'End-to-end software and design services for businesses and organizations.',
      sections: [
        { h2: 'What We Offer', items: ['Mobile application development', 'Web platforms & e-commerce', 'UI/UX design', 'Brand identity & digital transformation'] }
      ]
    }
  },
  '/projects': {
    ar: {
      title: 'مشاريعنا | تقنات',
      description: 'استعرض مشاريع تقنات في تطوير التطبيقات والمواقع والأنظمة الرقمية.',
      socialDescription: 'أعمال ومشاريع تقنات في تطوير البرمجيات والحلول الرقمية.',
      h1: 'مشاريعنا',
      lead: 'نماذج من أعمالنا في تطوير التطبيقات والمواقع والحلول الرقمية لعملاء في مختلف القطاعات.',
      sections: [
        { h2: 'مجالات العمل', items: ['تطبيقات الجوال', 'منصات ويب', 'أنظمة إدارية', 'تجارة إلكترونية'] }
      ]
    },
    en: {
      title: 'Our Projects | Teqanat',
      description: 'Explore Teqanat portfolio of apps, websites, and digital systems.',
      socialDescription: 'Teqanat portfolio — software development and digital solutions.',
      h1: 'Our Projects',
      lead: 'Selected work in mobile apps, web platforms, and digital solutions across industries.',
      sections: [
        { h2: 'Portfolio Areas', items: ['Mobile applications', 'Web platforms', 'Business systems', 'E-commerce'] }
      ]
    }
  },
  '/all_projects': {
    ar: { alias: '/projects' },
    en: { alias: '/projects' }
  },
  '/pricing': {
    ar: {
      title: 'الأسعار | تقنات',
      description: 'باقات وأسعار خدمات تقنات لتطوير التطبيقات والمواقع والحلول الرقمية.',
      socialDescription: 'باقات تطوير برمجيات مرنة من تقنات — اطلب عرض سعر.',
      h1: 'أسعار و باقات تقنات',
      lead: 'باقات مرنة لتطوير البرمجيات والتصميم — تواصل معنا لعرض سعر مخصص لمشروعك.',
      sections: []
    },
    en: {
      title: 'Pricing | Teqanat',
      description: 'Teqanat pricing packages for app development, websites, and digital solutions.',
      socialDescription: 'Flexible software development packages from Teqanat.',
      h1: 'Teqanat Pricing',
      lead: 'Flexible packages for software and design — contact us for a custom quote.',
      sections: []
    }
  },
  '/blog': {
    ar: {
      title: 'المدونة | تقنات',
      description: 'مقالات تقنية من تقنات حول التطوير والتصميم والتحول الرقمي.',
      socialDescription: 'مدونة تقنات — مقالات تقنية وتطوير برمجيات.',
      h1: 'مدونة تقنات',
      lead: 'مقالات ونصائح من فريقنا حول تطوير البرمجيات وتجربة المستخدم والتحول الرقمي.',
      sections: []
    },
    en: {
      title: 'Blog | Teqanat',
      description: 'Technical articles from Teqanat on development, design, and digital transformation.',
      socialDescription: 'Teqanat blog — software development insights.',
      h1: 'Teqanat Blog',
      lead: 'Articles and insights on software development, UX, and digital transformation.',
      sections: []
    }
  },
  '/order-form': {
    ar: {
      title: 'طلب خدمة | تقنات',
      description: 'قدّم طلبك لتطوير تطبيق أو موقع أو حل رقمي مع تقنات.',
      socialDescription: 'اطلب خدمة تطوير برمجيات من تقنات.',
      h1: 'طلب خدمة',
      lead: 'املأ نموذج الطلب وسيتواصل معك فريقنا لمناقشة متطلبات مشروعك.',
      sections: []
    },
    en: {
      title: 'Order a Service | Teqanat',
      description: 'Submit your request for app, web, or digital solution development with Teqanat.',
      socialDescription: 'Request software development services from Teqanat.',
      h1: 'Order a Service',
      lead: 'Fill out the order form and our team will contact you to discuss your project.',
      sections: []
    }
  },
  '/category': {
    ar: {
      title: 'فئات الخدمات | تقنات',
      description: 'استعرض فئات خدمات تقنات — تطوير تطبيقات، مواقع، تصميم UI/UX، والتحول الرقمي.',
      socialDescription: 'فئات خدمات تقنات — حلول برمجية متكاملة.',
      h1: 'فئات الخدمات',
      lead: 'تصفح خدماتنا حسب الفئة واختر الحل المناسب لمشروعك.',
      sections: []
    },
    en: {
      title: 'Service Categories | Teqanat',
      description: 'Browse Teqanat service categories — apps, websites, UI/UX, and digital transformation.',
      socialDescription: 'Teqanat service categories — end-to-end software solutions.',
      h1: 'Service Categories',
      lead: 'Browse our services by category and find the right solution for your project.',
      sections: []
    }
  },
  '/projects-by-category': {
    ar: {
      title: 'مشاريع حسب الفئة | تقنات',
      description: 'استعرض مشاريع تقنات حسب التصنيف — تطبيقات، مواقع، وأنظمة رقمية.',
      socialDescription: 'مشاريع تقنات مصنّفة حسب المجال.',
      h1: 'مشاريع حسب الفئة',
      lead: 'تصفح أعمالنا حسب فئة المشروع واكتشف حلولنا في مختلف القطاعات.',
      sections: []
    },
    en: {
      title: 'Projects by Category | Teqanat',
      description: 'Browse Teqanat projects by category — apps, websites, and digital systems.',
      socialDescription: 'Teqanat projects organized by industry and type.',
      h1: 'Projects by Category',
      lead: 'Explore our portfolio by project category across industries.',
      sections: []
    }
  },
  '/project-details': {
    ar: {
      title: 'تفاصيل المشروع | تقنات',
      description: 'تفاصيل مشروع من أعمال تقنات — تطوير تطبيقات ومواقع وحلول رقمية احترافية.',
      socialDescription: 'مشروع من محفظة أعمال تقنات في تطوير البرمجيات.',
      h1: 'تفاصيل المشروع',
      lead: 'اطلع على تفاصيل هذا المشروع من محفظة أعمال تقنات في التطوير الرقمي.',
      sections: [
        { h2: 'ما نقدمه', items: ['تطوير تطبيقات الجوال', 'منصات ويب وأنظمة إلكترونية', 'تصميم UI/UX', 'دعم وصيانة'] }
      ]
    },
    en: {
      title: 'Project Details | Teqanat',
      description: 'Teqanat project details — professional app, web, and digital solution development.',
      socialDescription: 'A project from the Teqanat software development portfolio.',
      h1: 'Project Details',
      lead: 'Explore this project from Teqanat portfolio of digital solutions.',
      sections: [
        { h2: 'Our Expertise', items: ['Mobile app development', 'Web platforms & systems', 'UI/UX design', 'Support & maintenance'] }
      ]
    }
  },
  '/service-details': {
    ar: {
      title: 'تفاصيل الخدمة | تقنات',
      description: 'تفاصيل خدمة من تقنات — تطوير برمجيات، تصميم، وتحول رقمي للشركات.',
      socialDescription: 'خدمة احترافية من تقنات — حلول تقنية مخصصة.',
      h1: 'تفاصيل الخدمة',
      lead: 'تعرّف على تفاصيل هذه الخدمة وكيف تساعدك تقنات في تحقيق أهدافك الرقمية.',
      sections: [
        { h2: 'لماذا تقنات', items: ['فريق محترف', 'حلول مخصصة', 'دعم مستمر', 'جودة عالية'] }
      ]
    },
    en: {
      title: 'Service Details | Teqanat',
      description: 'Teqanat service details — custom software, design, and digital transformation for businesses.',
      socialDescription: 'Professional Teqanat service — tailored technology solutions.',
      h1: 'Service Details',
      lead: 'Learn about this service and how Teqanat helps you achieve your digital goals.',
      sections: [
        { h2: 'Why Teqanat', items: ['Professional team', 'Custom solutions', 'Ongoing support', 'High quality'] }
      ]
    }
  },
  '/blog/article': {
    ar: {
      title: 'مقال | مدونة تقنات',
      description: 'اقرأ مقالاً تقنياً من مدونة تقنات حول التطوير والتصميم والتحول الرقمي.',
      socialDescription: 'مقال من مدونة تقنات — تطوير برمجيات وتحول رقمي.',
      h1: 'مقال',
      lead: 'محتوى تقني من فريق تقنات حول البرمجيات وتجربة المستخدم والابتكار الرقمي.',
      sections: []
    },
    en: {
      title: 'Article | Teqanat Blog',
      description: 'Read a technical article from Teqanat blog on development, design, and digital transformation.',
      socialDescription: 'Article from Teqanat blog — software development insights.',
      h1: 'Article',
      lead: 'Technical content from Teqanat on software, UX, and digital innovation.',
      sections: []
    }
  }
  };

  function normalizeSeoRoute(path) {
    if (!path || path === '/') return '/';
    if (path.indexOf('/project-details/') === 0) return '/project-details';
    if (path.indexOf('/ProjectDetailsView/') === 0) return '/project-details';
    if (path.indexOf('/service-details/') === 0) return '/service-details';
    if (path.indexOf('/ServiceDetailPage/') === 0) return '/service-details';
    if (path.indexOf('/blog/') === 0 && path !== '/blog') return '/blog/article';
    return path;
  }

  function resolvePage(path, lang) {
    var seoRoute = normalizeSeoRoute(path);
    var entry = PAGES[seoRoute];
    if (!entry) {
      entry = PAGES['/'];
    }
    var copy = entry[lang] || entry.ar || entry.en;
    if (copy && copy.alias) {
      return resolvePage(copy.alias, lang);
    }
    return copy;
  }

  function setMetaName(name, content) {
    var el = document.querySelector('meta[name="' + name + '"]');
    if (el) el.setAttribute('content', content);
  }

  function setMetaProperty(property, content) {
    var el = document.querySelector('meta[property="' + property + '"]');
    if (el) el.setAttribute('content', content);
  }

  function injectJsonLd(route, copy, lang) {
    var id = 'seo-route-jsonld';
    var existing = document.getElementById(id);
    if (existing) existing.remove();

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: copy.h1,
      description: copy.description,
      url: canonicalUrl(route, lang),
      inLanguage: lang === 'ar' ? 'ar-SA' : 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        name: lang === 'ar' ? 'تقنات' : 'Teqanat',
        url: localizedAbsoluteUrl('/', lang)
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: lang === 'ar' ? 'الرئيسية' : 'Home', item: localizedAbsoluteUrl('/', lang) },
          { '@type': 'ListItem', position: 2, name: copy.h1, item: canonicalUrl(route, lang) }
        ]
      }
    });
    document.head.appendChild(script);
  }

  function syncHtmlLocale(lang) {
    lang = lang === 'en' ? 'en' : 'ar';
    var bcp47 = lang === 'en' ? 'en-US' : 'ar-SA';
    var dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = bcp47;
    document.documentElement.setAttribute('dir', dir);
    var contentLanguage = document.querySelector('meta[http-equiv="Content-Language"]');
    if (contentLanguage) contentLanguage.setAttribute('content', bcp47);
  }

  function installHtmlLocaleNavigationSync() {
    if (global.__teqanatLocaleNavSync) return;
    global.__teqanatLocaleNavSync = true;
    global.addEventListener('popstate', function () {
      syncHtmlLocale(parseLocalePath(global.location.pathname).lang);
    });
  }

  function truncateSeo(text, maxLength) {
    if (!text) return '';
    var cleaned = String(text).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    maxLength = maxLength || 160;
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength - 1).trim() + '…';
  }

  function resolveMediaUrl(raw) {
    if (!raw) return OG_IMAGE;
    var url = String(raw).trim();
    if (!url) return OG_IMAGE;
    if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) return url;
    if (url.indexOf('//') === 0) return 'https:' + url;
    if (url.charAt(0) === '/') return SITE_ORIGIN + url;
    return 'https://apis.teqanat.com/' + url.replace(/^\/+/, '');
  }

  function parseDynamicRoute(route) {
    var m = route.match(/^\/project-details\/(\d+)/i);
    if (m) return { type: 'project', id: m[1] };
    m = route.match(/^\/ProjectDetailsView\/(\d+)/i);
    if (m) return { type: 'project', id: m[1] };
    m = route.match(/^\/service-details\/(\d+)/i);
    if (m) return { type: 'service', id: m[1] };
    m = route.match(/^\/ServiceDetailPage\/(\d+)/i);
    if (m) return { type: 'service', id: m[1] };
    m = route.match(/^\/blog\/(\d+)/i);
    if (m) return { type: 'blog', id: m[1] };
    return null;
  }

  function buildSeoFromApi(parsed, data, lang) {
    if (!data) return null;
    var isAr = lang === 'ar';
    var siteName = isAr ? 'تقنات' : 'Teqanat';

    if (parsed.type === 'project') {
      var pTitle = isAr ? (data.titleAr || data.title) : (data.title || data.titleAr);
      var pDesc = isAr
        ? (data.shortDescriptionAr || data.shortDescription || data.descriptionAr || data.description)
        : (data.shortDescription || data.shortDescriptionAr || data.description || data.descriptionAr);
      var pCat = isAr ? (data.categoryTitleAr || data.categoryTitle) : (data.categoryTitle || data.categoryTitleAr);
      var pImg = resolveMediaUrl(data.mainPhotoUrl || data.mainPhotoUrlAr);
      return {
        title: pTitle || (isAr ? 'تفاصيل المشروع' : 'Project Details'),
        description: truncateSeo(pDesc),
        socialDescription: truncateSeo(pDesc, 200),
        keywords: [pTitle, pCat, 'تقنات', 'Teqanat'].filter(Boolean).join(', '),
        image: pImg,
        h1: pTitle,
        lead: truncateSeo(pDesc, 240)
      };
    }

    if (parsed.type === 'service') {
      var sTitle = isAr ? (data.titleAr || data.title) : (data.title || data.titleAr);
      var sDesc = isAr
        ? (data.shortDescriptionAr || data.shortDescription || data.descriptionAr || data.description)
        : (data.shortDescription || data.shortDescriptionAr || data.description || data.descriptionAr);
      var sCat = isAr ? (data.categoryTitleAr || data.categoryTitle) : (data.categoryTitle || data.categoryTitleAr);
      var sImg = resolveMediaUrl(data.mainPhotoUrl || data.mainPhotoUrlAr || data.image);
      return {
        title: sTitle || (isAr ? 'تفاصيل الخدمة' : 'Service Details'),
        description: truncateSeo(sDesc),
        socialDescription: truncateSeo(sDesc, 200),
        keywords: [sTitle, sCat, 'تقنات', 'Teqanat'].filter(Boolean).join(', '),
        image: sImg,
        h1: sTitle,
        lead: truncateSeo(sDesc, 240)
      };
    }

    if (parsed.type === 'blog') {
      var bTitle = isAr ? (data.titleAr || data.title) : (data.title || data.titleAr);
      var bDesc = isAr
        ? (data.shortDescriptionAr || data.shortDescription)
        : (data.shortDescription || data.shortDescriptionAr);
      var bCat = isAr ? (data.categoryTitleAr || data.categoryTitle) : (data.categoryTitle || data.categoryTitleAr);
      var bImg = resolveMediaUrl(data.coverImageUrl);
      return {
        title: bTitle || (isAr ? 'مقال' : 'Article'),
        description: truncateSeo(bDesc),
        socialDescription: truncateSeo(bDesc, 200),
        keywords: [bTitle, bCat, 'تقنات', 'Teqanat'].filter(Boolean).join(', '),
        image: bImg,
        h1: bTitle,
        lead: truncateSeo(bDesc, 240)
      };
    }

    return null;
  }

  function applyDynamicHead(route, lang, seo) {
    if (!seo) return;
    var siteName = lang === 'ar' ? 'تقنات' : 'Teqanat';
    var fullTitle = seo.title + ' | ' + siteName;
    var canonical = canonicalUrl(route, lang);

    syncHtmlLocale(lang);
    document.title = fullTitle;
    setMetaName('title', fullTitle);
    setMetaName('description', seo.description);
    if (seo.keywords) setMetaName('keywords', seo.keywords);
    setMetaProperty('og:title', fullTitle);
    setMetaProperty('og:description', seo.socialDescription || seo.description);
    setMetaProperty('og:site_name', siteName);
    setMetaProperty('og:url', canonical);
    setMetaProperty('og:locale', lang === 'ar' ? 'ar_SA' : 'en_US');
    setMetaProperty('og:image', seo.image || OG_IMAGE);
    setMetaProperty('og:image:secure_url', seo.image || OG_IMAGE);
    setMetaName('twitter:title', fullTitle);
    setMetaName('twitter:description', seo.socialDescription || seo.description);
    setMetaName('twitter:image', seo.image || OG_IMAGE);
    setMetaName('twitter:url', canonical);

    var canonicalEl = document.getElementById('canonical-link') ||
      document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', canonical);
    updateHreflangLinks(route, lang);
    injectJsonLd(route, {
      h1: seo.h1 || seo.title,
      description: seo.description,
      title: fullTitle
    }, lang);

    var root = document.getElementById('seo-prerender');
    if (root) {
      root.innerHTML = '<h1>' + (seo.h1 || seo.title) + '</h1><p>' + (seo.lead || seo.description) + '</p>';
    }

    global.__teqanatSeoCtx = { path: route, lang: lang, copy: seo, dynamic: true };
  }

  function loadDynamicSeo(route, lang) {
    var parsed = parseDynamicRoute(route);
    if (!parsed) return;

    var apiUrl;
    if (parsed.type === 'project') apiUrl = '/api/Projects/' + parsed.id;
    else if (parsed.type === 'service') apiUrl = '/api/services/' + parsed.id;
    else if (parsed.type === 'blog') apiUrl = '/api/blog';
    else return;

    fetch(apiUrl, { credentials: 'same-origin' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (json) {
        if (!json || json.success !== true) return;
        var data = json.data;
        if (parsed.type === 'blog' && Array.isArray(data)) {
          data = data.find(function (item) {
            return String(item.id) === String(parsed.id);
          });
        }
        var seo = buildSeoFromApi(parsed, data, lang);
        if (seo) applyDynamicHead(route, lang, seo);
      })
      .catch(function () { /* keep static fallback */ });
  }

  function applyHead() {
    var parsed = parseLocalePath(global.location.pathname);
    var route = parsed.route;
    var seoRoute = normalizeSeoRoute(route);
    var lang = parsed.lang;
    var copy = resolvePage(seoRoute, lang);

    syncHtmlLocale(lang);
    installHtmlLocaleNavigationSync();
    document.title = copy.title;

    setMetaName('title', copy.title);
    setMetaName('description', copy.description);
    if (copy.keywords) setMetaName('keywords', copy.keywords);
    setMetaProperty('og:title', copy.title);
    setMetaProperty('og:description', copy.socialDescription);
    setMetaProperty('og:site_name', lang === 'ar' ? 'تقنات' : 'Teqanat');
    setMetaProperty('og:url', canonicalUrl(route, lang));
    setMetaProperty('og:locale', lang === 'ar' ? 'ar_SA' : 'en_US');
    setMetaProperty('og:image', OG_IMAGE);
    setMetaProperty('og:image:secure_url', OG_IMAGE);
    setMetaName('twitter:title', copy.title);
    setMetaName('twitter:description', copy.socialDescription);
    setMetaName('twitter:image', OG_IMAGE);
    setMetaName('twitter:url', canonicalUrl(route, lang));

    var canonical = document.getElementById('canonical-link') ||
      document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', canonicalUrl(route, lang));

    updateHreflangLinks(route, lang);

    injectJsonLd(route, copy, lang);
    var ctx = { path: route, lang: lang, copy: copy };
    global.__teqanatSeoCtx = ctx;
    loadDynamicSeo(route, lang);
    return ctx;
  }

  function renderBody(ctx) {
    var root = document.getElementById('seo-prerender');
    if (!root || !ctx || !ctx.copy) return;

    var copy = ctx.copy;
    var lang = ctx.lang;
    var base = appBasePath();
    var navLinks = lang === 'ar'
      ? [
          { href: base + '/ar', label: 'الرئيسية' },
          { href: base + '/ar/about', label: 'من نحن' },
          { href: base + '/ar/services', label: 'الخدمات' },
          { href: base + '/ar/projects', label: 'المشاريع' },
          { href: base + '/ar/pricing', label: 'الأسعار' },
          { href: base + '/ar/blog', label: 'المدونة' },
          { href: base + '/ar/contact', label: 'تواصل معنا' }
        ]
      : [
          { href: base + '/en', label: 'Home' },
          { href: base + '/en/about', label: 'About' },
          { href: base + '/en/services', label: 'Services' },
          { href: base + '/en/projects', label: 'Projects' },
          { href: base + '/en/pricing', label: 'Pricing' },
          { href: base + '/en/blog', label: 'Blog' },
          { href: base + '/en/contact', label: 'Contact' }
        ];

    var html = '<header><p><strong>' + (lang === 'ar' ? 'تقنات' : 'Teqanat') + '</strong></p>';
    html += '<nav aria-label="' + (lang === 'ar' ? 'التنقل الرئيسي' : 'Main navigation') + '"><ul>';
    for (var i = 0; i < navLinks.length; i++) {
      html += '<li><a href="' + navLinks[i].href + '">' + navLinks[i].label + '</a></li>';
    }
    html += '</ul></nav></header>';
    html += '<h1>' + copy.h1 + '</h1>';
    html += '<p>' + copy.lead + '</p>';

    if (copy.sections && copy.sections.length) {
      for (var s = 0; s < copy.sections.length; s++) {
        var section = copy.sections[s];
        html += '<h2>' + section.h2 + '</h2><ul>';
        for (var j = 0; j < section.items.length; j++) {
          html += '<li>' + section.items[j] + '</li>';
        }
        html += '</ul>';
      }
    }

    html += '<p><a href="mailto:info@teqanat.com">info@teqanat.com</a></p>';
    root.innerHTML = html;
  }

  function apply() {
    var ctx = applyHead();
    if (document.body) {
      renderBody(ctx);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        renderBody(ctx);
      });
    }
  }

  function removePrerender() {
    var el = document.getElementById('seo-prerender');
    if (el) el.remove();
    var ld = document.getElementById('seo-route-jsonld');
    if (ld) ld.remove();
  }

  global.TeqanatSeo = {
    apply: apply,
    applyHead: applyHead,
    renderBody: renderBody,
    removePrerender: removePrerender,
    normalizePath: normalizePath,
    normalizeSeoRoute: normalizeSeoRoute,
    parseLocalePath: parseLocalePath,
    localizedPath: localizedPath,
    localizedAbsoluteUrl: localizedAbsoluteUrl,
    updateHreflangLinks: updateHreflangLinks,
    canonicalUrl: canonicalUrl,
    syncHtmlLocale: syncHtmlLocale
  };
})(window);
