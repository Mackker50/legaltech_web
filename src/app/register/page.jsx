'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    taxId: '',
    email: '',
    password: '',
    role: 'EXPORTER',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
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
        setMessage({ type: 'error', text: '❌ ' + data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ไม่สามารถเชื่อมต่อระบบได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.04)'
      }}>
        <h1 style={{ fontSize: '26px', fontWeight: '600', color: '#1d1d1f', textAlign: 'center', margin: '0 0 8px 0' }}>
          สร้างบัญชีเข้าใช้งาน
        </h1>
        <p style={{ fontSize: '14px', color: '#86868b', textAlign: 'center', margin: '0 0 28px 0' }}>
          AgriLegal Workspace — ระบบธุรกรรมและสัญญาส่งออกสินค้าเกษตร
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>ชื่อ:</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>นามสกุล:</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>เลขประจำตัวผู้เสียภาษี (Tax ID):</label>
            <input
              type="text"
              required
              placeholder="เช่น 0105561000000"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>เลือกบทบาทผู้ใช้งาน:</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box', backgroundColor: '#fff' }}
            >
              <option value="EXPORTER">👨‍🌾 ผู้ส่งออก (Exporter)</option>
              <option value="MIDDLEMAN">🤝 พ่อค้าคนกลาง (Middleman)</option>
              <option value="FARMER">🧑‍🌾 เกษตรกร / กลุ่มเกษตรกร (Farmer)</option>
              <option value="FREIGHT_FORWARDER">🚢 บริษัทขนส่ง (Freight Forwarder)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>อีเมล:</label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '6px' }}>รหัสผ่าน:</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเข้าใช้งาน'}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', fontSize: '13px', backgroundColor: message.type === 'success' ? '#eefbdf' : '#ffebeb', color: message.type === 'success' ? '#297a00' : '#d70015' }}>
            {message.text}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#86868b' }}>
          มีบัญชีอยู่แล้ว? <Link href="/login" style={{ color: '#0071e3', textDecoration: 'none' }}>เข้าสู่ระบบที่นี่</Link>
        </div>
      </div>
    </div>
  );
}