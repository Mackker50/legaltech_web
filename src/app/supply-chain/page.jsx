'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function SupplyChainPage() {
  const { theme, lang } = useAppContext();
  const [trackingId, setTrackingId] = useState('AG-2026-9901');
  const [status, setStatus] = useState({
    step: 3,
    stepsList: [
      { title: '📦 บรรจุสินค้าที่โรงงาน (Packing)', date: '08 พ.ย. 2026 - 10:00 น.' },
      { title: '🚚 ผ่านพิธีการศุลกากรขาออก (Customs Clearance)', date: '09 พ.ย. 2026 - 14:30 น.' },
      { title: '🚢 กำลังขนส่งทางเรือ (In Transit)', date: '10 พ.ย. 2026 - 06:00 น. (ETA: 15 พ.ย.)' },
      { title: '🏁 ถึงท่าเรือปลายทาง (Port of Discharge)', date: 'รออัปเดต' }
    ]
  });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: theme.textMain }}>
        {lang === 'th' ? '🚢 ระบบติดตาม Supply Chain สินค้าเกษตร' : '🚢 Supply Chain & Shipment Tracking'}
      </h1>
      <p style={{ color: theme.textSub, marginBottom: '24px' }}>
        {lang === 'th' ? 'ติดตามสถานะการขนส่งสินค้าตั้งแต่แปลงเกษตรจนถึงมือผู้ซื้อต่างประเทศ' : 'Monitor agricultural shipments from farm to destination.'}
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input 
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none' }}
        />
        <button style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: theme.link, color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
          {lang === 'th' ? 'ค้นหาพัสดุ' : 'Track'}
        </button>
      </div>

      <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
        <h3 style={{ fontSize: '18px', color: theme.textMain, marginBottom: '20px' }}>สถานะการจัดส่ง: <span style={{ color: theme.link }}>{trackingId}</span></h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {status.stepsList.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '28px', height: '28px', borderRadius: '50%', 
                backgroundColor: idx <= status.step ? '#297a00' : theme.inputBorder,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 
              }}>
                {idx <= status.step ? '✓' : idx + 1}
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: theme.textMain, margin: '0 0 4px 0' }}>{item.title}</h4>
                <p style={{ fontSize: '13px', color: theme.textSub, margin: 0 }}>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}