'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RootLayout({ children }) {
  // 1. State สถานะการล็อกอินและโปรไฟล์
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [userProfile] = useState({
    name: 'ฐิติพงศ์ ลีลาจิรวัฒน์',
    role: 'ผู้ส่งออก (Exporter)',
    email: 'thitipong@agrilegal.co.th',
    taxId: '0105561000000',
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          /* Global CSS Reset & Responsive Rules */
          * { box-sizing: border-box; }
          
          /* Desktop Navigation Links */
          .nav-desktop-links {
            display: flex;
            gap: 28px;
            font-size: 14px;
            align-items: center;
          }

          .nav-mobile-toggle {
            display: none;
          }

          .nav-mobile-menu {
            display: none;
          }

          /* Tablet & Mobile Screens (ความกว้างน้อยกว่า 768px) */
          @media (max-width: 768px) {
            .nav-desktop-links {
              display: none; /* ซ่อนเมนูกลางบนมือถือ */
            }

            .nav-mobile-toggle {
              display: block; /* แสดงปุ่ม Hamburger */
            }

            .nav-container {
              padding: 0 16px !important;
            }

            .main-container {
              padding: 20px 16px 60px !important;
            }

            /* แสดงเมนูมือถือแบบพับเก็บ */
            .nav-mobile-menu {
              display: flex;
              flex-direction: column;
              gap: 16px;
              background-color: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              position: absolute;
              top: 54px;
              left: 0;
              width: 100%;
              padding: 20px 24px;
              border-bottom: 1px solid rgba(0, 0, 0, 0.08);
              box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            }
          }
        `}</style>
      </head>

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
        {/* Apple Glassmorphism Responsive Navbar */}
        <nav
          className="nav-container"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '0 32px',
            height: '54px',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* 1. Left: Brand Logo */}
          <div style={{ flex: '0 0 auto' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#1d1d1f', letterSpacing: '-0.02em' }}>
                🌾 AgriLegal
              </span>
              <span style={{ fontSize: '10px', fontWeight: '600', color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                PRO
              </span>
            </Link>
          </div>

          {/* 2. Center: Desktop Menu Links */}
          <div className="nav-desktop-links">
            <Link href="/" style={{ color: '#1d1d1f', textDecoration: 'none' }}>หน้าหลัก</Link>
            <Link href="/workspace" style={{ color: '#424245', textDecoration: 'none' }}>Workspace ดีล</Link>
            <Link href="/status" style={{ color: '#424245', textDecoration: 'none' }}>สถานะส่งออก</Link>
            <Link href="/documents" style={{ color: '#424245', textDecoration: 'none' }}>คลังเอกสาร</Link>
            <Link href="/ai-legal" style={{ color: '#424245', textDecoration: 'none' }}>AI Legal Specialist</Link>
          </div>

          {/* 3. Right: Profile Actions & Mobile Toggle */}
          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            {isLoggedIn ? (
              <div>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    backgroundColor: '#e8f2fc',
                    border: '1px solid rgba(0, 113, 227, 0.2)',
                    borderRadius: '980px',
                    padding: '4px 10px 4px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: '#0071e3',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                    }}
                  >
                    TL
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>
                    {userProfile.name.split(' ')[0]}
                  </span>
                </button>

                {/* Profile Popover Menu */}
                {showProfileMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '42px',
                      width: '250px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      display: 'grid',
                      gap: '10px',
                      zIndex: 10000,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1d1d1f' }}>{userProfile.name}</div>
                      <div style={{ fontSize: '12px', color: '#0071e3', fontWeight: '500' }}>{userProfile.role}</div>
                      <div style={{ fontSize: '11px', color: '#86868b', marginTop: '2px' }}>Tax ID: {userProfile.taxId}</div>
                    </div>
                    <div style={{ borderTop: '1px solid #f5f5f7', paddingTop: '8px', display: 'grid', gap: '6px' }}>
                      <button
                        onClick={handleLogout}
                        style={{ textAlign: 'left', background: 'none', border: 'none', padding: '6px 0', fontSize: '13px', color: '#d70015', fontWeight: '500', cursor: 'pointer' }}
                      >
                        🚪 ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/login" style={{ backgroundColor: '#0071e3', color: '#fff', padding: '6px 14px', borderRadius: '980px', fontSize: '13px', textDecoration: 'none' }}>
                  เข้าสู่ระบบ
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#1d1d1f',
                padding: '4px',
              }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Dropdown Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="nav-mobile-menu">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>หน้าหลัก</Link>
              <Link href="/workspace" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Workspace ดีล</Link>
              <Link href="/status" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>สถานะส่งออก</Link>
              <Link href="/documents" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>คลังเอกสาร</Link>
              <Link href="/ai-legal" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1d1d1f', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>AI Legal Specialist</Link>
            </div>
          )}
        </nav>

        {/* Main Fluid Responsive Container */}
        <main className="main-container" style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 20px 80px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}