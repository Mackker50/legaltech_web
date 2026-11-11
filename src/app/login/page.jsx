'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          isLoggedIn: true
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        // เด้งกลับหน้าหลักและรีเฟรชข้อมูล Navbar
        router.push('/');
        router.refresh();
      } else {
        setErrorMsg(data.message || 'อีเมลไม่ถูกต้อง');
      }
    } catch (err) {
      setErrorMsg('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#f8fafc', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '38px', marginBottom: '8px' }}>🌾</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1b4332', margin: '0 0 6px 0' }}>
            เข้าสู่ระบบ AgriLegal Pro
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          </p>
        </div>

        {errorMsg && (
          <div style={{ marginBottom: '18px', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', backgroundColor: '#fff0f0', color: '#e63946', border: '1px solid #ffcdd2', fontWeight: '600' }}>
            ❌ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              อีเมลผู้ใช้งาน
            </label>
            <input
              type="email"
              required
              placeholder="กรอกอีเมลของคุณ..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              รหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '10px',
              backgroundColor: '#1b4332',
              color: '#ffffff',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              boxShadow: '0 4px 12px rgba(27,67,50,0.2)'
            }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#64748b' }}>
          <Link href="/" style={{ color: '#1b4332', fontWeight: '700', textDecoration: 'none' }}>
            ← กลับหน้าหลัก
          </Link>
        </div>

      </div>
    </div>
  );
}