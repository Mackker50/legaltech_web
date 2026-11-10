'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function HSClassifierPage() {
  const { theme, lang } = useAppContext();
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // ตัวอย่างจำลองการค้นหา HS Code สินค้าเกษตร
    if (keyword.includes('ข้าว') || keyword.toLowerCase().includes('rice')) {
      setResult({ code: '1006.30', name: 'ข้าวขาว (Semi-milled or wholly milled rice)', duty: '0% (ภายใต้ FTA)' });
    } else if (keyword.includes('ทุเรียน') || keyword.toLowerCase().includes('durian')) {
      setResult({ code: '0810.90', name: 'ผลไม้สดอื่นๆ (รวมถึงทุเรียน)', duty: '5%' });
    } else {
      setResult({ code: '1209.91', name: 'เมล็ดพันธุ์พืชเพื่อการเพาะปลูก', duty: '0%' });
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: theme.textMain }}>
        {lang === 'th' ? '🔍 ระบบจำแนก HS Code สินค้าเกษตร' : '🔍 Agri HS Code Classifier'}
      </h1>
      <p style={{ color: theme.textSub, marginBottom: '24px' }}>
        {lang === 'th' ? 'ค้นหารหัสพิกัดอัตราศุลกากรสำหรับการส่งออกสินค้าเกษตร' : 'Find correct export HS codes for agricultural products.'}
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input 
          type="text"
          placeholder={lang === 'th' ? 'ระบุชื่อสินค้า เช่น ข้าว, ทุเรียน...' : 'Enter product name...'}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: '12px', 
            border: `1px solid ${theme.inputBorder}`, 
            backgroundColor: theme.inputBg, 
            color: theme.textMain, 
            outline: 'none' 
          }}
        />
        <button 
          type="submit" 
          style={{ 
            padding: '12px 24px', 
            borderRadius: '12px', 
            backgroundColor: theme.link, 
            color: '#fff', 
            border: 'none', 
            fontWeight: '600', 
            cursor: 'pointer' 
          }}
        >
          {lang === 'th' ? 'ค้นหา' : 'Search'}
        </button>
      </form>

      {result && (
        <div style={{ 
          backgroundColor: theme.cardBg, 
          padding: '24px', 
          borderRadius: '16px', 
          border: `1px solid ${theme.border}`, 
          boxShadow: theme.shadow 
        }}>
          <h3 style={{ fontSize: '18px', color: theme.textMain, marginBottom: '12px' }}>📌 ผลการวิเคราะห์ HS Code</h3>
          <p style={{ color: theme.textMain, marginBottom: '8px' }}><strong>HS Code:</strong> <span style={{ color: theme.link, fontWeight: 'bold' }}>{result.code}</span></p>
          <p style={{ color: theme.textMain, marginBottom: '8px' }}><strong>รายละเอียด:</strong> {result.name}</p>
          <p style={{ color: theme.textMain }}><strong>อัตราภาษีขาเข้า (ประเมิน):</strong> {result.duty}</p>
        </div>
      )}
    </div>
  );
}