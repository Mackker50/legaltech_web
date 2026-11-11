'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function RegisterPage() {
  const context = useAppContext() || {};
  const { login } = context;

  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    address: '',
    taxId: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EXPORTER'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (login) login(data.user);
        localStorage.setItem('user_session', JSON.stringify(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));

        window.location.href = '/workspace';
      } else {
        setError(data.message || 'กรุณากรอกข้อมูลให้ถูกต้องครบถ้วน');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อระบบเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f8f9fa', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '580px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e9ecef' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌾</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1b4332', margin: '0 0 6px 0' }}>
            ลงทะเบียนผู้ใช้งาน AgriLegal Pro
          </h1>
          <p style={{ fontSize: '13px', color: '#6c757d', margin: 0 }}>
            กรอกข้อมูลประจำตัวและที่อยู่เพื่อเปิดบัญชีผู้ส่งออก/ผู้ประกอบการ
          </p>
        </div>

        {error && (
          <div style={{ marginBottom: '20px', padding: '12px 14px', borderRadius: '8px', fontSize: '13px', backgroundColor: '#fff0f0', color: '#e63946', border: '1px solid #ffcdd2', fontWeight: '600' }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          {/* ชื่อ-สกุล */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              ชื่อ - นามสกุล (หรือชื่อบริษัท) <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="นายสมชาย ใจดี / บริษัท ไทย อกริ จำกัด"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* วันเดือนปีเกิด */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              วัน/เดือน/ปีเกิด <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
            />
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              เบอร์โทรศัพท์ <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="0812345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* เลขประจำตัวผู้เสียภาษี Tax ID */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              เลขประจำตัวผู้เสียภาษี (Tax ID / เลขบัตรประชาชน) <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เลข 13 หลัก เช่น 0105556000000"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* ข้อมูลที่อยู่ */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              ที่อยู่ปัจจุบัน / ที่ตั้งสถานประกอบการ <span style={{ color: '#e63946' }}>*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          {/* อีเมล */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              อีเมลสำหรับเข้าสู่ระบบ <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* รหัสผ่าน */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              รหัสผ่าน <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="password"
              required
              placeholder="อย่างน้อย 6 ตัวอักษร"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* ยืนยันรหัสผ่าน */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              ยืนยันรหัสผ่าน <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="password"
              required
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
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
              {loading ? '⚡ กำลังบันทึกข้อมูล...' : 'ยืนยันการลงทะเบียน'}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#6c757d' }}>
          มีบัญชีผู้ใช้อยู่แล้ว?{' '}
          <Link href="/login" style={{ color: '#1b4332', fontWeight: '700', textDecoration: 'none' }}>
            เข้าสู่ระบบที่นี่
          </Link>
        </div>

      </div>
    </div>
  );
}