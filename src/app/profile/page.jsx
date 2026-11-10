'use client';

export const dynamic = 'force-dynamic';

import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const context = useAppContext() || {};
  const { theme, lang, user, logout, login } = context;

  const currentTheme = theme || {
    cardBg: '#ffffff',
    textMain: '#1d1d1f',
    textSub: '#86868b',
    border: '#d2d2d7',
    inputBg: '#fafafa',
    link: '#0071e3',
    shadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  if (!user) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: currentTheme.textMain }}>
        <h2>{lang === 'en' ? 'Please sign in first' : 'กรุณาเข้าสู่ระบบก่อนใช้งาน'}</h2>
        <button 
          onClick={() => router.push('/login')}
          style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '980px', backgroundColor: currentTheme.link, color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {lang === 'en' ? 'Go to Login' : 'ไปยังหน้าเข้าสู่ระบบ'}
        </button>
      </div>
    );
  }

  const handleRoleChange = (newRole) => {
    const updatedUser = { ...user, role: newRole };
    login(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('user_session', JSON.stringify(updatedUser));
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: currentTheme.textMain }}>
        {lang === 'en' ? '👤 User Profile' : '👤 โปรไฟล์ผู้ใช้งาน'}
      </h1>
      <p style={{ color: currentTheme.textSub, marginBottom: '24px' }}>
        {lang === 'en' ? 'Manage your account and role-based permissions.' : 'จัดการข้อมูลส่วนตัวและสิทธิ์การเข้าถึงข้อมูลตามบทบาท'}
      </p>

      {/* Profile Card */}
      <div style={{ backgroundColor: currentTheme.cardBg, padding: '24px', borderRadius: '20px', border: `1px solid ${currentTheme.border}`, boxShadow: currentTheme.shadow, marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: currentTheme.link, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <h3 style={{ fontSize: '20px', margin: '0 0 4px 0', color: currentTheme.textMain }}>{user.name || 'User'}</h3>
            <p style={{ margin: 0, color: currentTheme.textSub, fontSize: '14px' }}>{user.email}</p>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${currentTheme.border}`, paddingTop: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: currentTheme.textMain, marginBottom: '8px' }}>
            {lang === 'en' ? 'Current Role' : 'บทบาทปัจจุบันในระบบ'}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {[
              { id: 'EXPORTER', th: '📦 ผู้ส่งออก', en: 'Exporter' },
              { id: 'FARMER', th: '🌾 เกษตรกร', en: 'Farmer' },
              { id: 'OFFICER', th: '🏛️ เจ้าหน้าที่', en: 'Officer' },
              { id: 'BUYER', th: '🌐 ผู้ซื้อต่างประเทศ', en: 'Buyer' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  border: (user.role || 'EXPORTER') === r.id ? `2px solid ${currentTheme.link}` : `1px solid ${currentTheme.border}`,
                  backgroundColor: (user.role || 'EXPORTER') === r.id ? currentTheme.inputBg : 'transparent',
                  color: currentTheme.textMain,
                  fontWeight: (user.role || 'EXPORTER') === r.id ? '600' : '400',
                  cursor: 'pointer',
                }}
              >
                {lang === 'en' ? r.en : r.th}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          logout();
          window.location.href = '/';
        }}
        style={{ width: '100%', padding: '14px', borderRadius: '12px', backgroundColor: '#ff3b30', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}
      >
        {lang === 'en' ? 'Sign Out' : 'ออกจากระบบ'}
      </button>
    </div>
  );
}