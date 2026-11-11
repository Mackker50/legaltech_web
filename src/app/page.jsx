'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function HomePage() {
  const context = useAppContext() || {};
  const { lang, user } = context;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '90vh', paddingBottom: '60px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      
      {/* Breadcrumb Section */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e9ecef', padding: '12px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', fontSize: '13px', color: '#6c757d' }}>
          <span>หน้าหลัก</span> &gt; <span style={{ color: '#1b4332', fontWeight: '600' }}>ศูนย์บริการข้อมูลกฎหมายและการส่งออกสินค้าเกษตร</span>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '30px auto 0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '30px' }}>
        
        {/* Main Content Area */}
        <div>
          {/* Banner Hero Card: พื้นหลังขาว กรอบเขียวขอบเหลือง */}
          <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '28px', borderLeft: '6px solid #1b4332', borderTop: '1px solid #e9ecef', borderRight: '1px solid #e9ecef', borderBottom: '1px solid #e9ecef' }}>
            <div style={{ display: 'inline-block', backgroundColor: '#fefae0', color: '#bc6c25', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', marginBottom: '12px', border: '1px solid #dda15e' }}>
              AGRI-EXPORT LEGAL & COMPLIANCE PORTAL
            </div>
            <h1 style={{ fontSize: '30px', color: '#1b4332', fontWeight: '800', lineHeight: '1.3', marginBottom: '16px' }}>
              {lang === 'en' ? 'Agri-Export Compliance & Legal Portal' : 'ยกระดับการส่งออกสินค้าเกษตรไทย ด้วยระบบบริการเอกสารและกฎหมายดิจิทัล'}
            </h1>
            <p style={{ color: '#495057', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px' }}>
              ศูนย์รวมบริการจัดการสัญญาซื้อขายระหว่างประเทศ ตรวจสอบพิกัดอัตราศุลกากร ยื่นขอใบรับรองสุขอนามัยพืช (DOA) และติดตามสถานะสินค้าเกษตรตั้งแต่แปลงปลูกจนถึงท่าเรือปลายทาง
            </p>

            <div style={{ display: 'flex', gap: '14px' }}>
              <Link href={user ? "/workspace" : "/login"} style={{ padding: '12px 30px', backgroundColor: '#1b4332', color: '#ffffff', textDecoration: 'none', fontWeight: '600', borderRadius: '8px', fontSize: '14px', boxShadow: '0 4px 12px rgba(27,67,50,0.25)' }}>
                {user ? 'เข้าสู่ศูนย์ปฏิบัติการ (Workspace)' : 'เข้าสู่ระบบผู้ส่งออก'}
              </Link>
              <Link href="/documents" style={{ padding: '12px 30px', backgroundColor: '#ffffff', color: '#1b4332', textDecoration: 'none', fontWeight: '600', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '14px' }}>
                ดูคลังเอกสารตัวอย่าง
              </Link>
            </div>
          </div>

          {/* Services Grid Header */}
          <h2 style={{ fontSize: '20px', color: '#1b4332', fontWeight: '700', marginBottom: '18px', borderBottom: '2.5px solid #e9c46a', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌿</span> บริการดิจิทัลสำหรับผู้ส่งออกสินค้าเกษตร
          </h2>

          {/* Services Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            {[
              { title: 'คลังเอกสาร & Auto-Fill', desc: 'ดึงข้อมูลสัญญาและเติมลงแบบฟอร์มศุลกากรอัตโนมัติ', href: '/documents', icon: '📁' },
              { title: 'ยื่นคำขอใบรับรองพืช (DOA)', desc: 'ยื่นขอ Phytosanitary Certificate และ Form E', href: '/certificates', icon: '📜' },
              { title: 'จำแนก HS Code & ภาษี', desc: 'ตรวจสอบสิทธิประโยชน์ FTA และมาตรการภาษีปลายทาง', href: '/hs-classifier', icon: '🔍' },
              { title: 'ติดตาม Supply Chain', desc: 'ตรวจสอบสถานะตู้สินค้าตั้งแต่สวนถึงท่าเรือปลายทาง', href: '/supply-chain', icon: '🚢' },
            ].map((item, idx) => (
              <Link key={idx} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '10px', border: '1px solid #e9ecef', height: '100%', boxSizing: 'border-box', transition: 'all 0.2s ease-in-out', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                  <h3 style={{ fontSize: '17px', color: '#1b4332', fontWeight: '700', margin: '0 0 6px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '13.5px', color: '#6c757d', margin: 0, lineHeight: '1.5' }}>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Announcement Card */}
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '10px', border: '1px solid #e9ecef', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: '0 0 14px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '6px' }}>
              📢 ประกาศและมาตรการล่าสุด
            </h3>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: '#495057', lineHeight: '1.8' }}>
              <li>ข้อกำหนดการส่งออกทุเรียนสดไปตลาดจีน (ปี 2026)</li>
              <li>การขอหนังสือรับรองถิ่นกำเนิดสินค้า Form E ดิจิทัล</li>
              <li>การตรวจมาตรฐานสารตกค้างในพืชผักส่งออก EU</li>
            </ul>
          </div>

          {/* Contact Box: สีเขียวเข้ม ตัวอักษรเหลืองทอง */}
          <div style={{ backgroundColor: '#1b4332', color: '#ffffff', padding: '22px', borderRadius: '10px', borderTop: '4px solid #e9c46a' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 10px 0', color: '#e9c46a' }}>
              📞 ติดต่อสอบถามข้อกฎหมาย
            </h3>
            <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 14px 0', color: '#d8f3dc' }}>
              หากต้องการปรึกษาข้อกำหนดสัญญาหรือมาตรการการส่งออกพืชผล สามารถประสานงานทีมงานได้โดยตรง
            </p>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#e9c46a' }}>HOTLINE: 02-XXX-XXXX</div>
          </div>
        </div>

      </div>

      {/* Footer Section */}
      <footer style={{ backgroundColor: '#081c15', color: '#95d5b2', marginTop: '60px', padding: '40px 0 20px 0', borderTop: '4px solid #e9c46a', fontSize: '13px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '12px' }}>AgriLegal Pro Portal</h4>
            <p style={{ lineHeight: '1.6', color: '#b7e4c7' }}>ระบบบริหารจัดการข้อกำหนด กฎหมาย และสัญญาการส่งออกสินค้าเกษตรไทย เพื่อยกระดับความเชื่อมั่นในระบบการค้าโลก</p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '15px', marginBottom: '12px' }}>บริการหลัก</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/documents" style={{ color: '#95d5b2', textDecoration: 'none' }}>คลังเอกสาร</Link>
              <Link href="/certificates" style={{ color: '#95d5b2', textDecoration: 'none' }}>ยื่นขอใบรับรอง</Link>
              <Link href="/hs-classifier" style={{ color: '#95d5b2', textDecoration: 'none' }}>ตรวจสอบ HS Code</Link>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '15px', marginBottom: '12px' }}>สถานะระบบ</h4>
            <p style={{ lineHeight: '1.6', color: '#b7e4c7' }}>พร้อมใช้งานในรูปแบบ Multi-Role Platform และ Build Stability 100% บน Vercel</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', borderTop: '1px solid #1b4332', paddingTop: '20px', color: '#52b788' }}>
          © 2026 AgriLegal Pro. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}