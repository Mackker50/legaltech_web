'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function HomePage() {
  const context = useAppContext() || {};
  const { user } = context;

  const services = [
    {
      title: 'คลังเอกสาร & Auto-Fill',
      desc: 'ดึงข้อมูลสัญญาและเติมลงแบบฟอร์มศุลกากรอัตโนมัติ',
      icon: '📂',
      href: '/documents',
      badge: 'AI Smart-Fill',
      color: '#2d6a4f'
    },
    {
      title: 'ยื่นคำขอใบรับรองพืช (DOA)',
      desc: 'ยื่นขอ Phytosanitary Certificate และ Form E แบบ E-Service',
      icon: '📜',
      href: '/documents',
      badge: 'Fast Track',
      color: '#1b4332'
    },
    {
      title: 'จำแนก HS Code & อัตราภาษี',
      desc: 'เช็กสิทธิประโยชน์ FTA และพิกัดภาษีนำเข้า-ส่งออกแม่นยำ',
      icon: '🔍',
      href: '/ai-legal',
      badge: 'Smart Search',
      color: '#52b788'
    },
    {
      title: 'ติดตามสถานะการขนส่ง (Cold Chain)',
      desc: 'ตรวจเช็กสถานะตู้แช่เย็นและไทม์ไลน์สินค้าถึงท่าเรือปลายทาง',
      icon: '🚢',
      href: '/workspace',
      badge: 'Real-time',
      color: '#081c15'
    }
  ];

  const announcements = [
    { tag: 'CHINA', title: 'ข้อกำหนดการส่งออกทุเรียนสดไปตลาดจีน (ปี 2026)', date: 'อัปเดตล่าสุด' },
    { tag: 'FORM E', title: 'การขอหนังสือรับรองถิ่นกำเนิดสินค้า Digital Form E', date: '1 วันที่แล้ว' },
    { tag: 'EU STANDARD', title: 'การตรวจมาตรฐานสารตกค้างในพืชผักส่งออก EU', date: '3 วันที่แล้ว' },
    { tag: 'INCOTERMS', title: 'คู่มือเงื่อนไขการส่งมอบสินค้าเกษตร CIF / FOB 2020', date: 'สัปดาห์นี้' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '36px 32px 60px 32px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Main Content Layout Grid (ตัด Breadcrumb ที่ลอยออกแล้ว) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.9fr 1.1fr', gap: '28px', alignItems: 'start' }}>

          {/* Left Column: Hero & Service Cards */}
          <div>

            {/* Hero Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '38px 40px',
              border: '1px solid #e2e8f0',
              borderLeft: '6px solid #1b4332',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              marginBottom: '32px',
              position: 'relative'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '4px 14px',
                borderRadius: '8px',
                backgroundColor: '#fefae0',
                color: '#bc6c25',
                fontSize: '11.5px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                marginBottom: '16px',
                border: '1px solid #faedcd'
              }}>
                AGRI-EXPORT LEGAL & COMPLIANCE PORTAL
              </div>

              <h1 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#1b4332',
                lineHeight: '1.3',
                margin: '0 0 16px 0',
                letterSpacing: '-0.5px'
              }}>
                ยกระดับการส่งออกสินค้าเกษตรไทย ด้วยระบบบริการเอกสารและกฎหมายดิจิทัล 🌾
              </h1>

              <p style={{
                fontSize: '15px',
                color: '#64748b',
                lineHeight: '1.7',
                margin: '0 0 28px 0',
                maxWidth: '700px'
              }}>
                ศูนย์รวมบริการจัดการสัญญาซื้อขายระหว่างประเทศ ตรวจสอบพิกัดอัตราศุลกากร ยื่นขอใบรับรองสุขอนามัยพืช (DOA) และติดตามสถานะสินค้าเกษตรตั้งแต่แปลงปลูกจนถึงท่าเรือปลายทาง
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link
                  href={user ? "/workspace" : "/login"}
                  style={{
                    padding: '12px 28px',
                    backgroundColor: '#1b4332',
                    color: '#ffffff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14.5px',
                    boxShadow: '0 4px 14px rgba(27, 67, 50, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{user ? '🚀' : '🔐'}</span> {user ? 'เปิด Workspace ผู้ส่งออก' : 'เข้าสู่ระบบผู้ส่งออก'}
                </Link>

                <Link
                  href="/documents"
                  style={{
                    padding: '12px 26px',
                    backgroundColor: '#ffffff',
                    color: '#1b4332',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14.5px',
                    border: '1.5px solid #1b4332',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>📁</span> ดูคลังเอกสารตัวอย่าง
                </Link>
              </div>
            </div>

            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: '800', color: '#1b4332', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🌱</span> บริการดิจิทัลสำหรับผู้ส่งออกสินค้าเกษตร
              </h2>
              <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: '600' }}>All-in-one Smart Tools</span>
            </div>

            {/* Service Bento Grid (2x2) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
              {services.map((item, idx) => (
                <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    height: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#f4f9f5', border: '1px solid #d8f3dc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                          {item.icon}
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '6px', backgroundColor: '#f4f9f5', color: '#2d6a4f', border: '1px solid #d8f3dc' }}>
                          {item.badge}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16.5px', fontWeight: '800', color: '#1b4332', margin: '0 0 8px 0' }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                        {item.desc}
                      </p>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: '#2d6a4f' }}>
                      <span>เข้าใช้งานบริการ</span>
                      <span>➔</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* Right Column: Feed Announcements (ตัดกล่อง HOTLINE ออกเรียบร้อย) */}
          <div>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '26px 24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '12px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>📢</span>
                <h3 style={{ fontSize: '16.5px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                  ประกาศและมาตรการล่าสุด (2026)
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {announcements.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #f1f5f9',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#1b4332', backgroundColor: '#e9f5ed', padding: '2px 8px', borderRadius: '4px' }}>
                        {item.tag}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                        {item.date}
                      </span>
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#334155', lineHeight: '1.5' }}>
                      • {item.title}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                <Link href="/documents" style={{ color: '#2d6a4f', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
                  ดูประกาศระเบียบทั้งหมด ➔
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}