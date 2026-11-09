'use client';

import { useState } from 'react';

export default function AILegalPage() {
  const [productCategory, setProductCategory] = useState('ทุเรียนหมอนทองสด');
  const [destinationCountry, setDestinationCountry] = useState('จีน (Shanghai)');
  const [incoterm, setIncoterm] = useState('FOB');
  const [prompt, setPrompt] = useState('');

  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState('');

  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [checklistData, setChecklistData] = useState(null);

  const [errorMsg, setErrorMsg] = useState('');

  // 1. ส่งคำถามปรึกษากฎหมาย AI
  const handleConsult = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoadingAdvice(true);
    setAdvice('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCategory, destinationCountry, incoterm, prompt }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdvice(data.advice);
      } else {
        setErrorMsg(data.error || 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก AI');
      }
    } catch (err) {
      setErrorMsg('ไม่สามารถเชื่อมต่อกับบริการ AI ได้');
    } finally {
      setLoadingAdvice(false);
    }
  };

  // 2. สกัด Document Checklist อัตโนมัติ
  const handleGenerateChecklist = async () => {
    setLoadingChecklist(true);
    setChecklistData(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productCategory, destination: destinationCountry, incoterm }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setChecklistData(data.data);
      } else {
        setErrorMsg(data.error || 'เกิดข้อผิดพลาดในการสร้าง Checklist');
      }
    } catch (err) {
      setErrorMsg('ไม่สามารถเชื่อมต่อกับบริการ AI ได้');
    } finally {
      setLoadingChecklist(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1d1d1f', margin: '0 0 8px 0' }}>
          🤖 AI Legal & Cross-Border Specialist
        </h1>
        <p style={{ fontSize: '15px', color: '#86868b', margin: 0 }}>
          ที่ปรึกษากฎหมายส่งออกสินค้าเกษตรและผู้เชี่ยวชาญข้อตกลง Incoterms 2020 ประมวลผลด้วย Groq Cloud AI
        </p>
      </div>

      {/* เงื่อนไขการส่งออก */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 16px 0', color: '#1d1d1f' }}>
          📍 ข้อมูลบริบทการส่งออก
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#86868b', marginBottom: '6px' }}>หมวดสินค้าเกษตร:</label>
            <input
              type="text"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #d2d2d7', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#86868b', marginBottom: '6px' }}>ประเทศปลายทาง:</label>
            <input
              type="text"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #d2d2d7', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#86868b', marginBottom: '6px' }}>เงื่อนไข Incoterms:</label>
            <select
              value={incoterm}
              onChange={(e) => setIncoterm(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #d2d2d7', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }}
            >
              <option value="FOB">FOB (Free On Board)</option>
              <option value="CIF">CIF (Cost, Insurance & Freight)</option>
              <option value="EXW">EXW (Ex Works)</option>
              <option value="DDP">DDP (Delivered Duty Paid)</option>
              <option value="CFR">CFR (Cost and Freight)</option>
            </select>
          </div>
        </div>
      </div>

      {/* แบบฟอร์มถาม AI และสกัด Checklist */}
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '32px' }}>
        <form onSubmit={handleConsult}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#1d1d1f', marginBottom: '8px' }}>
            💬 ข้อสงสัยทางกฎหมาย หรือข้อตกลงการส่งออก:
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="เช่น ความรับผิดชอบเรื่องความเสียหายของทุเรียนระหว่างขนส่งเรือตกเป็นของผู้ขายหรือผู้ซื้อกรณีเลือก FOB?"
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d2d2d7', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '16px' }}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={loadingAdvice}
              style={{
                flex: 1,
                backgroundColor: '#0071e3',
                color: '#fff',
                border: 'none',
                borderRadius: '980px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loadingAdvice ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,113,227,0.25)',
              }}
            >
              {loadingAdvice ? '⚡ กำลังวิเคราะห์ข้อกฎหมาย...' : 'วิเคราะห์ข้อกฎหมาย'}
            </button>

            <button
              type="button"
              onClick={handleGenerateChecklist}
              disabled={loadingChecklist}
              style={{
                backgroundColor: '#e8f2fc',
                color: '#0071e3',
                border: '1px solid rgba(0, 113, 227, 0.3)',
                borderRadius: '980px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loadingChecklist ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingChecklist ? '📋 กำลังสร้าง Checklist...' : '📋 สกัด Checklist เอกสาร'}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#ffebeb', color: '#d70015', fontSize: '13px' }}>
            ❌ {errorMsg}
          </div>
        )}
      </div>

      {/* ผลลัพธ์คำแนะนำจาก AI */}
      {advice && (
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 คำแนะนำทางกฎหมายจาก AI Specialist
          </h3>
          <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#333336', whitespace: 'pre-line' }}>
            {advice}
          </div>
        </div>
      )}

      {/* ผลลัพธ์ Document Checklist (Structured Data) */}
      {checklistData && (
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 16px 0' }}>
            📂 รายการเอกสารส่งออกจำเป็น (AI Extracted Checklist)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f5f5f7', color: '#86868b' }}>
                <th style={{ padding: '10px' }}>ชื่อเอกสาร</th>
                <th style={{ padding: '10px' }}>ผู้รับผิดชอบ</th>
                <th style={{ padding: '10px' }}>ประเภท</th>
                <th style={{ padding: '10px' }}>รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {checklistData.required_documents?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f5f5f7' }}>
                  <td style={{ padding: '12px 10px', fontWeight: '600', color: '#1d1d1f' }}>{item.doc_name}</td>
                  <td style={{ padding: '12px 10px', color: '#0071e3' }}>{item.responsible_party}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', backgroundColor: item.is_mandatory ? '#ffebeb' : '#eefbdf', color: item.is_mandatory ? '#d70015' : '#297a00' }}>
                      {item.is_mandatory ? 'บังคับ (Mandatory)' : 'แนะนำ (Optional)'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', color: '#86868b' }}>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}