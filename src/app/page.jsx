'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function HomePage() {
  const context = useAppContext() || {};
  const { theme, lang, user } = context;

  const currentTheme = theme || {
    cardBg: '#ffffff',
    textMain: '#1d1d1f',
    textSub: '#86868b',
    border: '#e5e5ea',
    link: '#0071e3',
    shadow: '0 8px 30px rgba(0,0,0,0.04)'
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 64px auto' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '980px', backgroundColor: 'rgba(0,113,227,0.08)', color: currentTheme.link, fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
          🌾 Next-Gen Agricultural Export Platform
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.15', color: currentTheme.textMain, marginBottom: '20px', letterSpacing: '-1.5px' }}>
          {lang === 'en' ? 'Seamless Agri-Export Legal Compliance' : 'ยกระดับการส่งออกสินค้าเกษตร ด้วยระบบบริหารสัญญาและเอกสารดิจิทัล'}
        </h1>
        <p style={{ fontSize: '18px', color: currentTheme.textSub, lineHeight: '1.5', marginBottom: '32px' }}>
          {lang === 'en' 
            ? 'Automate compliance documents, phytosanitary certifications, HS classification, and supply chain tracking in one Apple-inspired workspace.' 
            : 'จัดการสัญญาซื้อขาย ขอใบรับรองสุขอนามัยพืช เช็ก HS Code และติดตามสถานะการขนส่งจบในที่เดียว'}
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href={user ? "/workspace" : "/login"} style={{ padding: '14px 32px', borderRadius: '980px', backgroundColor: currentTheme.link, color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px', boxShadow: '0 4px 16px rgba(0,113,227,0.3)' }}>
            {user ? (lang === 'en' ? 'Go to Workspace' : 'เข้าสู่ศูนย์ปฏิบัติการ') : (lang === 'en' ? 'Get Started' : 'เริ่มต้นใช้งานฟรี')}
          </Link>
          <Link href="/documents" style={{ padding: '14px 32px', borderRadius: '980px', backgroundColor: currentTheme.cardBg, color: currentTheme.textMain, border: `1px solid ${currentTheme.border}`, textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>
            {lang === 'en' ? 'Browse Documents' : 'ดูคลังเอกสาร'}
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {[
          { icon: '📁', title: 'คลังเอกสารอัตโนมัติ', desc: 'ดึงข้อมูลจากสัญญาเติมลงแบบฟอร์มศุลกากรแม่นยำ', href: '/documents' },
          { icon: '📜', title: 'ยื่นใบรับรองสุขอนามัยพืช', desc: 'เชื่อมต่อข้อมูลกรมวิชาการเกษตรและกรมการค้าต่างประเทศ', href: '/certificates' },
          { icon: '🔍', title: 'จำแนก HS Code สินค้า', desc: 'ค้นหาอัตราภาษีและมาตรการนำเข้าปลายทางได้ทันที', href: '/hs-classifier' },
          { icon: '🚢', title: 'ติดตาม Supply Chain', desc: 'เช็กสถานะสินค้าเรียลไทม์ตั้งแต่แปลงเกษตรถึงท่าเรือ', href: '/supply-chain' }
        ].map((f, i) => (
          <Link key={i} href={f.href} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: currentTheme.cardBg, padding: '32px 24px', borderRadius: '24px', border: `1px solid ${currentTheme.border}`, boxShadow: currentTheme.shadow, transition: 'transform 0.2s ease', height: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: currentTheme.textMain, margin: '0 0 8px 0' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: currentTheme.textSub, margin: 0, lineHeight: '1.4' }}>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}