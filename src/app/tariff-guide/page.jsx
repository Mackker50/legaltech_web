'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function TariffGuidePage() {
  const { theme, lang } = useAppContext();
  const [destination, setDestination] = useState('CN'); // ตั้งต้นที่ China
  const [productType, setProductType] = useState('rice');
  const [data, setData] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    // ข้อมูลจำลองสำหรับตัวอย่างระบบ
    const db = {
      'CN-rice': { duty: '0% (ASEAN-China FTA)', phyto: 'ต้องมีใบรับรองสุขอนามัยพืช (Phytosanitary Certificate)', quota: 'มีโควตานำเข้าผ่าน COFCO' },
      'CN-durian': { duty: '0% (Zero Tariff)', phyto: 'ต้องผ่านการรับรองโรงคัดบรรจุ (GMP/GACP) และ Phytosanitary', quota: 'ไม่จำกัดโควตา' },
      'EU-rice': { duty: '€175 / Ton', phyto: 'ใบรับรองสารตกค้าง (Pesticide Residue Analysis)', quota: 'โควตากลุ่มประเทศยุโรป' },
      'JP-durian': { duty: '5% (JTEPA)', phyto: 'ตรวจสอบสารเคมีตกค้างอย่างเข้มงวด (MRLs Test)', quota: 'ตามข้อตกลงทวิภาคี' }
    };

    const key = `${destination}-${productType}`;
    setData(db[key] || { duty: '10%', phyto: 'ใบรับรองมาตรฐานทั่วไป', quota: 'ไม่มีข้อมูลโควตา' });
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: theme.textMain }}>
        {lang === 'th' ? '📊 ระบบเช็กภาษีและข้อกำหนดปลายทาง' : '📊 Tariff & Market Access Guide'}
      </h1>
      <p style={{ color: theme.textSub, marginBottom: '24px' }}>
        {lang === 'th' ? 'ตรวจสอบอัตราภาษีศุลกากร (Tariff) และมาตรการนำเข้าของประเทศปลายทาง' : 'Check import duties and destination market requirements.'}
      </p>

      <form onSubmit={handleCheck} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', marginBottom: '24px' }}>
        <select 
          value={destination} 
          onChange={(e) => setDestination(e.target.value)}
          style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none' }}
        >
          <option value="CN">🇨🇳 จีน (China)</option>
          <option value="EU">🇪🇺 สหภาพยุโรป (EU)</option>
          <option value="JP">🇯🇵 ญี่ปุ่น (Japan)</option>
        </select>

        <select 
          value={productType} 
          onChange={(e) => setProductType(e.target.value)}
          style={{ padding: '12px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none' }}
        >
          <option value="rice">🌾 ข้าว (Rice)</option>
          <option value="durian"> Durian (ทุเรียน)</option>
        </select>

        <button type="submit" style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: theme.link, color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
          {lang === 'th' ? 'ตรวจสอบ' : 'Check'}
        </button>
      </form>

      {data && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <h3 style={{ fontSize: '18px', color: theme.textMain, marginBottom: '16px' }}>📋 สรุปข้อกำหนดการส่งออก</h3>
          <p style={{ marginBottom: '10px' }}><strong>อัตราภาษีขาเข้า:</strong> <span style={{ color: theme.link }}>{data.duty}</span></p>
          <p style={{ marginBottom: '10px' }}><strong>มาตรการสุขอนามัย (SPS):</strong> {data.phyto}</p>
          <p><strong>ระบบโควตา:</strong> {data.quota}</p>
        </div>
      )}
    </div>
  );
}