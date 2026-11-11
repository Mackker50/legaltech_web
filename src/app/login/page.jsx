'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function LoginPage() {
  const context = useAppContext() || {};
  const { login } = context;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (login) login(data.user);
        localStorage.setItem('user_session', JSON.stringify(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));

        // เข้าสู่ระบบสำเร็จ -> กลับไปยังหน้า Workspace ดีล
        window.location.href = '/workspace';
      } else {
        setError(data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อระบบได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f8f9fa', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e9ecef' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌾</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1b4332', margin: '0 0 6px 0' }}>
            เข้าสู่ระบบ AgriLegal Pro
          </h1>
          <p style={{ fontSize: '13px', color: '#6c757d', margin: 0 }}>
            กรอกข้อมูลเพื่อเข้าสู่ระบบบริหารสัญญาส่งออก
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: '20px', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', backgroundColor: '#fff0f0', color: '#e63946', border: '1px solid #ffcdd2', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              อีเมลธุรกิจ <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              รหัสผ่าน <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="password"
              required
              placeholder="กรอกรหัสผ่าน"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '8px',
              backgroundColor: '#1b4332',
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(27,67,50,0.2)'
            }}
          >
            {loading ? '⚡ กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6c757d' }}>
          ยังไม่มีบัญชีผู้ใช้?{' '}
          <Link href="/register" style={{ color: '#1b4332', fontWeight: '700', textDecoration: 'none' }}>
            สร้างบัญชีใหม่ที่นี่
          </Link>
        </div>

      </div>
    </div>
  );
}