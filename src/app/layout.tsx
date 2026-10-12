import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { MockProvider } from '@/lib/store';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'GymCore · Força na gestão',
    template: '%s · GymCore'
  },
  description: 'Protótipo GymCore: gestão de academias, experiência do aluno e recepção. Dados fictícios, sem integração com backend.',
  icons: {
    icon: '/brand/symbol.svg'
  }
};
export const viewport: Viewport = {
  themeColor: '#080E19',
  width: 'device-width',
  initialScale: 1
};
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <html lang="pt-BR">
    <head>
      <link rel="preload" href="/fonts/geist.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </head>
    <body>
      <MockProvider>
        <Suspense fallback={<div className="route-loading" role="status">
          <span className="skeleton" />Carregando a experiência…</div>}>{children}</Suspense>
      </MockProvider>
    </body>
  </html>;
}
