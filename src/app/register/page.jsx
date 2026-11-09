'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    taxId: '',
    role: 'EXPORTER',
  });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: '✅ ลงทะเบียนสำเร็จ! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        setStatusMsg({ type: 'error', text: '❌ ' + (data.message || data.error) });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: '❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
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
            สร้างบัญชี AgriLegal Pro
          </h1>
          <p style={{ fontSize: '14px', color: '#86868b', margin: 0 }}>
            เริ่มต้นจัดการสัญญาส่งออกและเอกสารกฎหมายการค้าเกษตร
          </p>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            style={{
              marginBottom: '24px',
              padding: '14px 16px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: statusMsg.type === 'success' ? '#eefbdf' : '#ffebeb',
              color: statusMsg.type === 'success' ? '#297a00' : '#d70015',
              border: `1px solid ${statusMsg.type === 'success' ? 'rgba(41, 122, 0, 0.15)' : 'rgba(215, 0, 21, 0.15)'}`,
            }}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* ชื่อ - นามสกุล */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
                ชื่อจริง <span style={{ color: '#d70015' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="สมชาย"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
                นามสกุล <span style={{ color: '#d70015' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="ใจดี"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* บทบาทผู้ใช้งาน (Role) */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
              ประเภทธุรกิจ / บทบาทในระบบ
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ ...inputStyle, backgroundColor: '#f5f5f7', cursor: 'pointer' }}
            >
              <option value="EXPORTER">🚢 ผู้ส่งออกสินค้าเกษตร (Exporter)</option>
              <option value="FARMER">🚜 เกษตรกร / สหกรณ์การเกษตร (Farmer / Co-op)</option>
              <option value="BUYER">🏢 ผู้ซื้อต่างประเทศ (Overseas Buyer)</option>
              <option value="TRANSPORTER">🚚 ผู้ให้บริการขนส่ง / Forwarder</option>
            </select>
          </div>

          {/* อีเมล */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
              อีเมลธุรกิจ <span style={{ color: '#d70015' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* รหัสผ่าน */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
              รหัสผ่าน <span style={{ color: '#d70015' }}>*</span>
            </label>
            <input
              type="password"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* เบอร์โทรศัพท์ & Tax ID */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                placeholder="081-234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#1d1d1f', marginBottom: '6px' }}>
                เลขผู้เสียภาษี (Tax ID)
              </label>
              <input
                type="text"
                placeholder="13 หลัก"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Submit Button */}
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
            {loading ? '⚡ กำลังสร้างบัญชีผู้ใช้...' : 'ยืนยันลงทะเบียน'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '13px', color: '#86868b' }}>
          มีบัญชีผู้ใช้อยู่แล้ว?{' '}
          <Link href="/login" style={{ color: '#0071e3', fontWeight: '500', textDecoration: 'none' }}>
            เข้าสู่ระบบที่นี่
          </Link>
        </div>
      </div>
    </div>
  );
}

// Inline Style Object สำหรับ Input
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