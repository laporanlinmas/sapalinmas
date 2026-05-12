import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/landing.css';
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  try {
    return new URL(raw).origin;
  } catch {
    return 'http://localhost:3000';
  }
}

function metadataBase(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
  } catch {
    return new URL('http://localhost:3000');
  }
}

const PHOSPHOR_STYLES = [
  'https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css',
  'https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css',
  'https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css',
];

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

const title = 'SIPEDAS — Sapa Pedestrian Ponorogo';
const description =
  'Sistem Informasi Pedestrian Satlinmas — pemantauan CCTV, peta kerawanan, pengaduan masyarakat, dan informasi kawasan pedestrian Kabupaten Ponorogo.';

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: title,
    template: '%s — SIPEDAS',
  },
  description,
  keywords: [
    'SIPEDAS',
    'Satlinmas',
    'Ponorogo',
    'Pedestrian',
    'Pejalan kaki',
    'CCTV',
    'Pengaduan',
    'Car Free Day',
    'trotoar',
  ],
  applicationName: 'SIPEDAS',
  authors: [{ name: 'Satlinmas Kabupaten Ponorogo', url: siteOrigin() }],
  creator: 'Satlinmas Kabupaten Ponorogo',
  publisher: 'Pemerintah Kabupaten Ponorogo',
  category: 'government',
  icons: {
    icon: [
      { url: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/assets/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    title: 'SIPEDAS',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'SIPEDAS',
    title,
    description,
    images: [{ url: '/assets/icon-512.png', width: 512, height: 512, alt: 'Logo SIPEDAS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/assets/icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
  },
  other: { 'mobile-web-app-capable': 'yes' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'GovernmentOrganization',
      name: title,
      url: siteOrigin(),
      logo: `${siteOrigin()}/assets/icon-512.png`,
      description,
    },
    {
      '@type': 'WebSite',
      name: 'SIPEDAS',
      url: siteOrigin(),
      inLanguage: 'id-ID',
      description,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        {PHOSPHOR_STYLES.map(href => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Dark mode init — cegah flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-link">
          Langsung ke isi utama
        </a>
        {children}
      </body>
    </html>
  );
}
