'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StatusPage() {
  // 1. จำลองสิทธิ์ผู้ใช้ (RBAC Context)
  const [userRole, setUserRole] = useState('EXPORTER');

  // 2. สถานะปัจจุบันของธุรกรรม (Stepper State)
  const [currentStep, setCurrentStep] = useState(2);

  const steps = [
    { id: 1, title: 'ตกลงเงื่อนไขการค้า', desc: 'ระบุ Incoterms และราคาส่งออก' },
    { id: 2, title: 'เตรียมเอกสาร & ใบรับรอง', desc: 'อัปโหลด Phytosanitary & B/L' },
    { id: 3, title: 'ขนส่งสินค้าทางทะเล', desc: 'ตู้คอนเทนเนอร์ห้องเย็นออกเดินทาง' },
    { id: 4, title: 'ส่งมอบสำเร็จ', desc: 'ผู้ซื้อปลายทางรับมอบสินค้า' },
  ];

  // 3. รายชื่อผู้เกี่ยวข้อง (Stakeholders Coordination)
  const stakeholders = [
    { role: 'EXPORTER', name: 'บริษัท ไทย อกริ เอกซ์พอร์ต จำกัด', status: 'พร้อมส่งออก (Ready)', isCurrent: userRole === 'EXPORTER' },
    { role: 'MIDDLEMAN', name: 'คุณสมชาย (ผู้รวบรวม & คัดเกรด)', status: 'สินค้าพร้อมจัดส่ง', isCurrent: userRole === 'MIDDLEMAN' },
    { role: 'FARMER', name: 'กลุ่มเกษตรกรแปลงใหญ่ จ.จันทบุรี', status: 'เก็บเกี่ยวเรียบร้อย', isCurrent: userRole === 'FARMER' },
    { role: 'FREIGHT_FORWARDER', name: 'Global Logistics Express', status: 'จองตู้เรือเรียบร้อย', isCurrent: userRole === 'FREIGHT_FORWARDER' },
  ];

  const canSeePrice = userRole === 'EXPORTER' || userRole === 'MIDDLEMAN';

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      
      {/* Header Banner & Role Control */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.02em', color: '#1d1d1f', margin: '0 0 6px 0' }}>
            ติดตามสถานะธุรกรรม
          </h1>
          <p style={{ fontSize: '15px', color: '#86868b', margin: 0 }}>
            ดีลหมายเลข: <strong style={{ color: '#0071e3' }}>EXP-2026-001</strong> (ทุเรียนหมอนทองสด ไปจีน)
          </p>
        </div>

        {/* Role Switcher */}
        <div style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#86868b' }}>จำลองบทบาท:</span>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            style={{ border: 'none', backgroundColor: 'transparent', fontSize: '13px', fontWeight: '600', color: '#1d1d1f', outline: 'none', cursor: 'pointer' }}
          >
            <option value="EXPORTER">👨‍🌾 ผู้ส่งออก (Exporter)</option>
            <option value="MIDDLEMAN">🤝 พ่อค้าคนกลาง (Middleman)</option>
            <option value="FARMER">🧑‍🌾 เกษตรกร (Farmer)</option>
            <option value="FREIGHT_FORWARDER">🚢 บริษัทขนส่ง (Forwarder)</option>
          </select>
        </div>
      </div>

      {/* Progress Stepper Card */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: '#1d1d1f' }}>
          ความคืบหน้าการส่งออก (Transaction Stepper)
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {steps.map((s) => {
            const isActive = s.id === currentStep;
            const isDone = s.id < currentStep;

            return (
              <div 
                key={s.id} 
                onClick={() => setCurrentStep(s.id)}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: isActive ? '#0071e3' : isDone ? '#eefbdf' : '#f5f5f7',
                  color: isActive ? '#fff' : isDone ? '#297a00' : '#86868b',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 4px 12px rgba(0,113,227,0.25)' : 'none'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', opacity: 0.9, marginBottom: '6px' }}>
                  STEP 0{s.id} {isDone ? '✓' : ''}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{s.title}</div>
                <div style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.3 }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details & Stakeholders Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Deal Summary */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0', color: '#1d1d1f' }}>
            รายละเอียดข้อตกลงและเงื่อนไขการค้า (Trade Terms)
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
            <div><span style={{ color: '#86868b' }}>สินค้าส่งออก:</span> <strong>ทุเรียนหมอนทองสด</strong></div>
            <div><span style={{ color: '#86868b' }}>ปริมาณ:</span> <strong>25,000 กิโลกรัม (1 ตู้เย็น)</strong></div>
            <div><span style={{ color: '#86868b' }}>ประเทศปลายทาง:</span> <strong>จีน (ท่าเรือ Shanghai)</strong></div>
            <div><span style={{ color: '#86868b' }}>เงื่อนไข Incoterms:</span> <strong style={{ color: '#0071e3' }}>CIF (Cost, Insurance & Freight)</strong></div>
            <div><span style={{ color: '#86868b' }}>ผู้ซื้อปลายทาง:</span> <strong>Shanghai Fresh Import Co.</strong></div>
            <div><span style={{ color: '#86868b' }}>เป้าหมายการส่งมอบ:</span> <strong>20 พ.ย. 2026</strong></div>
          </div>

          {/* Privacy Price Display */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f5f5f7' }}>
            {canSeePrice ? (
              <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#eefbdf', color: '#297a00', fontSize: '14px', fontWeight: '500' }}>
                💰 <strong>ราคารวมธุรกรรม (เปิดเผยเฉพาะ Exporter & Middleman):</strong> 4,500,000 บาท
              </div>
            ) : (
              <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: '#f5f5f7', color: '#86868b', fontSize: '13px' }}>
                🔒 <i>ข้อมูลมูลค่าทางการค้าถูกปกปิดตามสิทธิ์ Data Privacy ของบทบาท {userRole}</i>
              </div>
            )}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
            <Link href="/documents" style={{ color: '#0071e3', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              ไปยังคลังเอกสารเพื่อแนบไฟล์ →
            </Link>
            <Link href="/ai-legal" style={{ color: '#424245', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              ปรึกษา AI ข้อกำหนดส่งออก →
            </Link>
          </div>
        </div>

        {/* Stakeholder Coordination Sidebar */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', color: '#1d1d1f' }}>
            ผู้เกี่ยวข้องในดีล (Stakeholders)
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            {stakeholders.map((sh, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: sh.isCurrent ? '#e8f2fc' : '#fafafa',
                  border: sh.isCurrent ? '1px solid #0071e3' : '1px solid rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#0071e3' }}>{sh.role}</span>
                  {sh.isCurrent && <span style={{ fontSize: '10px', backgroundColor: '#0071e3', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>คุณอยู่บทบาทนี้</span>}
                </div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#1d1d1f', marginBottom: '2px' }}>{sh.name}</div>
                <div style={{ fontSize: '12px', color: '#297a00', fontWeight: '500' }}>● {sh.status}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}