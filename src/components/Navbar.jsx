'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const context = useAppContext() || {};
  const { theme, lang, setLang, user: contextUser, logout } = context;
  const [currentUser, setCurrentUser] = useState(null);

  const currentTheme = theme || {
    glassBg: 'rgba(255, 255, 255, 0.8)',
    textMain: '#1d1d1f',
    textSub: '#86868b',
    border: '#e5e5ea',
    inputBg: '#fafafa',
    link: '#0071e3',
  };

  useEffect(() => {
    if (contextUser) {
      setCurrentUser(contextUser);
    } else {
      const savedUser = localStorage.getItem('user_session') || localStorage.getItem('user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, [contextUser]);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: currentTheme.glassBg,
      borderBottom: `1px solid ${currentTheme.border}`,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo & Main Nav */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: '700', fontSize: '19px', textDecoration: 'none', color: currentTheme.textMain, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🌱</span> AgriLegal Pro
          </Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/documents" style={{ textDecoration: 'none', color: currentTheme.textSub, fontSize: '14px', fontWeight: '500' }}>คลังเอกสาร</Link>
            <Link href="/certificates" style={{ textDecoration: 'none', color: currentTheme.textSub, fontSize: '14px', fontWeight: '500' }}>ใบรับรอง</Link>
            <Link href="/hs-classifier" style={{ textDecoration: 'none', color: currentTheme.textSub, fontSize: '14px', fontWeight: '500' }}>HS Code</Link>
            <Link href="/supply-chain" style={{ textDecoration: 'none', color: currentTheme.textSub, fontSize: '14px', fontWeight: '500' }}>Supply Chain</Link>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <button
            onClick={() => setLang && setLang(lang === 'th' ? 'en' : 'th')}
            style={{ padding: '6px 12px', borderRadius: '980px', border: `1px solid ${currentTheme.border}`, background: 'transparent', color: currentTheme.textMain, cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
          >
            {lang === 'th' ? 'EN' : 'TH'}
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/workspace" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: '980px',
                  backgroundColor: currentTheme.inputBg,
                  border: `1px solid ${currentTheme.border}`,
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: currentTheme.link,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '12px'
                  }}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: currentTheme.textMain }}>
                    {currentUser.name || 'ผู้ใช้งาน'}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('user_session');
                  localStorage.removeItem('user');
                  if (logout) logout();
                  setCurrentUser(null);
                  window.location.href = '/';
                }}
                style={{ padding: '6px 14px', borderRadius: '980px', border: 'none', backgroundColor: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/login" style={{ padding: '8px 18px', borderRadius: '980px', textDecoration: 'none', color: currentTheme.textMain, border: `1px solid ${currentTheme.border}`, fontSize: '14px', fontWeight: '500' }}>
                {lang === 'en' ? 'Sign In' : 'เข้าสู่ระบบ'}
              </Link>
              <Link href="/register" style={{ padding: '8px 18px', borderRadius: '980px', textDecoration: 'none', backgroundColor: currentTheme.link, color: '#ffffff', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,113,227,0.25)' }}>
                {lang === 'en' ? 'Register' : 'สร้างบัญชี'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}