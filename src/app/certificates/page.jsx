'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function CertificatesPage() {
  const context = useAppContext() || {};
  const { lang } = context;
  const [certType, setCertType] = useState('PHYTO');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '90vh', padding: '40px 20px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '10px', borderLeft: '6px solid #1b4332', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', color: '#1b4332', fontWeight: '800', margin: '0 0 8px 0' }}>
            📜 {lang === 'en' ? 'Certificate Application Portal' : 'ระบบขอใบรับรองและเชื่อมต่อหน่วยงาน (DOA / DFT)'}
          </h1>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '14.5px' }}>
            {lang === 'en' ? 'Apply for Phytosanitary and export certificates.' : 'ยื่นคำขอใบรับรองสุขอนามัยพืช (Phytosanitary Certificate) และหนังสือรับรองถิ่นกำเนิดสินค้า'}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '10px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '8px' }}>
                ประเภทใบรับรองที่ต้องการขอ <span style={{ color: '#e63946' }}>*</span>
              </label>
              <select 
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: '#ffffff', color: '#212529', fontSize: '14px', outline: 'none' }}
              >
                <option value="PHYTO">ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate - กรมวิชาการเกษตร)</option>
                <option value="ORIGIN">หนังสือรับรองถิ่นกำเนิดสินค้า Form E (Certificate of Origin - กรมการค้าต่างประเทศ)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '8px' }}>
                หมายเลขล็อตสินค้า / รหัสแปลงเกษตร GAP <span style={{ color: '#e63946' }}>*</span>
              </label>
              <input 
                type="text"
                required
                placeholder="เช่น FARM-TH-6601 หรือ GAP-2026-99"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: '#ffffff', color: '#212529', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,67,50,0.2)' }}>
              📤 ส่งคำขอไปยังหน่วยงานรัฐ
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '10px', border: '1px solid #e9ecef', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ fontSize: '22px', color: '#1b4332', fontWeight: '700', marginBottom: '8px' }}>ยื่นคำขอสำเร็จเรียบร้อย!</h3>
            <p style={{ color: '#6c757d', marginBottom: '20px', fontSize: '14px' }}>ระบบส่งข้อมูลไปยังหน่วยงานผูกเค้าโครงเรียบร้อยแล้ว (Tracking Ref: #CERT-2026-8802)</p>
            <button onClick={() => setSubmitted(false)} style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: '#f8f9fa', color: '#1b4332', border: '1.5px solid #1b4332', fontWeight: '600', cursor: 'pointer' }}>
              ยื่นคำขอใบใหม่
            </button>
          </div>
        )}
      </div>
    </div>
  );
}