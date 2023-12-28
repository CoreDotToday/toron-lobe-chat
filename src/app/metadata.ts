import { Metadata } from 'next';

import pkg from '../../package.json';

const { description, homepage } = pkg;

const siteConfig = {
  name: 'Toron.AI',
  description: 'Discussion with Toron AI - 토론 AI와 함께 토론하세요',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
  ],
};

export const metadata: Metadata = {
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    title: siteConfig.name,
  },
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/toronai_logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    images: ['/og.png'],
    url: homepage,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: description,
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@coredottoday',
    description,
    images: [
      'https://registry.npmmirror.com/@lobehub/assets-favicons/latest/files/assets/og-960x540.png',
    ],
    title: siteConfig.name,
  },
};

export default metadata;
