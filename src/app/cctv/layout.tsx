import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live CCTV Kawasan — SIPEDAS',
  description:
    'Daftar pemantauan CCTV kawasan pedestrian dan titik strategis terkait SIPEDAS Ponorogo.',
  robots: { index: true, follow: true },
};

export default function CctvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
