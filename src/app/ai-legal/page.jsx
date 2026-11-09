'use client';

import { useState } from 'react';

export default function AILegalPage() {
  const [productCategory, setProductCategory] = useState('ทุเรียนหมอนทองสด (Fresh Durian)');
  const [destinationCountry, setDestinationCountry] = useState('จีน (Shanghai)');
  const [incoterm, setIncoterm] = useState('CIF');
  const [prompt, setPrompt] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [checklistData, setChecklistData] = useState(null);
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  const handleConsultAI = async () => {
    if (!prompt) return alert('กรุณากรอกข้อสงสัยทางกฎหมายการค้า');
    setLoadingAi(true);
    setAiAdvice('');

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCategory, destinationCountry, incoterm, prompt }),
      });

      const data = await res.json();
      if (data.success) {
        setAiAdvice(data.advice);
      } else {
        setAiAdvice('เกิดข้อผิดพลาด: ' + (data.error || data.message));
      }
    } catch (err) {
      setAiAdvice('ไม่สามารถเชื่อมต่อ API ได้: ' + err.message);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGenerateChecklist = async () => {
    if (!productCategory || !destinationCountry) {
      return alert('กรุณากรอกสินค้าและประเทศปลายทาง');
    }
    setLoadingChecklist(true);
    setChecklistData(null);

    try {
      const res = await fetch('/api/ai/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productCategory, destination: destinationCountry, incoterm }),
      });

      const data = await res.json();
      if (data.success) {
        setChecklistData(data.data);
      } else {
        alert('เกิดข้อผิดพลาด: ' + (data.error || data.message));
      }
    } catch (err) {
      alert('ไม่สามารถเชื่อมต่อ API ได้: ' + err.message);
    } finally {
      setLoadingChecklist(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.02em', color: '#1d1d1f', margin: '0 0 6px 0' }}>
          AI Legal & Trade Specialist
        </h1>
        <p style={{ fontSize: '15px', color: '#86868b', margin: 0 }}>
          ผู้ช่วยวิเคราะห์เงื่อนไข Incoterms 2020 และสกัดรายการเอกสารส่งออกทางกฎหมายตามสินค้าและประเทศปลายทาง
        </p>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#86868b', marginBottom: '6px' }}>
              ประเภทสินค้าเกษตร:
            </label>
            <input
              type="text"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              placeholder="เช่น ทุเรียนหมอนทองสด"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#86868b', marginBottom: '6px' }}>
              ประเทศปลายทาง & ท่าเรือ:
            </label>
            <input
              type="text"
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              placeholder="เช่น จีน (Shanghai)"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#86868b', marginBottom: '6px' }}>
              เงื่อนไข Incoterms:
            </label>
            <select
              value={incoterm}
              onChange={(e) => setIncoterm(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer' }}
            >
              <option value="CIF">CIF (Cost, Insurance & Freight)</option>
              <option value="FOB">FOB (Free on Board)</option>
              <option value="EXW">EXW (Ex Works)</option>
              <option value="DDP">DDP (Delivered Duty Paid)</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#86868b', marginBottom: '6px' }}>
            ข้อสงสัยทางกฎหมายการส่งออก / การภาระความรับผิดชอบสัญญา:
          </label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="เช่น เงื่อนไข CIF ไปจีน ใครเป็นผู้รับผิดชอบทำใบรับรองศัตรูพืช (Phytosanitary) และประกันภัยต้องคุ้มครองถึงจุดใด?"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #d2d2d7',
              boxSizing: 'border-box',
              fontSize: '14px',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleConsultAI}
            disabled={loadingAi}
            style={{
              backgroundColor: '#0071e3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '980px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loadingAi ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            {loadingAi ? 'กำลังวิเคราะห์ข้อกฎหมาย...' : 'ปรึกษา AI Legal Specialist'}
          </button>

          <button
            onClick={handleGenerateChecklist}
            disabled={loadingChecklist}
            style={{
              backgroundColor: '#f5f5f7',
              color: '#1d1d1f',
              border: 'none',
              borderRadius: '980px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loadingChecklist ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loadingChecklist ? 'กำลังสร้าง Checklist...' : 'สกัด Document Checklist อัตโนมัติ'}
          </button>
        </div>

        {aiAdvice && (
          <div style={{
            marginTop: '28px',
            padding: '20px 24px',
            borderRadius: '14px',
            backgroundColor: '#f5f5f7',
            borderLeft: '4px solid #0071e3',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#1d1d1f',
            whiteSpace: 'pre-wrap'
          }}>
            <strong style={{ color: '#0071e3', display: 'block', marginBottom: '8px', fontSize: '15px' }}>
              💡 คำแนะนำทางกฎหมายจาก AI:
            </strong>
            {aiAdvice}
          </div>
        )}

        {checklistData && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1d1d1f', margin: '0 0 14px 0' }}>
              📋 รายการเอกสารทางกฎหมายที่ต้องใช้ (Generated Legal Checklist)
            </h3>

            <div style={{ display: 'grid', gap: '10px' }}>
              {checklistData.required_documents?.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    backgroundColor: '#fafafa',
                    border: '1px solid rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1d1d1f' }}>
                      {doc.doc_name}
                      {doc.is_mandatory && (
                        <span style={{ fontSize: '11px', color: '#d70015', backgroundColor: '#ffebeb', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', fontWeight: '500' }}>
                          🔴 จำเป็นต้องมี
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#86868b', marginTop: '4px' }}>
                      {doc.description}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#0071e3',
                    backgroundColor: '#e8f2fc',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                  }}>
                    รับผิดชอบโดย: {doc.responsible_party}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}