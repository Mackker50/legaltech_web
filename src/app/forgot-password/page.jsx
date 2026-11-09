'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ email: '', taxId: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '✅ ' + data.message });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: '❌ ' + (data.message || data.error) });
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔑</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1d1d1f', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
            ตั้งรหัสผ่านใหม่
          </h1>
          <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
            ยืนยันตัวตนด้วยอีเมลและเลขผู้เสียภาษีเพื่อกำหนดรหัสผ่านใหม่
          </p>
        </div>

        {message && (
          <div
            style={{
              marginBottom: '24px',
              padding: '14px 16px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              backgroundColor: message.type === 'success' ? '#eefbdf' : '#ffebeb',
              color: message.type === 'success' ? '#297a00' : '#d70015',
              border: `1px solid ${message.type === 'success' ? 'rgba(41, 122, 0, 0.15)' : 'rgba(215, 0, 21, 0.15)'}`,
            }}
          >
            {message.text}
          </div>
        )}

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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
              เลขผู้เสียภาษี (Tax ID) ที่ลงทะเบียนไว้ <span style={{ color: '#d70015' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="13 หลัก"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
              รหัสผ่านใหม่ <span style={{ color: '#d70015' }}>*</span>
            </label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="อย่างน้อย 8 ตัวอักษร"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⚡ กำลังอัปเดตรหัสผ่าน...' : 'บันทึกรหัสผ่านใหม่'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#86868b' }}>
          จำรหัสผ่านได้แล้ว?{' '}
          <Link href="/login" style={{ color: '#0071e3', fontWeight: '500', textDecoration: 'none' }}>
            กลับไปเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}

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
};