import './cv.css';
import Navbar from '@/components/navbar';

// /cv is a print-first document, not a portfolio page: it deliberately sits
// outside the (site) route group so it inherits none of the site chrome — no
// header strip, no 816px reading clamp. It keeps only the global shell from the
// root layout (including the plasma background the white A4 sheet floats on),
// plus the floating nav dock as an entry point back to the rest of the site.
// The dock and plasma are both print:hidden, so the PDF stays clean; the sheet
// stages carry bottom clearance so the dock never covers content on screen.
export default function CVLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative z-10'>
      {children}
      <Navbar />
    </div>
  );
}
