import Navbar from '@/components/layout/navbar/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingSocial from '@/components/UI/FloatingSocial/FloatingSocial';

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

