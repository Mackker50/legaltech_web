'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function HSClassifierPage() {
  const context = useAppContext() || {};
  const { lang } = context;
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.includes('ข้าว') || keyword.toLowerCase().includes('rice')) {
      setResult({ code: '1006.30', name: 'ข้าวขาว (Semi-milled or wholly milled rice)', duty: '0% (สิทธิประโยชน์ FTA)' });
    } else if (keyword.includes('ทุเรียน') || keyword.toLowerCase().includes('durian')) {
      setResult({ code: '0810.90', name: 'ผลไม้สดอื่นๆ (รวมถึงทุเรียนสด)', duty: '0% - 5%' });
    } else {
      setResult({ code: '1209.91', name: 'เมล็ดพันธุ์พืชเพื่อการเพาะปลูก', duty: '0%' });
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '90vh', padding: '40px 20px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '10px', borderLeft: '6px solid #1b4332', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', color: '#1b4332', fontWeight: '800', margin: '0 0 8px 0' }}>
            🔍 {lang === 'en' ? 'Agri HS Code Classifier' : 'ระบบจำแนก HS Code และสิทธิประโยชน์ภาษี'}
          </h1>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '14.5px' }}>
            {lang === 'en' ? 'Find correct export HS codes for agricultural products.' : 'ค้นหารหัสพิกัดอัตราศุลกากรและอัตราภาษีนำเข้าประเทศปลายทางสำหรับสินค้าเกษตร'}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input 
            type="text"
            placeholder={lang === 'en' ? 'Enter product name (e.g. Rice, Durian)...' : 'ระบุชื่อสินค้า เช่น ข้าว, ทุเรียน, เมล็ดพันธุ์...'}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ flex: 1, padding: '14px 16px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: '#ffffff', fontSize: '14px', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '14px 28px', borderRadius: '8px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
            ค้นหาข้อมูล
          </button>
        </form>

        {/* Results Card */}
        {result && (
          <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '10px', border: '1px solid #e9ecef', borderTop: '4px solid #e9c46a', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '18px', color: '#1b4332', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
              📌 ผลการจำแนกพิกัดศุลกากร
            </h3>
            <p style={{ color: '#212529', marginBottom: '10px', fontSize: '15px' }}><strong>พิกัด HS Code:</strong> <span style={{ color: '#1b4332', fontWeight: '800', fontSize: '18px', marginLeft: '6px' }}>{result.code}</span></p>
            <p style={{ color: '#212529', marginBottom: '10px', fontSize: '14.5px' }}><strong>รายละเอียดสินค้า:</strong> {result.name}</p>
            <p style={{ color: '#212529', margin: 0, fontSize: '14.5px' }}><strong>อัตราภาษีประเมิน:</strong> <span style={{ color: '#297a00', fontWeight: '700' }}>{result.duty}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}