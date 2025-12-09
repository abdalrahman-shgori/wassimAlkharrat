import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingSocial from '@/components/FloatingSocial/FloatingSocial';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {children}
      <FloatingSocial />

      <Footer />
    </>
  );
}

