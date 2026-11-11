'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    taxId: '',
    address: '',
    role: 'ผู้ส่งออกสินค้าเกษตร (Exporter)',
    avatar: '',
    isLoggedIn: true
  });

  const [originalEmail, setOriginalEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && (data.currentUser || data.users?.[0])) {
        const target = data.currentUser || data.users[0];
        setProfile({
          id: target.id || '',
          name: target.name || target.fullName || '',
          email: target.email || '',
          phone: target.phone || '',
          company: target.company || target.companyName || '',
          taxId: target.taxId || '',
          address: target.address || '',
          role: target.role || 'ผู้ส่งออกสินค้าเกษตร (Exporter)',
          avatar: target.avatar || '',
          isLoggedIn: true
        });
        setOriginalEmail(target.email || '');
      }
    } catch (e) {
      console.error('Error fetching users.json:', e);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 3MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result;
      if (typeof base64Image !== 'string') return;

      const updated = { ...profile, avatar: base64Image, originalEmail };
      setProfile(prev => ({ ...prev, avatar: base64Image }));

      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        const data = await res.json();
        if (data.success) {
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2500);
        }
      } catch (err) {
        console.error('Failed to update avatar in users.json:', err);
      }
    };
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          originalEmail
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setOriginalEmail(profile.email);
        setTimeout(() => setIsSaved(false), 2500);
      } else {
        setErrorMsg(data.message || 'บันทึกไม่สำเร็จ');
      }
    } catch (err) {
      setErrorMsg('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '40px 24px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #e9c46a', paddingBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
              👤 แก้ไขข้อมูลโปรไฟล์ผู้ใช้งาน
            </h1>
            <span style={{ fontSize: '12px', color: '#64748b' }}>ข้อมูลจะถูกบันทึกและซิงก์ลงใน data/users.json โดยตรง</span>
          </div>
          <Link href="/" style={{ color: '#2d6a4f', fontSize: '13.5px', fontWeight: '700', textDecoration: 'none' }}>
            กลับหน้าหลัก ➔
          </Link>
        </div>

        {isSaved && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', backgroundColor: '#d8f3dc', color: '#1b4332', border: '1px solid #b7e4c7' }}>
            ✅ บันทึกข้อมูลและรูปภาพลง users.json เรียบร้อยแล้ว!
          </div>
        )}

        {errorMsg && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>
            ❌ {errorMsg}
          </div>
        )}

        {/* ส่วนรูปโปรไฟล์ */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '14px' }}>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #1b4332', boxShadow: '0 4px 12px rgba(27,67,50,0.15)' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#1b4332', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', fontWeight: '800', border: '3px solid #e9c46a' }}>
                {(profile.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: '#e9c46a',
                color: '#1b4332',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: '2px solid #ffffff',
                fontSize: '16px'
              }}
            >
              📷
            </button>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: '700', color: '#2d6a4f', cursor: 'pointer', textDecoration: 'underline' }}
          >
            คลิกเพื่อเปลี่ยนรูปภาพโปรไฟล์
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* ฟอร์มแก้ไขข้อมูลทุกฟิลด์ */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
                ชื่อ - นามสกุล <span style={{ color: '#e63946' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={profile.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
                อีเมล <span style={{ color: '#e63946' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
                เบอร์โทรศัพท์ติดต่อ
              </label>
              <input
                type="tel"
                placeholder="เช่น 081-234-5678"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
                บทบาทผู้ใช้งานในระบบ
              </label>
              <select
                value={profile.role || 'ผู้ส่งออกสินค้าเกษตร (Exporter)'}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}
              >
                <option value="ผู้ส่งออกสินค้าเกษตร (Exporter)">ผู้ส่งออกสินค้าเกษตร (Exporter)</option>
                <option value="กลุ่มเกษตรกร / สหกรณ์">กลุ่มเกษตรกร / สหกรณ์</option>
                <option value="ผู้ประกอบการแปรรูป">ผู้ประกอบการแปรรูป</option>
                <option value="ตัวแทนส่งออก (Freight Forwarder)">ตัวแทนส่งออก (Freight Forwarder)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              ชื่อกลุ่มเกษตรกร / บริษัท / สวน
            </label>
            <input
              type="text"
              placeholder="เช่น กลุ่มเกษตรกรสวนแปลงใหญ่ หรือ บริษัท ส่งออกผลไม้ไทย จำกัด"
              value={profile.company || ''}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              เลขประจำตัวผู้เสียภาษี / เลขนิติบุคคล (Tax ID)
            </label>
            <input
              type="text"
              placeholder="เลข 13 หลัก สำหรับออกเอกสารและใบกำกับภาษี"
              value={profile.taxId || ''}
              onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* ช่องกรอกและแก้ไขที่อยู่ */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>
              ที่อยู่สถานประกอบการ / สวน / สำนักงาน (Address)
            </label>
            <textarea
              rows={3}
              placeholder="เช่น 123 หมู่ 4 ต.ท่าใหม่ อ.ท่าใหม่ จ.จันทบุรี 22120 (ใช้สำหรับระบุในสัญญาและเอกสารศุลกากร)"
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.5' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '13px',
              backgroundColor: '#1b4332',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '12px',
              boxShadow: '0 4px 14px rgba(27,67,50,0.2)'
            }}
          >
            {loading ? 'กำลังบันทึกข้อมูล...' : '💾 บันทึกการเปลี่ยนแปลงทั้งหมดลง users.json'}
          </button>
        </form>

      </div>
    </div>
  );
}