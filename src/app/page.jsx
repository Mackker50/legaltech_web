'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ display: 'grid', gap: '60px', padding: '20px 0' }}>
      
      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
        <span style={{ 
          fontSize: '13px', 
          fontWeight: '600', 
          color: '#0071e3', 
          backgroundColor: '#e8f2fc', 
          padding: '6px 14px', 
          borderRadius: '980px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          LegalTech for Agri-Export
        </span>
        <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.03em', color: '#1d1d1f', margin: '20px 0 16px 0', lineHeight: 1.15 }}>
          จัดการสัญญาส่งออกสินค้าเกษตร<br />ได้อย่างโปร่งใส และรัดกุม
        </h1>
        <p style={{ fontSize: '20px', color: '#86868b', margin: '0 0 32px 0', lineHeight: 1.4, fontWeight: '400' }}>
          ยกระดับการประสานงานระหว่างผู้ส่งออก พ่อค้าคนกลาง เกษตรกร และผู้ขนส่ง ด้วยระบบจัดการเอกสารและ AI วิเคราะห์ Incoterms ในที่เดียว
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Link href="/workspace" style={{
            backgroundColor: '#0071e3',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '980px',
            fontSize: '16px',
            fontWeight: '500',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)'
          }}>
            เข้าสู่ Workspace ธุรกรรม
          </Link>
          <Link href="/ai-legal" style={{
            backgroundColor: '#f5f5f7',
            color: '#1d1d1f',
            padding: '14px 28px',
            borderRadius: '980px',
            fontSize: '16px',
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            ปรึกษา AI Legal Specialist
          </Link>
        </div>
      </section>

      {/* Feature Grid (Apple Bento Box Style) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>📍</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>ติดตามสถานะธุรกรรม</h3>
          <p style={{ fontSize: '15px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
            เห็นความคืบหน้าของดีลส่งออกร่วมกันตั้งแต่ข้อตกลง การเตรียมสินค้า เอกสาร จนถึงการจัดส่งสำเร็จ
          </p>
          <Link href="/status" style={{ display: 'inline-block', marginTop: '16px', fontSize: '14px', color: '#0071e3', textDecoration: 'none', fontWeight: '500' }}>
            ดูรายละเอียด →
          </Link>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🤖</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>AI Trade Advisor</h3>
          <p style={{ fontSize: '15px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
            วิเคราะห์ภาระหน้าที่ตาม Incoterms และสร้าง Document Checklist ที่จำเป็นตรงตามสินค้าและประเทศปลายทาง
          </p>
          <Link href="/ai-legal" style={{ display: 'inline-block', marginTop: '16px', fontSize: '14px', color: '#0071e3', textDecoration: 'none', fontWeight: '500' }}>
            ลองใช้งาน AI →
          </Link>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0', letterSpacing: '-0.01em' }}>ควบคุมสิทธิ์ความลับ</h3>
          <p style={{ fontSize: '15px', color: '#86868b', margin: 0, lineHeight: 1.5 }}>
            กำหนดสิทธิ์การมองเห็นข้อมูลราคาและสัญญาซื้อขายเฉพาะคู่สัญญาหลัก ป้องกันความลับทางการค้ารั่วไหล
          </p>
          <Link href="/documents" style={{ display: 'inline-block', marginTop: '16px', fontSize: '14px', color: '#0071e3', textDecoration: 'none', fontWeight: '500' }}>
            ไปที่คลังเอกสาร →
          </Link>
        </div>

      </section>
    </div>
  );
}