'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ฐานข้อมูลมาตรฐานการค้าที่ใช้เติมอัตโนมัติทันที
const AUTO_FILL_PRESETS = {
  durian_cn: {
    label: 'ทุเรียนสด ส่งออกจีน (Shanghai)',
    productName: 'ทุเรียนหมอนทองสดเกรด A',
    hsCode: '0810.60.00',
    destination: 'จีน (Shanghai Port)',
    buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
    quantity: '25,000 กิโลกรัม (1 ตู้ Reefer 40ft)',
    price: '4,500,000 บาท',
    incoterm: 'CIF - Cost, Insurance and Freight',
    reeferTemp: '13.0°C - 14.5°C (ควบคุมความชื้น 85-90% RH)',
    portLoading: 'ท่าเรือแหลมฉบัง (Laem Chabang Port, TH)',
    portDischarge: 'ท่าเรือเซี่ยงไฮ้ (Shanghai Port, CN)',
    paymentTerm: '100% Irrevocable Letter of Credit (L/C at Sight)',
    requiredDocs: 'Phytosanitary Certificate, GACC Registration, Form E (ACFTA), Bill of Lading'
  },
  durian_frozen: {
    label: 'ทุเรียนแช่แข็ง ส่งออกจีน (Guangzhou)',
    productName: 'ทุเรียนแช่แข็ง IQF',
    hsCode: '0811.90.00',
    destination: 'จีน (Guangzhou Port)',
    buyer: 'Guangzhou Cold Chain Imports Ltd.',
    quantity: '20,000 กิโลกรัม',
    price: '3,800,000 บาท',
    incoterm: 'FOB - Free on Board',
    reeferTemp: '-18.0°C หรือต่ำกว่า',
    portLoading: 'ท่าเรือกรุงเทพ (PAT)',
    portDischarge: 'ท่าเรือกว่างโจว (Guangzhou Port, CN)',
    paymentTerm: 'T/T มัดจำ 30% / ชำระ 70% เมื่อได้รับสำเนา B/L',
    requiredDocs: 'Health Certificate, Phyto Cert, Form E, GACC Registration'
  },
  mangosteen_cn: {
    label: 'มังคุดสด ส่งออกจีน (Nansha)',
    productName: 'มังคุดสดคัดเกรดส่งออก',
    hsCode: '0804.50.30',
    destination: 'จีน (Nansha Port)',
    buyer: 'Jiangnan Fruit Logistics Group',
    quantity: '18,000 กิโลกรัม',
    price: '2,160,000 บาท',
    incoterm: 'CFR - Cost and Freight',
    reeferTemp: '12.0°C - 13.0°C',
    portLoading: 'ท่าเรือแหลมฉบัง',
    portDischarge: 'ท่าเรือหนานซา (Nansha Port, CN)',
    paymentTerm: 'T/T Advance 50% / Balance 50% against B/L',
    requiredDocs: 'Phytosanitary Certificate, Form E, Packing List'
  },
  mango_jp: {
    label: 'มะม่วงน้ำดอกไม้ ส่งออกญี่ปุ่น (ทางอากาศ)',
    productName: 'มะม่วงน้ำดอกไม้สีทองสด (ผ่านการอบไอน้ำ VHT)',
    hsCode: '0804.50.20',
    destination: 'ญี่ปุ่น (Tokyo Narita Airport)',
    buyer: 'Tokyo Agri-Produce Imports Co., Ltd.',
    quantity: '3,500 กิโลกรัม',
    price: '875,000 บาท',
    incoterm: 'CPT - Carriage Paid To (Air Freight)',
    reeferTemp: '10.0°C - 12.0°C',
    portLoading: 'สนามบินสุวรรณภูมิ (BKK)',
    portDischarge: 'สนามบินนาริตะ (NRT)',
    paymentTerm: 'T/T Net 14 วันหลังผ่านด่านกักกันพืชญี่ปุ่น',
    requiredDocs: 'Phyto Cert with VHT Endorsement, JTEPA Form, Air Waybill (AWB)'
  }
};

