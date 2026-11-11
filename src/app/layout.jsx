'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppProvider } from '@/context/AppContext';

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    fetchActiveUser();
  }, [pathname]);

  const fetchActiveUser = async () => {
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.currentUser) {
        setActiveUser(data.currentUser);
      } else {
        setActiveUser(null);
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setActiveUser(null);
      localStorage.removeItem('user');
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // ดึงชื่อ-นามสกุลจริงมาแสดงผล
  const displayName = activeUser?.name || activeUser?.fullName || 'ฐิติพงศ์ ลีลาจิรวัฒน์';

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 36px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: "'Prompt', sans-serif"
    }}>
      {/* Brand & Main Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '22px' }}>🌱</span>
          <span style={{ fontSize: '19px', fontWeight: '800', color: '#1b4332' }}>ExportSure</span>
        </Link>

        <nav style={{ display: 'flex', gap: '22px', fontSize: '14px', fontWeight: '600' }}>
          <Link href="/" style={{ color: pathname === '/' ? '#1b4332' : '#64748b', textDecoration: 'none' }}>หน้าหลัก</Link>
          <Link href="/workspace" style={{ color: pathname === '/workspace' ? '#1b4332' : '#64748b', textDecoration: 'none' }}>Workspace</Link>
          <Link href="/status" style={{ color: pathname === '/status' ? '#1b4332' : '#64748b', textDecoration: 'none' }}>ประวัติการทำธุรกรรม</Link>
          <Link href="/documents" style={{ color: pathname === '/documents' ? '#1b4332' : '#64748b', textDecoration: 'none' }}>คลังเอกสาร</Link>
          <Link href="/ai-legal" style={{ color: pathname === '/ai-legal' ? '#1b4332' : '#64748b', textDecoration: 'none' }}>AI Legal Specialist</Link>
        </nav>
      </div>

      {/* สลับระหว่าง ปุ่มเข้าสู่ระบบ กับ โปรไฟล์ชื่อ-นามสกุลจริง */}
      <div>
        {activeUser && activeUser.isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                backgroundColor: '#f4f9f5',
                padding: '5px 16px 5px 6px',
                borderRadius: '9999px',
                border: '1.5px solid #b7e4c7',
                transition: 'all 0.2s ease'
              }}
            >
              {activeUser.avatar ? (
                <img
                  src={activeUser.avatar}
                  alt="Profile Avatar"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #1b4332' }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#1b4332',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '800'
                }}>
                  {displayName.charAt(0)}
                </div>
              )}

              {/* แสดงชื่อ-นามสกุลที่ผูกกับอีเมล */}
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1b4332' }}>
                {displayName}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '7px 14px',
                backgroundColor: '#fff0f0',
                color: '#e63946',
                border: '1px solid #ffcdd2',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              ออกจากระบบ
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/login"
              style={{
                padding: '8px 18px',
                backgroundColor: '#1b4332',
                color: '#ffffff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '13px'
              }}
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              style={{
                padding: '8px 18px',
                backgroundColor: '#ffffff',
                color: '#1b4332',
                border: '1.5px solid #1b4332',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '13px'
              }}
            >
              ลงทะเบียน
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc', color: '#1e293b' }}>
        <AppProvider>
          <Navbar />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}