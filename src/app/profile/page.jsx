'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [editForm, setEditForm] = useState({
    fullName: '',
    birthDate: '',
    address: '',
    taxId: '',
    phone: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user_session') || localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        fetchUserData(parsed.email);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchUserData = async (email) => {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setEditForm({
          fullName: data.user.fullName || data.user.name || '',
          birthDate: data.user.birthDate || '',
          address: data.user.address || '',
          taxId: data.user.taxId || '',
          phone: data.user.phone || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          ...editForm
        })
      });

      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user_session', JSON.stringify(data.user));
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage({ type: 'success', text: '✅ อัปเดตข้อมูลโปรไฟล์เรียบร้อยแล้ว' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: data.message || 'เกิดข้อผิดพลาดในการอัปเดต' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Prompt', sans-serif" }}>
        <div style={{ fontSize: '18px', color: '#1b4332', fontWeight: '700', marginBottom: '16px' }}>
          กรุณาเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์
        </div>
        <Link href="/login" style={{ padding: '10px 24px', backgroundColor: '#1b4332', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '700' }}>
          ไปยังหน้าเข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '90vh', padding: '40px 20px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Banner */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '12px', borderLeft: '6px solid #1b4332', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1b4332', color: '#e9c46a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : '👤'}
            </div>
            <div>
              <h1 style={{ fontSize: '22px', color: '#1b4332', fontWeight: '800', margin: '0 0 4px 0' }}>
                {user.fullName || user.name}
              </h1>
              <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', backgroundColor: '#d8f3dc', color: '#1b4332' }}>
                บทบาท: {user.role === 'EXPORTER' ? '🧑‍💼 ผู้ส่งออก (Exporter)' : user.role === 'MIDDLEMAN' ? '👨‍🌾 ผู้รวบรวมสินค้า' : '🏢 ผู้ซื้อต่างประเทศ'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{ padding: '10px 18px', backgroundColor: isEditing ? '#6c757d' : '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
          >
            {isEditing ? 'ยกเลิกการแก้ไข' : '✏️ แก้ไขข้อมูลส่วนตัว'}
          </button>
        </div>

        {message && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', backgroundColor: message.type === 'success' ? '#d8f3dc' : '#fff0f0', color: message.type === 'success' ? '#1b4332' : '#e63946', border: `1px solid ${message.type === 'success' ? '#b7e4c7' : '#ffcdd2'}` }}>
            {message.text}
          </div>
        )}

        {/* User Info Details Box */}
        {!isEditing ? (
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '17px', color: '#1b4332', fontWeight: '700', margin: '0 0 20px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
              📋 รายละเอียดข้อมูลส่วนบุคคลและองค์กร
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '4px' }}>ชื่อ - นามสกุล / ชื่อบริษัท:</span>
                <strong style={{ color: '#1b4332', fontSize: '15px' }}>{user.fullName || user.name || '-'}</strong>
              </div>

              <div>
                <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '4px' }}>วัน/เดือน/ปีเกิด:</span>
                <strong style={{ color: '#1b4332', fontSize: '15px' }}>{user.birthDate || '-'}</strong>
              </div>

              <div>
                <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '4px' }}>เบอร์โทรศัพท์ติดต่อ:</span>
                <strong style={{ color: '#1b4332', fontSize: '15px' }}>{user.phone || '-'}</strong>
              </div>

              <div>
                <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '4px' }}>อีเมลธุรกิจ:</span>
                <strong style={{ color: '#1b4332', fontSize: '15px' }}>{user.email}</strong>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '4px' }}>เลขประจำตัวผู้เสียภาษี (Tax ID / เลขบัตรประชาชน):</span>
                <strong style={{ color: '#1b4332', fontSize: '15px' }}>{user.taxId || '-'}</strong>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '4px' }}>ที่อยู่ปัจจุบัน / สถานประกอบการ:</span>
                <div style={{ color: '#212529', lineHeight: '1.6', backgroundColor: '#f8f9fa', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                  {user.address || '-'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleUpdate} style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #e9ecef', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <h3 style={{ gridColumn: 'span 2', fontSize: '17px', color: '#1b4332', fontWeight: '700', margin: '0 0 8px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
              ✏️ แก้ไขข้อมูลโปรไฟล์
            </h3>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อ-นามสกุล / บริษัท</label>
              <input type="text" required value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>วัน/เดือน/ปีเกิด</label>
              <input type="date" required value={editForm.birthDate} onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>เบอร์โทรศัพท์</label>
              <input type="tel" required value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
              <input type="text" required value={editForm.taxId} onChange={(e) => setEditForm({ ...editForm, taxId: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', boxSizing: 'border-box' }} />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ที่อยู่</label>
              <textarea rows={3} required value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>

            <div style={{ gridColumn: 'span 2', textAlign: 'right', marginTop: '12px' }}>
              <button type="submit" disabled={loading} style={{ padding: '12px 28px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'บันทึกข้อมูล...' : '💾 บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}