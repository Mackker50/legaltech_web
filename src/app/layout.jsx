import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'AgriLegal Pro — ระบบสัญญาส่งออกสินค้าเกษตร',
  description: 'การจัดการสัญญาส่งออกและ AI วิเคราะห์ Incoterms 2020',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ backgroundColor: '#f5f5f7', color: '#1d1d1f', margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <Navbar />
        <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 20px 80px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}