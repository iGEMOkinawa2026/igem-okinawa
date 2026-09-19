export type SiteLocale = 'en' | 'ja';

export const homeCopy = {
  en: {
    page: {
      title: 'iGEM Okinawa | 2026 Team',
      description:
        'iGEM Okinawa is a student-led synthetic biology research team representing Okinawa to the world. Currently highlighting the 2026 Team.',
    },
    header: {
      siteTitle: 'iGEM Okinawa',
      menuToggleLabel: 'Toggle navigation',
      nav: [
        { label: 'About', href: '#about' },
        { label: 'Activities', href: '#activities' },
        { label: 'Support Us', href: '#support' },
        { label: 'Archive', href: '#archive' },
      ],
    },
    hero: {
      badgeNatural: false,
      badgeText: 'Introducing',
      headingPrefix: 'The ',
      headingStrong: '2026',
      headingSuffix: ' Team',
      headingSuffixSmall: false,
      lede: 'We are iGEM Okinawa. Fusing the incredible biodiversity of the Ryukyu Islands with cutting-edge synthetic biology to solve global challenges.',
      primaryCtaLabel: 'Support Our Research',
      primaryCtaHref: '#support',
      secondaryCtaLabel: 'See Current Projects',
      secondaryCtaHref: '#activities',
      imagePlaceholderText: '[ 2026 Team Image Placeholder ]',
    },
    about: {
      visualPlaceholder: '[ Science / Bio Graphic ]',
      title: 'What is iGEM Okinawa?',
      paragraphs: [
        'iGEM Okinawa is a collective of passionate students from various disciplines, united by a shared vision: to advance synthetic biology and apply it to real-world problems.',
        'Originating from the unique island environment of Okinawa, we aim to bridge local ecological wisdom with global scientific innovation. Our multidisciplinary approach means we tackle problems ranging from environmental conservation to finding novel biotechnological applications.',
      ] as [string, string],
    },
    mission: {
      sectionTitle: 'Our Mission & Origins',
      subtitle: 'Why we exist and what drives our pursuit of science.',
      cards: [
        {
          icon: '🌴',
          title: 'Rooted in Okinawa',
          body: 'We draw inspiration from our local ecosystem, leveraging unique biological resources while answering local challenges with global implications.',
        },
        {
          icon: '🔬',
          title: 'Science-Driven',
          body: 'Rigorous research, meticulous lab work, and data-driven insights are at the core of every project we deploy.',
        },
        {
          icon: '🌍',
          title: 'Internationally Active',
          body: 'We aim to represent Japanese innovation at the Giant Jamboree, collaborating and competing with the brightest young minds worldwide.',
        },
      ],
    },
    activitiesSection: {
      sectionTitle: '2026 Highlights',
      subtitle: 'What our team is working on right now.',
    },
    support: {
      title: 'Empower the Next Generation of Scientists',
      body: "iGEM Okinawa's journey is made possible by the generosity of our sponsors and community. Your support directly funds our lab equipment, project development, and entry into the international iGEM competition.",
      sponsorCtaHref: 'mailto:junho.lee@oist.jp',
      sponsorCtaLabel: 'Become a Sponsor',
      deckHref: '#',
      deckLabel: 'View Sponsorship Deck',
    },
    archive: {
      title: 'Past Activities & Previous Teams',
      body: "Our journey didn't start this year. Explore the legacy, past projects, and the alumni who laid the foundation for iGEM Okinawa.",
      archiveButtonLabel: 'Visit the Archive',
    },
    footer: {
      brandTitle: 'iGEM Okinawa',
      brandTagline: 'Innovating with synthetic biology from the Ryukyu Islands to the world.',
      exploreHeading: 'Explore',
      exploreLinks: [
        { label: 'About Us', href: '#about' },
        { label: 'Activities', href: '#activities' },
        { label: 'Sponsor Us', href: '#support' },
        { label: 'Archive', href: '#archive' },
      ],
      connectHeading: 'Connect',
      copyrightLine: '© 2026 iGEM Okinawa. All rights reserved.',
      privacyHref: '#',
      privacyLabel: 'Privacy Policy',
      termsHref: '#',
      termsLabel: 'Terms of Use',
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
      nav: [
        { label: '概要', href: '#about' },
        { label: '活動', href: '#activities' },
        { label: '支援', href: '#support' },
        { label: 'アーカイブ', href: '#archive' },
      ],
    },
    hero: {
      badgeNatural: true,
      badgeText: 'ご紹介',
      headingPrefix: '',
      headingStrong: '2026',
      headingSuffix: '年チーム',
      headingSuffixSmall: true,
      lede: '私たちはiGEM Okinawaです。琉球列島の豊かな生物多様性と最先端の合成生物学を融合し、地球規模の課題解決に挑みます。',
      primaryCtaLabel: '活動を支援する',
      primaryCtaHref: '#support',
      secondaryCtaLabel: '取り組みを見る',
      secondaryCtaHref: '#activities',
      imagePlaceholderText: '[ 2026年チーム画像プレースホルダー ]',
    },
    about: {
      visualPlaceholder: '[ サイエンス / バイオ ビジュアル ]',
      title: 'iGEM Okinawaとは？',
      paragraphs: [
        'iGEM Okinawaは、さまざまな専門分野の学生が集い、合成生物学を社会実装へつなげるという共通の目標のもとに活動するコミュニティです。',
        '沖縄という島の環境から出発し、地域に根ざした知恵と世界的な科学イノベーションの橋渡しを目指します。学際的なアプローチで、環境保全から新たなバイオ応用まで幅広いテーマに取り組みます。',
      ] as [string, string],
    },
    mission: {
      sectionTitle: 'ミッションと原点',
      subtitle: '私たちが存在する理由と、科学への想い。',
      cards: [
        {
          icon: '🌴',
          title: '沖縄に根ざす',
          body: '地域の生態系から着想を得て、独自の生物資源を活かしながら、ローカルな課題にグローバルな視点で応えます。',
        },
        {
          icon: '🔬',
          title: '科学重視',
          body: '厳密な研究、丁寧な実験、データに基づく洞察を、すべてのプロジェクトの中心に置きます。',
        },
        {
          icon: '🌍',
          title: '世界へ発信',
          body: 'ジャイアント・ジャンボリーで日本のイノベーションを示し、世界中の仲間と協働・競争しながら成長します。',
        },
      ],
    },
    activitiesSection: {
      sectionTitle: '2026年のハイライト',
      subtitle: '現在チームが取り組んでいること。',
    },
    support: {
      title: '次世代の科学者を支える',
      body: 'iGEM Okinawaの挑戦は、スポンサーやコミュニティの皆さまのご支援によって実現しています。ご支援は、実験設備、プロジェクト開発、国際大会への参加などに直結します。',
      sponsorCtaHref: 'mailto:igem@oist.jp',
      sponsorCtaLabel: 'スポンサーになる',
      deckHref: '#',
      deckLabel: 'スポンサー資料を見る',
    },
    archive: {
      title: 'これまでの活動とチーム',
      body: '私たちの歩みは今年からではありません。これまでのプロジェクトや基盤を築いてきた仲間たちの記録をご覧ください。',
      archiveButtonLabel: 'アーカイブへ',
    },
    footer: {
      brandTitle: 'iGEM Okinawa',
      brandTagline: '琉球から世界へ。\n合成生物学で未来を描く。',
      exploreHeading: 'サイトマップ',
      exploreLinks: [
        { label: '概要', href: '#about' },
        { label: '活動', href: '#activities' },
        { label: '支援', href: '#support' },
        { label: 'アーカイブ', href: '#archive' },
      ],
      connectHeading: 'つながる',
      copyrightLine: '© 2026 iGEM Okinawa',
      privacyHref: '#',
      privacyLabel: 'プライバシーポリシー',
      termsHref: '#',
      termsLabel: '利用規約',
    },
  },
} as const;
