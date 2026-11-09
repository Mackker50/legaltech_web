'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: '✅ เข้าสู่ระบบสำเร็จ กำลังนำคุณไปหน้า Workspace...' });
        setTimeout(() => {
          window.location.href = '/workspace';
        }, 1200);
      } else {
        setMessage({ type: 'error', text: '❌ ' + data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ไม่สามารถเชื่อมต่อระบบได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <h1 style={{ fontSize: '26px', fontWeight: '600', color: '#1d1d1f', textAlign: 'center', margin: '0 0 8px 0' }}>
          เข้าสู่ระบบ
        </h1>
        <p style={{ fontSize: '14px', color: '#86868b', textAlign: 'center', margin: '0 0 28px 0' }}>
          AgriLegal Pro — Export Platform
        </p>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>อีเมล (Email):</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>รหัสผ่าน (Password):</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0071e3',
              color: '#fff',
              border: 'none',
              borderRadius: '980px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '8px',
              boxShadow: '0 4px 12px rgba(0,113,227,0.25)'
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', fontSize: '13px', backgroundColor: message.type === 'success' ? '#eefbdf' : '#ffebeb', color: message.type === 'success' ? '#297a00' : '#d70015' }}>
            {message.text}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#86868b' }}>
          ยังไม่มีบัญชี? <Link href="/register" style={{ color: '#0071e3', textDecoration: 'none' }}>ลงทะเบียนได้ที่นี่</Link>
        </div>
      </div>
    </div>
  );
}