'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function CertificatesPage() {
  const { theme, lang } = useAppContext();
  const [certType, setCertType] = useState('PHYTO');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: theme.textMain }}>
        {lang === 'th' ? '📜 ระบบขอใบรับรองและเชื่อมต่อหน่วยงาน' : '📜 Certificate Application & Agency Link'}
      </h1>
      <p style={{ color: theme.textSub, marginBottom: '24px' }}>
        {lang === 'th' ? 'ยื่นคำขอใบรับรองสุขอนามัยพืช (Phytosanitary) และเชื่อมต่อกรมวิชาการเกษตร' : 'Apply for Phytosanitary and export certificates directly.'}
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMain, marginBottom: '6px' }}>
              {lang === 'th' ? 'ประเภทใบรับรอง' : 'Certificate Type'}
            </label>
            <select 
              value={certType}
              onChange={(e) => setCertType(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none' }}
            >
              <option value="PHYTO">ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate - DOA)</option>
              <option value="ORIGIN">หนังสือรับรองถิ่นกำเนิดสินค้า (Certificate of Origin - DFT)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textMain, marginBottom: '6px' }}>
              {lang === 'th' ? 'หมายเลขล็อตสินค้า / แปลงเกษตร' : 'Lot / Farm ID'}
            </label>
            <input 
              type="text"
              required
              placeholder="FARM-TH-6601"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ padding: '14px', borderRadius: '980px', backgroundColor: theme.link, color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
            {lang === 'th' ? '📤 ส่งคำขอไปยังหน่วยงาน' : 'Submit Application'}
          </button>
        </form>
      ) : (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow, textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ fontSize: '20px', color: theme.textMain, marginBottom: '8px' }}>ส่งคำขอสำเร็จเรียบร้อย!</h3>
          <p style={{ color: theme.textSub, marginBottom: '16px' }}>ระบบได้ส่งข้อมูลเชื่อมต่อไปยังหน่วยงานที่เกี่ยวข้องและกำลังรอการอนุมัติ (Tracking Ref: #CERT-9821)</p>
          <button onClick={() => setSubmitted(false)} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: theme.inputBorder, color: theme.textMain, border: 'none', cursor: 'pointer' }}>
            ยื่นคำขอใหม่
          </button>
        </div>
      )}
    </div>
  );
}