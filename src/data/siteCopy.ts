/**
 * Site-wide copy & i18n strings.
 * Page-specific content lives in Markdown/YAML content collections.
 * This file provides:
 *  - shared header/footer strings
 *  - landing-page hero copy
 *  - card-nav labels for the landing page
 */

export type SiteLocale = 'en' | 'ja';

export const siteCopy = {
  en: {
    page: {
      title: 'iGEM Okinawa | 2026 Team',
      description:
        'iGEM Okinawa is a student-led synthetic biology research team representing Okinawa to the world. Currently highlighting the 2026 Team.',
    },
    header: {
      siteTitle: 'iGEM Okinawa',
      menuToggleLabel: 'Toggle navigation',
    },
    hero: {
      badgeNatural: false,
      badgeText: 'Introducing',
      headingPrefix: 'The ',
      headingStrong: '2026',
      headingSuffix: ' Team',
      headingSuffixSmall: false,
      lede: 'iGEM Okinawa is a joint team comprising students from several schools across Okinawa Prefecture. We are taking on the challenge of solving local issues in Okinawa through synthetic biology.',
      primaryCtaLabel: '2026 project',
      primaryCtaHref: 'project/',
      secondaryCtaLabel: 'About the Team',
      secondaryCtaHref: 'about/',
      imagePlaceholderText: '[ 2026 Team Image Placeholder ]',
    },
    /** Cards shown on the landing page pointing to main sections */
    navCards: [
      {
        icon: '👥',
        title: 'About Us',
        body: 'Learn about our team, mission, and the unique perspective we bring from Okinawa.',
        href: 'about/',
      },
      {
        icon: '🤝',
        title: 'Project',
        body: 'Learn about our 2026 research tackling thrips pest damage in Okinawa\'s mango farms using synthetic biology.',
        href: 'project/',
      },
      {
        icon: '🤝',
        title: 'Human Practice',
        body: 'Explore how we connect our science to society through stakeholder engagement and ethics.',
        href: 'human-practice/',
      },
      {
        icon: '🔬',
        title: 'Activities',
        body: 'See what our team is working on — from wet lab experiments to computational modeling.',
        href: 'activities/',
      },
      {
        icon: '💡',
        title: 'Support Us',
        body: 'Your sponsorship helps fund lab equipment, project development, and competition entry.',
        href: 'support/',
      },
      {
        icon: '📚',
        title: 'Archive',
        body: "Browse past iGEM Okinawa teams, projects, and competition history.",
        href: 'archive/',
      },
    ],
    /** Landing-page About cards. `icon` selects the illustration in src/assets/. */
    about: {
      heading: 'About iGEM Okinawa',
      subtitle: 'Who we are',
      cards: [
        {
          icon: 'what',
          title: 'What is iGEM Okinawa?',
          body: 'We are a team of students from Okinawa tackling social challenges through synthetic biology, developing solutions rooted in our local environment and sharing them with the world.',
        },
        {
          icon: 'who',
          title: 'Who takes part?',
          body: 'Students gather from schools across Okinawa — including National Institute of Technology, Okinawa College (KOSEN), Okinawa Institute of Science and Technology (OIST), and the University of the Ryukyus — each bringing their own expertise and experience.',
        },
        {
          icon: 'vision',
          title: 'What are we aiming for?',
          body: "To nurture Okinawa's next generation of scientists and connect local wisdom with global innovation — building a sustainable future through synthetic biology.",
        },
      ],
    },
    projectPage: {
      badgeLabel: 'Project {year}',
      fallbackTitle: '{year} Project',
      preparingNotice:
        'The {year} project is being prepared. You can find our past work in the archive.',
      wikiLabel: 'iGEM Wiki',
      archiveLabel: 'Past Projects',
    },
    footer: {
      brandTitle: 'iGEM Okinawa',
      brandTagline: 'From Okinawa to the world. \nCreating the future through synthetic biology.',
      exploreHeading: 'Explore',
      connectHeading: 'Connect',
      copyrightLine: '© 2026 iGEM Okinawa. All rights reserved.',
      privacyHref: 'privacy/',
      privacyLabel: 'Privacy Policy',
      termsHref: 'site-policy/',
      termsLabel: 'Site Policy',
    },
  },
  ja: {
    page: {
      title: 'iGEM Okinawa | 2026team',
      description:
        'iGEM Okinawaは、沖縄から世界へ合成生物学の挑戦を発信する学生主導の研究チームです。現在は2026年チームを紹介しています。',
    },
    header: {
      siteTitle: 'iGEM Okinawa',
      menuToggleLabel: 'メニューを開閉',
    },
    hero: {
      badgeNatural: true,
      badgeText: 'ご紹介',
      headingPrefix: '',
      headingStrong: '2026',
      headingSuffix: '年チーム',
      headingSuffixSmall: true,
      lede: 'iGEM Okinawa は沖縄県内複数の学校の学生による合同チームです。沖縄の地域課題を合成生物学で解くことに挑戦しています。',
      primaryCtaLabel: '2026 project',
      primaryCtaHref: 'project/',
      secondaryCtaLabel: 'チーム紹介',
      secondaryCtaHref: 'about/',
      imagePlaceholderText: '[ 2026年チーム画像プレースホルダー ]',
    },
    navCards: [
      {
        icon: '👥',
        title: 'チーム紹介',
        body: '私たちのチーム、ミッション、沖縄ならではの視点をご紹介します。',
        href: 'about/',
      },
      {
        icon: '🔬',
        title: 'プロジェクト',
        body: '2026年のプロジェクトの詳細や、研究の背景・目標をご覧ください。',
        href: 'project/',
      },
      {
        icon: '🤝',
        title: 'ヒューマンプラクティス',
        body: 'ステークホルダーとの関わりや倫理を通じて、科学と社会をつなげる取り組み。',
        href: 'human-practice/',
      },
      {
        icon: '🔬',
        title: '活動',
        body: 'ウェットラボ実験からコンピュータモデリングまで、チームの取り組みをご覧ください。',
        href: 'activities/',
      },
      {
        icon: '💡',
        title: '支援する',
        body: 'ご支援は、実験設備、プロジェクト開発、国際大会への参加に直結します。',
        href: 'support/',
      },
      {
        icon: '📚',
        title: 'アーカイブ',
        body: '過去のiGEM Okinawaチーム、プロジェクト、大会の歩みをご覧ください。',
        href: 'archive/',
      },
    ],
    about: {
      heading: 'iGEM Okinawa について',
      subtitle: '私たちについて',
      cards: [
        {
          icon: 'what',
          title: 'iGEM Okinawaとは？',
          body: '合成生物学を用いて社会課題に取り組む沖縄の学生チームです。沖縄の環境に根ざした独自の解決策を開発し、世界へと発信しています。',
        },
        {
          icon: 'who',
          title: 'どんな人が参加している？',
          body: '沖縄工業高等専門学校（KOSEN）、沖縄科学技術大学院大学（OIST）、琉球大学をはじめ、沖縄県内のさまざまな学校から学生が集まり、それぞれの専門や経験を生かして活動しています。',
        },
        {
          icon: 'vision',
          title: '何を目指している？',
          body: '沖縄の次世代の科学者を育て、地域の知恵と世界のイノベーションをつなぎます。合成生物学を用いて、持続可能な未来を築きます。',
        },
      ],
    },
    projectPage: {
      badgeLabel: '{year}年の活動',
      fallbackTitle: '{year}年のプロジェクト',
      preparingNotice:
        '{year}年のプロジェクトは現在準備中です。これまでの活動はアーカイブからご覧いただけます。',
      wikiLabel: 'iGEM Wiki',
      archiveLabel: 'これまでのプロジェクト',
    },
    footer: {
      brandTitle: 'iGEM Okinawa',
      brandTagline: '沖縄から世界へ。\n合成生物学で未来を創造する。',
      exploreHeading: 'サイトマップ',
      connectHeading: 'つながる',
      copyrightLine: '© 2026 iGEM Okinawa',
      privacyHref: 'ja/privacy/',
      privacyLabel: 'Privacy Policy',
      termsHref: 'ja/site-policy/',
      termsLabel: 'Site Policy',
    },
  },
} as const;
