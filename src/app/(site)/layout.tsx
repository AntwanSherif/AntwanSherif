import Navbar from '@/components/navbar';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

// Site chrome: the portfolio's navbar, centered reading column, and the
// flickering-grid header strip. Lives in a route group so chrome-free routes
// (e.g. /cv, a print-first document) can opt out simply by sitting outside it.
// The global shell (html/body, theme, analytics, plasma background) stays in
// the root layout and still wraps every route.
export default function SiteLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg'
      >
        Skip to content
      </a>
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
    </>
  );
}
