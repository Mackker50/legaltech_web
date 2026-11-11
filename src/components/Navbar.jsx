'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const router = useRouter();
  const context = useAppContext() || {};
  const { user, logout } = context;

  const [currentUser, setCurrentUser] = useState(null);

  // ดึงข้อมูลผู้ใช้จาก Context หรือ LocalStorage
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else {
      const saved = localStorage.getItem('user_session') || localStorage.getItem('user');
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
      }
    }
  }, [user]);

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('user_session');
    localStorage.removeItem('user');
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, fontFamily: "'Prompt', sans-serif" }}>
      
      {/* Brand Logo & Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🌱</span>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#1b4332' }}>AgriLegal</span>
          <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#e9f5ed', color: '#1b4332', padding: '2px 6px', borderRadius: '4px' }}>PRO</span>
        </Link>

        <nav style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: '600' }}>
          <Link href="/" style={{ color: '#1b4332', textDecoration: 'none' }}>หน้าหลัก</Link>
          <Link href="/workspace" style={{ color: '#64748b', textDecoration: 'none' }}>Workspace </Link>
          <Link href="/status" style={{ color: '#64748b', textDecoration: 'none' }}>ประวัติการทำธุรกรรม</Link>
          <Link href="/documents" style={{ color: '#64748b', textDecoration: 'none' }}>คลังเอกสาร</Link>
          <Link href="/ai-legal" style={{ color: '#64748b', textDecoration: 'none' }}>AI Legal </Link>
        </nav>
      </div>

      {/* Auth Zone: สลับระหว่าง Login/Register กับ User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentUser ? (
          // เมื่อล็อกอินแล้ว -> แสดงโปรไฟล์และปุ่มออกจากระบบ
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link
              href="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                backgroundColor: '#f4f9f5',
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid #b7e4c7'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#1b4332', color: '#e9c46a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : '👤'}
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1b4332' }}>
                {currentUser.fullName || currentUser.name || currentUser.email?.split('@')[0]}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '7px 14px',
                backgroundColor: '#f8fafc',
                color: '#e63946',
                border: '1px solid #fee2e2',
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
          // เมื่อยังไม่ล็อกอิน -> แสดงปุ่มเข้าสู่ระบบ และ ลงทะเบียน
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href="/login"
              style={{
                padding: '8px 18px',
                backgroundColor: '#0071e3',
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
                color: '#0071e3',
                border: '1px solid #0071e3',
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