'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserProfile(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setIsLoggedIn(false);
    setUserProfile(null);
    setShowProfileMenu(false);
    window.location.href = '/login';
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 9999, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', padding: '0 32px', height: '54px', display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '32px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#1d1d1f' }}>🌾 AgriLegal</span>
          <span style={{ fontSize: '10px', fontWeight: '600', color: '#86868b' }}>PRO</span>
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: '28px', fontSize: '14px' }}>
        <Link href="/" style={{ color: '#1d1d1f', textDecoration: 'none' }}>หน้าหลัก</Link>
        <Link href="/workspace" style={{ color: '#424245', textDecoration: 'none' }}>Workspace ดีล</Link>
        <Link href="/status" style={{ color: '#424245', textDecoration: 'none' }}>สถานะส่งออก</Link>
        <Link href="/documents" style={{ color: '#424245', textDecoration: 'none' }}>คลังเอกสาร</Link>
        <Link href="/ai-legal" style={{ color: '#424245', textDecoration: 'none' }}>AI Legal Specialist</Link>
      </div>

      <div style={{ marginLeft: 'auto', position: 'relative' }}>
        {isLoggedIn && userProfile ? (
          <div>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ backgroundColor: '#e8f2fc', border: '1px solid rgba(0, 113, 227, 0.2)', borderRadius: '980px', padding: '4px 10px 4px 6px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#0071e3', color: '#fff', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {userProfile.firstName ? userProfile.firstName[0] : 'U'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#1d1d1f' }}>{userProfile.firstName}</span>
            </button>

            {showProfileMenu && (
              <div style={{ position: 'absolute', right: 0, top: '42px', width: '240px', backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{userProfile.fullName}</div>
                <div style={{ fontSize: '12px', color: '#0071e3' }}>{userProfile.role}</div>
                <div style={{ fontSize: '11px', color: '#86868b', marginTop: '4px' }}>Tax ID: {userProfile.taxId}</div>
                <hr style={{ border: 'none', borderTop: '1px solid #f5f5f7', margin: '10px 0' }} />
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#d70015', cursor: 'pointer', padding: 0, fontSize: '13px' }}>🚪 ออกจากระบบ</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/login" style={{ backgroundColor: '#0071e3', color: '#fff', padding: '6px 16px', borderRadius: '980px', fontSize: '13px', textDecoration: 'none' }}>เข้าสู่ระบบ</Link>
            <Link href="/register" style={{ backgroundColor: '#e8f2fc', color: '#0071e3', padding: '6px 16px', borderRadius: '980px', fontSize: '13px', textDecoration: 'none' }}>ลงทะเบียน</Link>
          </div>
        )}
      </div>
    </nav>
  );
}