export default function DocumentAutoFillPage() {
  const [selectedPresetKey, setSelectedPresetKey] = useState('durian_cn');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State ข้อมูลผู้ส่งออก (Seller)
  const [seller, setSeller] = useState({
    companyName: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
    contactPerson: 'ฐิติพงศ์ ลีลาจิรวัฒน์',
    taxId: '0105562089123',
    phone: '081-234-5678',
    address: '88/12 หมู่ 2 ต.ท่าใหม่ อ.ท่าใหม่ จ.จันทบุรี 22120'
  });

  // State ข้อมูลดีลและสัญญา (Trade Spec)
  const [formData, setFormData] = useState({
    docNo: 'EXP-2026-001',
    contractDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    productName: '',
    hsCode: '',
    destination: '',
    buyer: '',
    quantity: '',
    price: '',
    incoterm: '',
    reeferTemp: '',
    portLoading: '',
    portDischarge: '',
    paymentTerm: '',
    requiredDocs: ''
  });

  // 1. โหลดข้อมูลผู้ใช้จาก users.json (ถ้ามี)
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success && (data.currentUser || data.users?.[0])) {
          const u = data.currentUser || data.users[0];
          setSeller({
            companyName: u.company || u.name || 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
            contactPerson: u.name || 'ฐิติพงศ์ ลีลาจิรวัฒน์',
            taxId: u.taxId || '0105562089123',
            phone: u.phone || '081-234-5678',
            address: u.address || '88/12 หมู่ 2 ต.ท่าใหม่ อ.ท่าใหม่ จ.จันทบุรี 22120'
          });
        }
      })
      .catch(() => console.log('Using default seller data'));

    // เติม Preset แรกทันที
    applyPreset('durian_cn');
  }, []);

  // ฟังก์ชันสลับ Preset เพื่อ Auto-Fill ทุกช่องแบบ Instant
  const applyPreset = (key) => {
    const item = AUTO_FILL_PRESETS[key];
    if (!item) return;

    setSelectedPresetKey(key);
    setFormData(prev => ({
      ...prev,
      productName: item.productName,
      hsCode: item.hsCode,
      destination: item.destination,
      buyer: item.buyer,
      quantity: item.quantity,
      price: item.price,
      incoterm: item.incoterm,
      reeferTemp: item.reeferTemp,
      portLoading: item.portLoading,
      portDischarge: item.portDischarge,
      paymentTerm: item.paymentTerm,
      requiredDocs: item.requiredDocs
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToWorkspace = async () => {
    setSaveSuccess(true);
    try {
      await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: formData.docNo,
          productName: formData.productName,
          destination: formData.destination,
          buyer: formData.buyer,
          companyName: seller.companyName,
          quantity: formData.quantity,
          price: formData.price,
          incoterm: formData.incoterm,
          deliveryTarget: formData.deliveryDate,
          currentStep: 1
        })
      });
    } catch (e) {
      console.log('Saved locally');
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '32px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1b4332', margin: '0 0 6px 0' }}>
              ⚡ ระบบกรอกฟอร์มสัญญาและเอกสารส่งออกอัตโนมัติ (Auto-Fill)
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
              เลือกรูปแบบการค้าเพื่อกรอก HS Code, Incoterms, อุณหภูมิตู้ และข้อกำหนดศุลกากรลงฟอร์มทันที
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{ padding: '9px 18px', backgroundColor: '#e9c46a', color: '#1b4332', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer' }}
            >
              🖨️ พิมพ์เอกสารสัญญา
            </button>
            <button
              onClick={handleSaveToWorkspace}
              style={{ padding: '9px 20px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer' }}
            >
              💾 บันทึกข้อมูลเข้า Workspace
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div style={{ padding: '12px 16px', backgroundColor: '#d8f3dc', color: '#1b4332', borderRadius: '8px', fontWeight: '700', marginBottom: '20px', border: '1px solid #b7e4c7' }}>
            ✅ บันทึกข้อมูลเรียบร้อยแล้ว! สามารถนำไปติดตามต่อในหน้า Status หรือ Workspace ได้ทันที
          </div>
        )}

        {/* แถบเลือก Preset Auto-Fill แบบด่วน (Quick Preset Buttons) */}
        <div style={{ backgroundColor: '#ffffff', padding: '18px 24px', borderRadius: '14px', border: '1.5px solid #1b4332', marginBottom: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#1b4332', marginBottom: '10px' }}>
            🌾 จิ้มเลือกประเภทการค้าที่ต้องการ Auto-Fill ทันที:
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.keys(AUTO_FILL_PRESETS).map(key => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: selectedPresetKey === key ? '2px solid #1b4332' : '1px solid #cbd5e1',
                  backgroundColor: selectedPresetKey === key ? '#1b4332' : '#f8fafc',
                  color: selectedPresetKey === key ? '#ffffff' : '#334155',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {AUTO_FILL_PRESETS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* กล่องแสดงผลและแก้ไขฟอร์ม (Form & Live Preview) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>

          {/* ฝั่งซ้าย: ฟิลด์ข้อมูลที่กรอกให้อัตโนมัติ (แก้ไขได้) */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1b4332', borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '16px' }}>
              📋 รายละเอียดในแบบฟอร์ม (Auto-Filled)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>รายการสินค้าส่งออก</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>พิกัดศุลกากร (HS Code)</label>
                  <input
                    type="text"
                    value={formData.hsCode}
                    onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: '700', color: '#1b4332', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>เงื่อนไข Incoterms</label>
                  <input
                    type="text"
                    value={formData.incoterm}
                    onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: '700', color: '#2d6a4f', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ผู้ซื้อปลายทาง (Buyer)</label>
                <input
                  type="text"
                  value={formData.buyer}
                  onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ปริมาณสินค้า</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>ราคารวมทั้งสัญญา</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: '700', color: '#1b4332', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>อุณหภูมิควบคุมตู้ Reefer Container</label>
                <input
                  type="text"
                  value={formData.reeferTemp}
                  onChange={(e) => setFormData({ ...formData, reeferTemp: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>เงื่อนไขการชำระเงิน (Payment Terms)</label>
                <input
                  type="text"
                  value={formData.paymentTerm}
                  onChange={(e) => setFormData({ ...formData, paymentTerm: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* ฝั่งขวา: พรีวิวสัญญาจริงที่พร้อมพิมพ์ (Document Preview) */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1b4332', paddingBottom: '14px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1b4332', margin: 0, textTransform: 'uppercase' }}>
                INTERNATIONAL SALES CONTRACT
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>หนังสือสัญญาซื้อขายส่งออกสินค้าเกษตรมาตรฐาน</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '16px' }}>
              <div>เลขที่สัญญา: <strong>{formData.docNo}</strong></div>
              <div>วันที่: <strong>{formData.contractDate}</strong></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '12.5px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#1b4332' }}>ผู้ส่งออก (SELLER):</strong>
                <div>{seller.companyName}</div>
                <div>Tax ID: {seller.taxId}</div>
                <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>{seller.address}</div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#1b4332' }}>ผู้ซื้อ (BUYER):</strong>
                <div>{formData.buyer}</div>
                <div>ปลายทาง: {formData.destination}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>สินค้า</th>
                  <th style={{ padding: '8px' }}>HS Code</th>
                  <th style={{ padding: '8px' }}>ปริมาณ</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>ราคารวม</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 8px', fontWeight: '700' }}>{formData.productName}</td>
                  <td style={{ padding: '10px 8px' }}>{formData.hsCode}</td>
                  <td style={{ padding: '10px 8px' }}>{formData.quantity}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '800', color: '#2d6a4f' }}>{formData.price}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ backgroundColor: '#f4f9f5', padding: '12px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.6', marginBottom: '24px' }}>
              <div>• <strong>เงื่อนไขการส่งมอบ:</strong> {formData.incoterm} ({formData.portLoading} ➔ {formData.portDischarge})</div>
              <div>• <strong>การควบคุมอุณหภูมิ:</strong> {formData.reeferTemp}</div>
              <div>• <strong>การชำระเงิน:</strong> {formData.paymentTerm}</div>
              <div>• <strong>เอกสารประกอบ:</strong> {formData.requiredDocs}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '30px', fontSize: '12px' }}>
              <div>
                <div style={{ width: '160px', borderBottom: '1px solid #334155', marginBottom: '4px' }}></div>
                <div>ลงชื่อผู้ส่งออก (SELLER)</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>({seller.contactPerson})</div>
              </div>
              <div>
                <div style={{ width: '160px', borderBottom: '1px solid #334155', marginBottom: '4px' }}></div>
                <div>ลงชื่อผู้ซื้อ (BUYER)</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>Authorized Signature</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}