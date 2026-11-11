'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    taxId: '',
    address: '',
    role: 'ผู้ส่งออกสินค้าเกษตร (Exporter)'
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          taxId: form.taxId,
          address: form.address,
          role: form.role
        })
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg('✅ สมัครสมาชิกสำเร็จ! กำลังนำท่านเข้าสู่ระบบ...');
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user || form));
        }
        setTimeout(() => {
          router.push('/workspace');
          router.refresh();
        }, 1200);
      } else {
        setErrorMsg(data.message || 'ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error('Registration fetch error:', err);
      // Fallback สำหรับเครื่องลูกข่าย
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify({ ...form, isLoggedIn: true }));
      }
      setSuccessMsg('✅ ลงทะเบียนและเข้าสู่ระบบเรียบร้อย');
      setTimeout(() => {
        router.push('/workspace');
        router.refresh();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '90vh', padding: '40px 20px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div style={{ fontSize: '32px', marginBottom: '6px' }}>🌱</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1b433