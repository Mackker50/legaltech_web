'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocumentAutoFillPage() {
  const [existingDeals, setExistingDeals] = useState([]);
  const [docType, setDocType] = useState('phyto'); // 'phyto' | 'contract' | 'invoice'
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [formData, setFormData] = useState({
    dealId: 'EXP-2026-CN01',
    exporterName: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
    exporterAddress: '123 หมู่ 4 ต.ท่าใหม่ อ.ท่าใหม่ จ.จันทบุรี 22120',
    gapCode: 'GAP-TH-22-04-9871',
    gmpPackhouseCode: 'GMP-DOA-66-0123',
    gaccRegNumber: 'CTHA08012204001',
    buyerName: 'Shanghai Fresh Global Fruit Co., Ltd.',
    buyerAddress: 'No. 88 Longwu Road, Xuhui District, Shanghai, China',
    destinationPort: 'Shanghai Port, China',
    destinationCountry: 'CN',
    commodityName: 'ทุเรียนหมอนทองสด (Fresh Monthong Durian)',
    botanicalName: 'Durio zibethinus Murr.',
    hsCode: '0810.60.00',
    quantity: '25,000 กก. (ตู้ Reefer 40ft)',
    unitPrice: '180 บาท/กก.',
    totalPrice: '4,500,000 บาท',
    incoterm: 'CIF',
    treatmentType: 'เป่าลมแรงดันสูงกำจัดเพลี้ยแป้ง ตรวจรับรองไม่พบศัตรูพืชกักกัน',
    containerNumber: 'TGHU9876543 / Seal: TH-DOA-9912',
    temperatureReq: '13.0°C - 14.5°C'
  });

  // โหลดรายการ Deals จาก data/deals.json ผ่าน API
  useEffect(() => {
    fetch('/api/deals', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.deals) && data.deals.length > 0) {
          setExistingDeals(data.deals);
        }
      })
      .catch(err => console.warn('Cannot load deals:', err));
  }, []);

  // พรีเซ็ต 5 ประเทศมาตรฐาน
  const presets = [
    {
      label: '🇨🇳 ทุเรียนสดไปจีน (GACC / Form E)',
      country: 'CN',
      port: 'Shanghai Port, China',
      buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
      buyerAddr: 'No. 88 Longwu Road, Xuhui District, Shanghai, China',
      commodity: 'ทุเรียนหมอนทองสด (Fresh Monthong Durian)',
      botanical: 'Durio zibethinus Murr.',
      hs: '0810.60.00',
      treatment: 'เป่าลมแรงดันสูงกำจัดเพลี้ยแป้ง ตรวจรับรองไม่พบศัตรูพืชกักกันตามพิธีสาร SPS',
      temp: '13.0°C - 14.5°C',
      price: '4,500,000 บาท',
      incoterm: 'CIF'
    },
    {
      label: '🇯🇵 มะม่วงน้ำดอกไม้ไปญี่ปุ่น (MAFF / VHT)',
      country: 'JP',
      port: 'Tokyo Narita Airport, Japan',
      buyer: 'Tokyo Agri-Produce Imports Co., Ltd.',
      buyerAddr: 'Ota Market, Ota-ku, Tokyo, Japan',
      commodity: 'มะม่วงน้ำดอกไม้สด (อบไอน้ำ VHT)',
      botanical: 'Mangifera indica L.',
      hs: '0804.50.20',
      treatment: 'Vapour Heat Treatment (VHT) อุณหภูมิเนื้อผล 46.8°C นาน 10 นาที (ตรวจร่วม DOA/MAFF)',
      temp: '10.0°C - 12.0°C',
      price: '875,000 บาท',
      incoterm: 'CPT'
    },
    {
      label: '🇺🇸 ข้าวหอมมะลิไปสหรัฐฯ (FDA / Fumigation)',
      country: 'US',
      port: 'Port of Long Beach, CA, USA',
      buyer: 'California Asian Food Trading Inc.',
      buyerAddr: 'Long Beach Harbor District, CA, USA',
      commodity: 'ข้าวหอมมะลิไทย 100% (Thai Hom Mali Rice)',
      botanical: 'Oryza sativa L.',
      hs: '1006.30.90',
      treatment: 'Fumigation ด้วย Phosphine กักความเข้มข้นตามมาตรฐาน USDA-APHIS',
      temp: 'Ambient / Dry Container (ความชื้นไม่เกิน 14%)',
      price: '1,250,000 บาท',
      incoterm: 'FOB'
    },
    {
      label: '🇲🇾 มังคุดสดไปมาเลเซีย (MAQIS / ทางบก)',
      country: 'MY',
      port: 'ด่านสะเดา / Bukit Kayu Hitam',
      buyer: 'Kuala Lumpur Wholesaler Sdn Bhd',
      buyerAddr: 'Selayang Wholesale Market, Kuala Lumpur, Malaysia',
      commodity: 'มังคุดสดคัดเกรด (Fresh Mangosteen)',
      botanical: 'Garcinia mangostana L.',
      hs: '0804.50.30',
      treatment: 'ตรวจคัดแยกกลีบเลี้ยง ปลอดมดดำและเพลี้ยไฟตามเกณฑ์ MAQIS',
      temp: '12.0°C - 13.0°C',
      price: '1,800,000 บาท',
      incoterm: 'DAP'
    },
    {
      label: '🇮🇳 สินค้าเกษตรไปอินเดีย (DPPQS / Methyl Bromide)',
      country: 'IN',
      port: 'Nhava Sheva Port, Mumbai, India',
      buyer: 'Bharat Agro Commodities Pvt. Ltd.',
      buyerAddr: 'APMC Market, Vashi, Navi Mumbai, India',
      commodity: 'ข้าวสารเกษตรไทย (Agricultural Produce)',
      botanical: 'Oryza sativa L.',
      hs: '1006.30.90',
      treatment: 'Fumigation ด้วย Methyl Bromide (MB) 32g/m3 นาน 24 ชม. ตาม PQ Order 2003',
      temp: 'Dry Container ปลอดความชื้น',
      price: '2,100,000 บาท',
      incoterm: 'CIF'
    }
  ];

  // เลือกโหลดข้อมูลจาก Deals เดิมที่มีอยู่
  const handleSelectExistingDeal = (dealId) => {
    const selected = existingDeals.find(d => d.dealId === dealId);
    if (!selected) return;

    setFormData(prev => ({
      ...prev,
      dealId: selected.dealId,
      commodityName: selected.productName || prev.commodityName,
      destinationPort: selected.destination || prev.destinationPort,
      buyerName: selected.buyer || prev.buyerName,
      exporterName: selected.companyName || prev.exporterName,
      quantity: selected.quantity || prev.quantity,
      totalPrice: selected.price || prev.totalPrice,
      incoterm: selected.incoterm || prev.incoterm,
      hsCode: selected.hsCode || prev.hsCode,
      gapCode: selected.gapCode || prev.gapCode,
      gmpPackhouseCode: selected.gmpCode || prev.gmpPackhouseCode
    }));
  };

  // ใช้งาน Preset ด่วน
  const handleApplyPreset = (p) => {
    setFormData(prev => ({
      ...prev,
      destinationCountry: p.country,
      destinationPort: p.port,
      buyerName: p.buyer,
      buyerAddress: p.buyerAddr,
      commodityName: p.commodity,
      botanicalName: p.botanical,
      hsCode: p.hs,
      treatmentType: p.treatment,
      temperatureReq: p.temp,
      totalPrice: p.price,
      incoterm: p.incoterm
    }));
  };

  // บันทึกดีลลง data/deals.json ผ่าน API
  const handleSaveToDeals = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    const payload = {
      dealId: formData.dealId || ('EXP-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900)),
      productName: formData.commodityName,
      destination: formData.destinationPort,
      buyer: formData.buyerName,
      companyName: formData.exporterName,
      quantity: formData.quantity,
      price: formData.totalPrice,
      incoterm: formData.incoterm,
      hsCode: formData.hsCode,
      gapCode: formData.gapCode,
      gmpCode: formData.gmpPackhouseCode,
      currentStep: 2,
      status: 'IN_PROGRESS',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('active_deal', JSON.stringify(payload));
        }
        setStatusMessage({ type: 'success', text: `บันทึกข้อมูลดีล ${payload.dealId} ลง deals.json เรียบร้อยแล้ว!` });
      } else {
        setStatusMessage({ type: 'error', text: 'บันทึกไม่สำเร็จ: ' + data.message });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '32px 24px 80px 24px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* แถบหัวเรื่อง */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '2px' }}>
              ExportSure Smart Document Generator
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1b4332', margin: 0 }}>
              📝 ระบบช่วยเตรียมและสร้างเอกสารส่งออกอัตโนมัติ
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              ดึงข้อมูลจากดีลในระบบ หรือเลือกพรีเซ็ต 5 ประเทศ เพื่อออกเอกสารราชการและสัญญาการค้า
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/workspace"
              style={{
                padding: '9px 18px',
                backgroundColor: '#ffffff',
                color: '#1b4332',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none',
                border: '1.5px solid #1b4332'
              }}
            >
              ← กลับไป Workspace
            </Link>
            <button
              onClick={handleSaveToDeals}
              disabled={isSaving}
              style={{
                padding: '9px 18px',
                backgroundColor: '#2d6a4f',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 10px rgba(45,106,79,0.2)'
              }}
            >
              {isSaving ? '⏳ กำลังบันทึก...' : '💾 บันทึกดีลลงระบบ'}
            </button>
            <button
              onClick={() => window.print()}
              style={{
                padding: '9px 20px',
                backgroundColor: '#1b4332',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(27,67,50,0.18)'
              }}
            >
              🖨️ พิมพ์เอกสาร / บันทึก PDF
            </button>
          </div>
        </div>

        {statusMessage && (
          <div style={{
            marginBottom: '18px',
            padding: '12px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            backgroundColor: statusMessage.type === 'success' ? '#d8f3dc' : '#fee2e2',
            color: statusMessage.type === 'success' ? '#1b4332' : '#dc2626',
            border: `1px solid ${statusMessage.type === 'success' ? '#b7e4c7' : '#fecaca'}`
          }}>
            {statusMessage.text}
          </div>
        )}

        {/* แถบดึงข้อมูลจากดีลเดิม และพรีเซ็ตสำเร็จรูป */}
        <div style={{ backgroundColor: '#ffffff', padding: '18px 22px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', marginBottom: '20px' }}>
          
          {existingDeals.length > 0 && (
            <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#1b4332' }}>📂 ดึงข้อมูลจากดีลใน deals.json:</span>
              <select
                onChange={(e) => handleSelectExistingDeal(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: '600', backgroundColor: '#f8fafc' }}
              >
                <option value="">-- เลือกดีลการค้าที่มีอยู่ --</option>
                {existingDeals.map(d => (
                  <option key={d.dealId} value={d.dealId}>{d.dealId}: {d.productName} ({d.destination})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#64748b', marginBottom: '8px' }}>
              ⚡ หรือเลือกพรีเซ็ตด่วนตามข้อกำหนด 5 ตลาดหลัก (Quick Presets):
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  style={{
                    padding: '7px 14px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#334155',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* เมนูเลือกชนิดเอกสารที่จะออก */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setDocType('phyto')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: docType === 'phyto' ? 'none' : '1px solid #e2e8f0',
              backgroundColor: docType === 'phyto' ? '#1b4332' : '#ffffff',
              color: docType === 'phyto' ? '#ffffff' : '#475569',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📜 1. ใบรับรองสุขอนามัยพืช (พ.ก. 7)
          </button>
          <button
            onClick={() => setDocType('contract')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: docType === 'contract' ? 'none' : '1px solid #e2e8f0',
              backgroundColor: docType === 'contract' ? '#1b4332' : '#ffffff',
              color: docType === 'contract' ? '#ffffff' : '#475569',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📄 2. สัญญาซื้อขายส่งออก (Sales Contract)
          </button>
          <button
            onClick={() => setDocType('invoice')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: docType === 'invoice' ? 'none' : '1px solid #e2e8f0',
              backgroundColor: docType === 'invoice' ? '#1b4332' : '#ffffff',
              color: docType === 'invoice' ? '#ffffff' : '#475569',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            🧾 3. ใบกำกับสินค้า (Commercial Invoice)
          </button>
        </div>

        {/* ตารางแสดงผล: ซ้ายกรอกข้อมูล / ขวาพรีวิวแผ่นงานจริง */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '22px' }}>

          {/* ฝั่งซ้าย: ฟอร์มแก้ไขรายละเอียด */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: '#1b4332', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
              ⚙️ รายละเอียดข้อมูลเอกสาร
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>รหัสติดตามดีล (Deal ID):</label>
                <input
                  type="text"
                  value={formData.dealId}
                  onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>ชื่อผู้ส่งออก / สวนต้นทาง:</label>
                <input
                  type="text"
                  value={formData.exporterName}
                  onChange={(e) => setFormData({ ...formData, exporterName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>รหัสแปลง GAP:</label>
                  <input
                    type="text"
                    value={formData.gapCode}
                    onChange={(e) => setFormData({ ...formData, gapCode: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>รหัสโรงแพ็ค GMP:</label>
                  <input
                    type="text"
                    value={formData.gmpPackhouseCode}
                    onChange={(e) => setFormData({ ...formData, gmpPackhouseCode: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>ผู้ซื้อปลายทาง (Buyer):</label>
                <input
                  type="text"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>ท่าเรือ / ด่านปลายทาง:</label>
                <input
                  type="text"
                  value={formData.destinationPort}
                  onChange={(e) => setFormData({ ...formData, destinationPort: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>ชื่อสินค้าเกษตร:</label>
                  <input
                    type="text"
                    value={formData.commodityName}
                    onChange={(e) => setFormData({ ...formData, commodityName: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>HS Code:</label>
                  <input
                    type="text"
                    value={formData.hsCode}
                    onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>ปริมาณสินค้า:</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>มูลค่ารวม:</label>
                  <input
                    type="text"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>Incoterms:</label>
                  <input
                    type="text"
                    value={formData.incoterm}
                    onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>การบำบัดกำจัดศัตรูพืช (Treatment):</label>
                <textarea
                  rows="2"
                  value={formData.treatmentType}
                  onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: พรีวิวเอกสารเสมือนจริงสำหรับพิมพ์ */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px', border: '1px solid #cbd5e1', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', minHeight: '620px', display: 'flex', flexDirection: 'column' }}>

            {/* 1. พรีวิว พ.ก. 7 */}
            {docType === 'phyto' && (
              <div style={{ lineHeight: '1.6', fontSize: '12.5px', color: '#1e293b' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #1b4332', paddingBottom: '12px', marginBottom: '18px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#1b4332' }}>DEPARTMENT OF AGRICULTURE, THAILAND</div>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', margin: '4px 0', color: '#1b4332' }}>PHYTOSANITARY CERTIFICATE (พ.ก. 7)</h2>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Certificate No. PSC-{formData.dealId} | e-Phyto Integrated System</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div>
                    <strong>1. Exporter Name & Address:</strong>
                    <div style={{ color: '#475569' }}>{formData.exporterName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{formData.exporterAddress}</div>
                    <div style={{ fontSize: '11px', color: '#166534', marginTop: '2px' }}>GAP: {formData.gapCode} | GMP: {formData.gmpPackhouseCode}</div>
                  </div>
                  <div>
                    <strong>2. Declared Consignee:</strong>
                    <div style={{ color: '#475569' }}>{formData.buyerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{formData.buyerAddress}</div>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div><strong>3. Botanical Name:</strong> <em>{formData.botanicalName}</em></div>
                    <div><strong>4. HS Code:</strong> <code>{formData.hsCode}</code></div>
                    <div><strong>5. Port of Entry:</strong> {formData.destinationPort}</div>
                    <div><strong>6. Quantity:</strong> {formData.quantity}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                  <strong>7. Disinfestation and/or Disinfection Treatment:</strong>
                  <div style={{ color: '#334155', marginTop: '3px' }}>{formData.treatmentType}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Container & Seal No: {formData.containerNumber}</div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    ExportSure Digital Seal & Signature Verified<br/>
                    กรมวิชาการเกษตร กระทรวงเกษตรและสหกรณ์
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ borderTop: '1px solid #1e293b', width: '170px', marginTop: '35px', paddingTop: '3px' }}>
                      Authorized Plant Inspector
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. พรีวิว Sales Contract */}
            {docType === 'contract' && (
              <div style={{ lineHeight: '1.6', fontSize: '12.5px', color: '#1e293b' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #1b4332', paddingBottom: '12px', marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', margin: '4px 0', color: '#1b4332' }}>INTERNATIONAL AGRICULTURAL SALES CONTRACT</h2>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Contract Ref: {formData.dealId} | Incoterms 2020 Rules</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong>Parties to the Contract:</strong>
                  <div>• <strong>Seller:</strong> {formData.exporterName}</div>
                  <div>• <strong>Buyer:</strong> {formData.buyerName}</div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                  <div><strong>Commodity:</strong> {formData.commodityName} (HS: {formData.hsCode})</div>
                  <div><strong>Quantity:</strong> {formData.quantity}</div>
                  <div><strong>Total Contract Value:</strong> {formData.totalPrice}</div>
                  <div><strong>Delivery Term:</strong> {formData.incoterm} - {formData.destinationPort}</div>
                </div>

                <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '18px' }}>
                  <strong>Safeguard & Multi-Party Clause:</strong><br/>
                  คู่สัญญาตกลงใช้ข้อมูลน้ำหนักสุทธิและผลตรวจศัตรูพืชจากด่านตรวจสอบมาตรฐาน การจัดสรรรายได้ต้องมีเอกสารรับรองที่เป็นลายลักษณ์อักษรเพื่อป้องกันข้อพิพาทและรายได้ตกหล่น
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'center' }}>
                  <div>
                    <div style={{ borderTop: '1px solid #1e293b', width: '150px', margin: '35px auto 4px auto' }}></div>
                    <strong>Seller Signature</strong><br/>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>({formData.exporterName})</span>
                  </div>
                  <div>
                    <div style={{ borderTop: '1px solid #1e293b', width: '150px', margin: '35px auto 4px auto' }}></div>
                    <strong>Buyer Signature</strong><br/>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>({formData.buyerName})</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. พรีวิว Commercial Invoice */}
            {docType === 'invoice' && (
              <div style={{ lineHeight: '1.6', fontSize: '12.5px', color: '#1e293b' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #1b4332', paddingBottom: '12px', marginBottom: '18px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', margin: '4px 0', color: '#1b4332' }}>COMMERCIAL INVOICE</h2>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Invoice No: INV-{formData.dealId} | Date: {new Date().toLocaleDateString('th-TH')}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <strong>Shipper / Exporter:</strong>
                    <div style={{ color: '#475569' }}>{formData.exporterName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{formData.exporterAddress}</div>
                  </div>
                  <div>
                    <strong>Consignee / Buyer:</strong>
                    <div style={{ color: '#475569' }}>{formData.buyerName}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{formData.buyerAddress}</div>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '18px', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                      <th style={{ padding: '6px', textAlign: 'left' }}>Description of Goods</th>
                      <th style={{ padding: '6px', textAlign: 'center' }}>HS Code</th>
                      <th style={{ padding: '6px', textAlign: 'right' }}>Quantity</th>
                      <th style={{ padding: '6px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 6px' }}>
                        <strong>{formData.commodityName}</strong><br/>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{formData.temperatureReq}</span>
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'center' }}>{formData.hsCode}</td>
                      <td style={{ padding: '8px 6px', textAlign: 'right' }}>{formData.quantity}</td>
                      <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: '700' }}>{formData.totalPrice}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ padding: '8px 6px', textAlign: 'right', fontWeight: '800' }}>Total {formData.incoterm}:</td>
                      <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: '800', color: '#166534', fontSize: '13.5px' }}>{formData.totalPrice}</td>
                    </tr>
                  </tfoot>
                </table>

                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', textAlign: 'right' }}>
                  <div style={{ borderTop: '1px solid #1e293b', width: '180px', margin: '35px 0 4px auto' }}></div>
                  <strong>ExportSure Authorized Signature</strong>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}