import Link from 'next/link';

export const metadata = {
  title: 'AgriLegal Pro — LegalTech Workspace',
  description: 'Agricultural Export Transaction & Legal Management Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#f5f5f7',
          color: '#1d1d1f',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        {/* Apple Glassmorphism Navbar */}
        <nav
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '14px 32px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#1d1d1f' }}>
            🌾 AgriLegal <span style={{ fontSize: '11px', color: '#86868b', textTransform: 'uppercase' }}>Pro</span>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
            <Link href="/" style={{ color: '#1d1d1f', textDecoration: 'none' }}>
              หน้าหลัก
            </Link>
            <Link href="/workspace" style={{ color: '#424245', textDecoration: 'none' }}>
              Workspace ดีล
            </Link>
            <Link href="/status" style={{ color: '#424245', textDecoration: 'none' }}>
              สถานะส่งออก
            </Link>
            <Link href="/documents" style={{ color: '#424245', textDecoration: 'none' }}>
              คลังเอกสาร
            </Link>
            <Link href="/ai-legal" style={{ color: '#424245', textDecoration: 'none' }}>
              AI Legal Specialist
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              href="/login"
              style={{
                backgroundColor: '#0071e3',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '980px',
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              style={{
                backgroundColor: '#e8f2fc',
                color: '#0071e3',
                padding: '6px 16px',
                borderRadius: '980px',
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              ลงทะเบียน
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 20px 80px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}