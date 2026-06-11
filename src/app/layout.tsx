import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DATA } from '@/data/resume';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';
import PlasmaField from '@/components/PlasmaField';
import { AnalyticsScripts } from '@/components/analytics/analytics-scripts';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700']
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mono'
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-bricolage'
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: DATA.name,
    template: `%s | ${DATA.name}`
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: 'en_US',
    type: 'website'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    title: `${DATA.name}`,
    card: 'summary_large_image'
  },
  verification: {
    google: '',
    yandex: ''
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased relative overflow-x-hidden',
          geist.variable,
          geistMono.variable,
          bricolage.variable
        )}
      >
        <AnalyticsScripts />
        {/* forcedTheme pins the site to dark while the light-mode toggle is hidden (see navbar.tsx). Remove forcedTheme to re-enable light mode. */}
        <ThemeProvider attribute='class' defaultTheme='dark' forcedTheme='dark'>
          <TooltipProvider delayDuration={0}>
            <a
              href='#main-content'
              className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg'
            >
              Skip to content
            </a>
            {/* Animated plasma background — fixed, behind every page for site-wide consistency */}
            <PlasmaField className='fixed inset-0 w-screen h-screen -z-10 pointer-events-none' />
            <div className='absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0'>
              <FlickeringGrid
                className='h-full w-full'
                squareSize={2}
                gridGap={2}
                style={{
                  maskImage: 'linear-gradient(to bottom, black, transparent)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)'
                }}
              />
            </div>
            <div id='main-content' className='relative z-10 max-w-[816px] mx-auto py-12 pb-24 sm:py-24 px-6'>{children}</div>
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

