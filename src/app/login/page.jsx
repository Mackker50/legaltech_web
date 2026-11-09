'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
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
        setMessage({ type: 'success', text: '✅ เข้าสู่ระบบสำเร็จ! กำลังพาคุณไปยัง Workspace...' });
        
        // บันทึก Session ข้อมูลผู้ใช้ เพื่อให้ Navbar อัปเดตสถานะทันที
        localStorage.setItem('user_session', JSON.stringify(data.user));

        setTimeout(() => {
          window.location.href = '/workspace';
        }, 1200);
      } else {
        setMessage({ type: 'error', text: '❌ ' + (data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง') });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌾</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1d1d1f', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            เข้าสู่ระบบ AgriLegal Pro
          </h1>
          <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
            ยินดีต้อนรับกลับ แพลตฟอร์มบริหารสัญญาส่งออกเกษตร
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            style={{
              marginBottom: '24px',
              padding: '14px 16px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: message.type === 'success' ? '#eefbdf' : '#ffebeb',
              color: message.type === 'success' ? '#297a00' : '#d70015',
              border: `1px solid ${message.type === 'success' ? 'rgba(41, 122, 0, 0.15)' : 'rgba(215, 0, 21, 0.15)'}`,
            }}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
              อีเมลธุรกิจ <span style={{ color: '#d70015' }}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#1d1d1f', margin: 0 }}>
                รหัสผ่าน <span style={{ color: '#d70015' }}>*</span>
              </label>
            </div>
            <input
              type="password"
              required
              placeholder="กรอกรหัสผ่านของคุณ"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px',
              padding: '14px',
              borderRadius: '980px',
              backgroundColor: '#0071e3',
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⚡ กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#86868b' }}>
          ยังไม่มีบัญชีผู้ใช้?{' '}
          <Link href="/register" style={{ color: '#0071e3', fontWeight: '500', textDecoration: 'none' }}>
            สร้างบัญชีใหม่ที่นี่
          </Link>
        </div>
      </div>
    </div>
  );
}

// Inline Style Object สำหรับ Input ให้ตรงกับ Register Page
const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid #d2d2d7',
  backgroundColor: '#ffffff',
  fontSize: '14px',
  color: '#1d1d1f',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
};