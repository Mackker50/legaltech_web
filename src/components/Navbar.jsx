'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const context = useAppContext() || {};
  const { lang, setLang, user: contextUser, logout } = context;
  const [currentUser, setCurrentUser] = useState(null);

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
    <header style={{ width: '100%', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      {/* Top Bar - สีเขียวเข้มทึบ */}
      <div style={{ backgroundColor: '#081c15', color: '#ffffff', padding: '6px 32px', fontSize: '12px' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>🌱 แพลตฟอร์มบริหารจัดการกฎหมายและเอกสารส่งออกสินค้าเกษตร (AgriLegal Pro)</div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={() => setLang && setLang(lang === 'th' ? 'en' : 'th')}
              style={{ background: 'transparent', border: 'none', color: '#e9c46a', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {lang === 'th' ? 'TH | EN' : 'EN | TH'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar - ขาวเนียน ตัดเส้นเหลืองทอง */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '3px solid #e9c46a', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', width: '100%' }}>
        <div style={{ width: '100%', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
          
          {/* Logo Brand */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', backgroundColor: '#1b4332', borderRadius: '8px', color: '#e9c46a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
              🌾
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1b4332', letterSpacing: '-0.5px' }}>AgriLegal Pro</div>
              <div style={{ fontSize: '10px', color: '#52b788', letterSpacing: '0.5px', fontWeight: '700' }}>EXPORT COMPLIANCE PORTAL</div>
            </div>
          </Link>

          {/* Navigation Links ส่วนรวม */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#1b4332', fontSize: '14px', fontWeight: '600' }}>หน้าหลัก</Link>
            <Link href="/workspace" style={{ textDecoration: 'none', color: '#1b4332', fontSize: '14px', fontWeight: '600' }}>Workspace ดีล</Link>
            <Link href="/supply-chain" style={{ textDecoration: 'none', color: '#1b4332', fontSize: '14px', fontWeight: '600' }}>สถานะส่งออก</Link>
            <Link href="/documents" style={{ textDecoration: 'none', color: '#1b4332', fontSize: '14px', fontWeight: '600' }}>คลังเอกสาร</Link>
            <Link href="/ai-legal" style={{ textDecoration: 'none', color: '#1b4332', fontSize: '14px', fontWeight: '600' }}>AI Legal Specialist</Link>
          </div>

          {/* User Auth Buttons */}
          <div>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '6px', backgroundColor: '#f4f9f5', border: '1px solid #d8f3dc' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#1b4332', color: '#e9c46a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1b4332' }}>
                    {currentUser.name || 'ผู้ใช้งาน'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('user_session');
                    localStorage.removeItem('user');
                    if (logout) logout();
                    setCurrentUser(null);
                    window.location.href = '/';
                  }}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#e63946', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/login" style={{ padding: '8px 18px', borderRadius: '6px', textDecoration: 'none', color: '#1b4332', border: '1.5px solid #1b4332', fontSize: '13px', fontWeight: '700' }}>
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register" style={{ padding: '8px 18px', borderRadius: '6px', textDecoration: 'none', backgroundColor: '#1b4332', color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>
                  ลงทะเบียน
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}