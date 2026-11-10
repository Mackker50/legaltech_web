'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function LoginPage() {
  const context = useAppContext() || {};
  const { theme, lang, login } = context;

  const currentTheme = theme || {
    cardBg: '#ffffff',
    textMain: '#1d1d1f',
    textSub: '#86868b',
    border: '#d2d2d7',
    inputBg: '#ffffff',
    inputBorder: '#d2d2d7',
    link: '#0071e3',
    shadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
  };

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: lang === 'en' ? '✅ Login successful! Redirecting to home...' : '✅ เข้าสู่ระบบสำเร็จ! กำลังพาคุณไปยังหน้าหลัก...' });
        
        if (login) login(data.user);
        localStorage.setItem('user_session', JSON.stringify(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));

        // เด้งไปยังหน้าหลัก "/" ทันทีเพื่อให้ Navbar เปลี่ยนปุ่มเป็นโปรไฟล์
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        setMessage({ type: 'error', text: '❌ ' + (data.message || (lang === 'en' ? 'Invalid email or password' : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')) });
      }
    } catch (err) {
      setMessage({ type: 'error', text: lang === 'en' ? '❌ Cannot connect to server' : '❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: currentTheme.cardBg,
          borderRadius: '28px',
          padding: '40px',
          boxShadow: currentTheme.shadow,
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🌾</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: currentTheme.textMain, margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            {lang === 'en' ? 'Sign in to AgriLegal Pro' : 'เข้าสู่ระบบ AgriLegal Pro'}
          </h1>
          <p style={{ fontSize: '14px', color: currentTheme.textSub, margin: 0, lineHeight: '1.4' }}>
            {lang === 'en' ? 'Welcome back to agricultural export compliance platform' : 'ยินดีต้อนรับกลับ แพลตฟอร์มบริหารสัญญาส่งออกเกษตร'}
          </p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: '24px',
              padding: '14px 16px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: message.type === 'success' ? 'rgba(41, 122, 0, 0.08)' : 'rgba(215, 0, 21, 0.08)',
              color: message.type === 'success' ? '#297a00' : '#d70015',
              border: `1px solid ${message.type === 'success' ? 'rgba(41, 122, 0, 0.2)' : 'rgba(215, 0, 21, 0.2)'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: currentTheme.textMain, marginBottom: '6px' }}>
              {lang === 'en' ? 'Business Email' : 'อีเมลธุรกิจ'} <span style={{ color: '#d70015' }}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: `1px solid ${currentTheme.inputBorder}`,
                backgroundColor: currentTheme.inputBg,
                fontSize: '14px',
                color: currentTheme.textMain,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: currentTheme.textMain, margin: 0 }}>
                {lang === 'en' ? 'Password' : 'รหัสผ่าน'} <span style={{ color: '#d70015' }}>*</span>
              </label>
              <Link href="/forgot-password" style={{ fontSize: '12px', color: currentTheme.link, textDecoration: 'none', fontWeight: '500' }}>
                {lang === 'en' ? 'Forgot password?' : 'ลืมรหัสผ่าน?'}
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder={lang === 'en' ? 'Enter your password' : 'กรอกรหัสผ่านของคุณ'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                border: `1px solid ${currentTheme.inputBorder}`,
                backgroundColor: currentTheme.inputBg,
                fontSize: '14px',
                color: currentTheme.textMain,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: '980px',
              backgroundColor: currentTheme.link,
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(0, 113, 227, 0.3)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (lang === 'en' ? 'Signing in...' : '⚡ กำลังเข้าสู่ระบบ...') : (lang === 'en' ? 'Sign In' : 'เข้าสู่ระบบ')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: currentTheme.textSub }}>
          {lang === 'en' ? "Don't have an account? " : 'ยังไม่มีบัญชีผู้ใช้? '}{' '}
          <Link href="/register" style={{ color: currentTheme.link, fontWeight: '600', textDecoration: 'none' }}>
            {lang === 'en' ? 'Sign up here' : 'สร้างบัญชีใหม่ที่นี่'}
          </Link>
        </div>
      </div>
    </div>
  );
}