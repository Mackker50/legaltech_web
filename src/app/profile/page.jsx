'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    avatar: '',
    isLoggedIn: true
  });

  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success && data.currentUser) {
        setProfile({
          id: data.currentUser.id || '',
          name: data.currentUser.name || data.currentUser.fullName || '',
          email: data.currentUser.email || '',
          role: data.currentUser.role || 'ผู้ส่งออกสินค้าเกษตร (Exporter)',
          avatar: data.currentUser.avatar || '',
          isLoggedIn: true
        });
      }
    } catch (e) {
      console.error('Error loading users.json:', e);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('กรุณาเลือกไฟล์ภาพขนาดไม่เกิน 2MB ครับ');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result;
      if (typeof base64Image !== 'string') return;

      const updated = { ...profile, avatar: base64Image, isLoggedIn: true };
      setProfile(updated);

      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      } catch (err) {
        console.error('Failed to save avatar to users.json:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, isLoggedIn: true }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '40px 24px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #e9c46a', paddingBottom: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
              👤 ข้อมูลโปรไฟล์ผู้ใช้งาน
            </h1>
            <span style={{ fontSize: '12px', color: '#64748b' }}>อ่านและบันทึกข้อมูลไปยัง data/users.json</span>
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

        {/* รูปโปรไฟล์ Avatar */}
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

            <label style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: '#e9c46a',
              color: '#1b4332',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              border: '2px solid #ffffff'
            }}>
              📷
              <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </label>
          </div>

          <label style={{ fontSize: '13px', fontWeight: '700', color: '#2d6a4f', cursor: 'pointer', textDecoration: 'underline' }}>
            คลิกเพื่อเปลี่ยนรูปโปรไฟล์
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </label>
        </div>

        {/* ฟอร์มแก้ไขข้อมูลที่ป้องกัน Controlled Input Warning */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อ - นามสกุล</label>
            <input
              type="text"
              required
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>อีเมล</label>
            <input
              type="email"
              required
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>บทบาทในระบบ</label>
            <input
              type="text"
              value={profile.role || ''}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fafc' }}
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
              fontSize: '14.5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              boxShadow: '0 4px 14px rgba(27,67,50,0.2)'
            }}
          >
            {loading ? 'กำลังบันทึก...' : '💾 บันทึกลง users.json'}
          </button>
        </form>

      </div>
    </div>
  );
}