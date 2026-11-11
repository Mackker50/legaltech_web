'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ฐานข้อมูลแบบฟอร์มคำขอใบรับรองสุขอนามัยพืช (พ.ก. 7 / DOA IPPC Standard)
const DOA_PRESETS = {
  durian_cn: {
    label: 'ทุเรียนสด ส่งออกจีน (GACC / พ.ก. 7)',
    commonName: 'ทุเรียนสด (Fresh Monthong Durian)',
    botanicalName: 'Durio zibethinus Murr.',
    hsCode: '0810.60.00',
    consignee: 'Shanghai Fresh Global Fruit Co., Ltd.',
    consigneeAddress: 'No. 888 Pudong South Road, Shanghai, China',
    destinationCountry: 'สาธารณรัฐประชาชนจีน (China)',
    pointOfEntry: 'Shanghai Port, China',
    transportMode: 'ทางเรือ (Sea Freight - Reefer Container)',
    conveyanceName: 'COSCO Shipping Line V.2026E',
    packhouseGmp: 'DOA-GMP-22-0045 (โรงคัดบรรจุผลไม้สดมาตรฐานส่งออก)',
    orchardGap: 'GAP-TH-22-19882 (แปลงปลูกที่ผ่านการรับรองจาก กวก.)',
    numPackages: '1,388 กล่องกระดาษลูกฟูก (Cartons)',
    declaredWeight: '25,000 กิโลกรัม (Net Weight) / 26,500 กิโลกรัม (Gross Weight)',
    distinguishingMarks: 'THAI BEST DURIAN / LOT NO. 2026-NOV-01',
    treatmentType: 'การคัดแยก ทำความสะอาดเป่าลมแรงดันสูง และตรวจปล่อยศัตรูพืช (Visual Inspection & Air Blast)',
    chemicalUsed: 'N/A (ไม่ใช้สารเคมีรมยา)',
    temperatureDuration: '13.0°C - 14.5°C ตลอดการเดินทาง',
    additionalDeclaration: 'The consignment of fresh durian fruits complies with the Protocol of Phytosanitary Requirements for Export of Fruits from Thailand to China, and is free from quarantine pests: Planococcus minor and Pseudococcus jackbeardsleyi.'
  },
  mangosteen_cn: {
    label: 'มังคุดสด ส่งออกจีน (GACC / พ.ก. 7)',
    commonName: 'มังคุดสด (Fresh Mangosteen)',
    botanicalName: 'Garcinia mangostana L.',
    hsCode: '0804.50.30',
    consignee: 'Guangzhou Jiangnan Fruit Wholesale Logistics Co., Ltd.',
    consigneeAddress: 'Jiangnan Market, Baiyun District, Guangzhou, China',
    destinationCountry: 'สาธารณรัฐประชาชนจีน (China)',
    pointOfEntry: 'Nansha Port, Guangzhou, China',
    transportMode: 'ทางเรือ (Sea Freight)',
    conveyanceName: 'SITC Container Lines V.442N',
    packhouseGmp: 'DOA-GMP-22-0091',
    orchardGap: 'GAP-TH-22-04512',
    numPackages: '2,000 กล่องลูกฟูก / ตะกร้าพลาสติก',
    declaredWeight: '18,000 กิโลกรัม (Net Weight)',
    distinguishingMarks: 'PREMIUM THAI MANGOSTEEN / CN-EXP',
    treatmentType: 'การเป่าลมแรงดันสูงทำความสะอาดขั้วผล (Air-pressure cleaning)',
    chemicalUsed: 'N/A',
    temperatureDuration: '12.0°C - 13.0°C',
    additionalDeclaration: 'The fruit has been inspected and found free from Pseudococcus cryptus and Bactrocera carambolae according to the phytosanitary protocol agreed between Thailand and China.'
  },
  mango_jp: {
    label: 'มะม่วงน้ำดอกไม้ ส่งออกญี่ปุ่น (อบไอน้ำ VHT / MAFF)',
    commonName: 'มะม่วงน้ำดอกไม้สีทองสด (Fresh Nam Dok Mai Mango)',
    botanicalName: 'Mangifera indica L.',
    hsCode: '0804.50.20',
    consignee: 'Tokyo Agri-Produce Imports Co., Ltd.',
    consigneeAddress: 'Ota Market, Ota-ku, Tokyo 143-0001, Japan',
    destinationCountry: 'ประเทศญี่ปุ่น (Japan)',
    pointOfEntry: 'Narita International Airport (NRT)',
    transportMode: 'ทางอากาศ (Air Freight)',
    conveyanceName: 'Thai Airways Flight TG642',
    packhouseGmp: 'DOA-GMP-VHT-012 (โรงงานที่ผ่านการตรวจรับรองโดย MAFF Japan)',
    orchardGap: 'GAP-TH-18-09144',
    numPackages: '700 กล่องส่งออก (กล่องละ 5 กก.)',
    declaredWeight: '3,500 กิโลกรัม (Net Weight)',
    distinguishingMarks: 'VHT TREATED GOLDEN MANGO / MAFF VERIFIED',
    treatmentType: 'การอบไอน้ำปรับอุณหภูมิความชื้นสัมพัทธ์ (Vapour Heat Treatment - VHT)',
    chemicalUsed: 'N/A (กระบวนการใช้ความร้อน ไม่ใช้สารเคมีตกค้าง)',
    temperatureDuration: 'อุณหภูมิเนื้อผลถึง 46.8°C คงไว้เป็นเวลาไม่น้อยกว่า 10 นาที',
    additionalDeclaration: 'The consignment was treated with Vapour Heat Treatment (VHT) under the supervision of the Department of Agriculture (DOA) Thailand and the MAFF Japan Phytosanitary Inspector.'
  },
  rice_us: {
    label: 'ข้าวหอมมะลิไทย ส่งออกสหรัฐอเมริกา (FDA / รมยา พ.ก. 7)',
    commonName: 'ข้าวหอมมะลิไทย (Thai Hom Mali Rice 100%)',
    botanicalName: 'Oryza sativa L.',
    hsCode: '1006.30.90',
    consignee: 'Pacific American Asian Foods Distributors Inc.',
    consigneeAddress: 'Long Beach Commerce Park, CA 90802, USA',
    destinationCountry: 'สหรัฐอเมริกา (United States of America)',
    pointOfEntry: 'Port of Long Beach / Los Angeles, CA',
    transportMode: 'ทางเรือ (Sea Freight - 20ft Dry FCL)',
    conveyanceName: 'Evergreen Marine V.0881W',
    packhouseGmp: 'DOA-RICE-EXP-088 (โรงสีและบรรจุเพื่อการส่งออก)',
    orchardGap: 'GAP-THAI-RICES-NORTHEAST',
    numPackages: '500 กระสอบ (กระสอบละ 50 กก.)',
    declaredWeight: '25 ตันเมตริก (Metric Tons)',
    distinguishingMarks: 'THAI HOM MALI RICE / FDA FACILITY NO. 18928371900',
    treatmentType: 'การรมยาฆ่าแมลงและมอดในเมล็ดข้าว (Fumigation Treatment)',
    chemicalUsed: 'Aluminium Phosphide (Phosphine Gas)',
    temperatureDuration: 'ความเข้มข้น 2-3 g/m3 คงอุณหภูมิ 25-30°C ไม่น้อยกว่า 120 ชั่วโมง (5 วัน)',
    additionalDeclaration: 'The cargo has been fumigated and thoroughly examined, certified free from living storage insect pests and regulated weeds.'
  }
};

export default function StandaloneDOAAutoFillPage() {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState('durian_cn');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // ข้อมูลผู้ขอ / ผู้ส่งออก (ดึงจาก data/users.json)
  const [applicant, setApplicant] = useState({
    companyName: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
    contactPerson: 'ฐิติพงศ์ ลีลาจิรวัฒน์',
    taxId: '0105562089123',
    phone: '081-234-5678',
    email: 'thitipong@agrilegal.pro',
    address: '88/12 หมู่ 2 ต.ท่าใหม่ อ.ท่าใหม่ จ.จันทบุรี 22120',
    doaRegNo: 'DOA-EXP-REG-2026-0891'
  });

  // ข้อมูลฟอร์มกรมวิชาการเกษตรครบทั้ง 6 หมวด
  const [form, setForm] = useState({
    formNumber: 'พ.ก. 7 (DOA-PSCO-2026-009)',
    applicationDate: new Date().toISOString().split('T')[0],
    ...DOA_PRESETS.durian_cn
  });

  useEffect(() => {
    fetch('/api/users', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && (data.currentUser || data.users?.[0])) {
          const u = data.currentUser || data.users[0];
          setApplicant((prev) => ({
            ...prev,
            companyName: u.company || u.companyName || u.name || prev.companyName,
            contactPerson: u.name || u.fullName || prev.contactPerson,
            taxId: u.taxId || prev.taxId,
            phone: u.phone || prev.phone,
            email: u.email || prev.email,
            address: u.address || prev.address
          }));
        }
      })
      .catch((err) => console.warn('Using default applicant info:', err));
  }, []);

  const handleApplyPreset = (key) => {
    const item = DOA_PRESETS[key];
    if (!item) return;
    setSelectedKey(key);
    setForm((prev) => ({
      ...prev,
      ...item
    }));
  };

  const handleSaveToDeals = async () => {
    setLoading(true);
    const payload = {
      dealId: form.formNumber,
      productName: form.commonName,
      destination: form.destinationCountry,
      buyer: form.consignee,
      companyName: applicant.companyName,
      quantity: form.declaredWeight,
      price: 'ตามข้อตกลงทางการค้า',
      incoterm: 'FOB / CIF Official Inspection',
      deliveryTarget: form.applicationDate,
      currentStep: 2,
      docTitle: 'คำขอใบรับรองสุขอนามัยพืช (พ.ก. 7)',
      docType: 'PHYTO',
      status: 'PENDING',
      date: form.applicationDate
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('active_deal', JSON.stringify(payload));
      }
      await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSaveSuccess(true);
      setTimeout(() => router.push('/status'), 1200);
    } catch (e) {
      console.warn('API error, redirecting using local state:', e);
      setSaveSuccess(true);
      setTimeout(() => router.push('/status'), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '32px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#e9f5ed', color: '#1b4332', padding: '3px 8px', borderRadius: '4px' }}>
                DOA AGRICULTURAL EXPORT PROTOCOL
              </span>
              <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                แบบคำขอใบรับรองสุขอนามัยพืช (พ.ก. 7) กลุ่มบริการส่งออกสินค้าเกษตร กรมวิชาการเกษตร
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1b4332', margin: 0 }}>
              🌿 ระบบช่วยกรอกแบบฟอร์มคำขอส่งออกพืช (พ.ก. 7) อัตโนมัติ
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/documents"
              style={{ padding: '9px 18px', backgroundColor: '#ffffff', color: '#1b4332', border: '1.5px solid #1b4332', borderRadius: '8px', fontWeight: '700', fontSize: '13.5px', textDecoration: 'none' }}
            >
              ← กลับไปคลังเอกสาร
            </Link>
            <button
              onClick={() => window.print()}
              style={{ padding: '9px 18px', backgroundColor: '#e9c46a', color: '#1b4332', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer' }}
            >
              🖨️ พิมพ์แบบ พ.ก. 7
            </button>
            <button
              onClick={handleSaveToDeals}
              disabled={loading}
              style={{ padding: '9px 20px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '13.5px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'กำลังส่งข้อมูล...' : '💾 บันทึกคำขอเข้าดีล ➔'}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div style={{ padding: '12px 16px', backgroundColor: '#d8f3dc', color: '#1b4332', borderRadius: '8px', fontWeight: '700', marginBottom: '20px', border: '1px solid #b7e4c7' }}>
            ✅ บันทึกแบบฟอร์มคำขอ พ.ก. 7 เรียบร้อยแล้ว กำลังนำท่านไปยังหน้าติดตามสถานะ...
          </div>
        )}

        {/* แถบเลือก Preset ทางการเกษตร */}
        <div style={{ backgroundColor: '#ffffff', padding: '18px 24px', borderRadius: '14px', border: '1.5px solid #1b4332', marginBottom: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#1b4332', marginBottom: '10px' }}>
            🌾 เลือกประเภทสินค้าและพิธีสารปลายทาง (ระบบจะกรอกข้อมูลทางพฤกษศาสตร์และสารเคมีให้ทันที):
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.keys(DOA_PRESETS).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleApplyPreset(key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: selectedKey === key ? '2px solid #1b4332' : '1px solid #cbd5e1',
                  backgroundColor: selectedKey === key ? '#1b4332' : '#f8fafc',
                  color: selectedKey === key ? '#ffffff' : '#334155',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {DOA_PRESETS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* ฟอร์มกรอกข้อมูลตามระเบียบกรมวิชาการเกษตร 6 หมวด */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
          
          {/* ฝั่งซ้าย: ข้อมูลที่กรอกได้และปรับแต่ง */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* หมวด 1: ข้อมูลผู้ส่งออก */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1b4332', marginBottom: '10px' }}>
                1. ข้อมูลผู้ส่งออก (Name and Address of Exporter)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <input
                  type="text"
                  placeholder="ชื่อบริษัท/สวนผู้ส่งออก"
                  value={applicant.companyName}
                  onChange={(e) => setApplicant({ ...applicant, companyName: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="เลขประจำตัวผู้เสียภาษี"
                    value={applicant.taxId}
                    onChange={(e) => setApplicant({ ...applicant, taxId: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="ทะเบียนผู้ส่งออก กวก."
                    value={applicant.doaRegNo}
                    onChange={(e) => setApplicant({ ...applicant, doaRegNo: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="ที่อยู่สถานประกอบการ"
                  value={applicant.address}
                  onChange={(e) => setApplicant({ ...applicant, address: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '12.5px' }}
                />
              </div>
            </div>

            {/* หมวด 2: ผู้รับปลายทาง */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1b4332', marginBottom: '10px' }}>
                2. ผู้รับปลายทาง (Declared Name and Address of Consignee)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <input
                  type="text"
                  placeholder="ชื่อบริษัทผู้นำเข้า"
                  value={form.consignee}
                  onChange={(e) => setForm({ ...form, consignee: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder="ที่อยู่ปลายทางในต่างประเทศ"
                  value={form.consigneeAddress}
                  onChange={(e) => setForm({ ...form, consigneeAddress: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="ประเทศปลายทาง"
                    value={form.destinationCountry}
                    onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="ด่านนำเข้า (Point of Entry)"
                    value={form.pointOfEntry}
                    onChange={(e) => setForm({ ...form, pointOfEntry: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* หมวด 3: ชื่อพืชและรหัสแปลง GAP/GMP */}
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1b4332', marginBottom: '10px' }}>
                3. พิกัดพืชและรหัสรับรอง (Botanical Name & GAP/GMP Codes)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="ชื่อสามัญ (Common Name)"
                    value={form.commonName}
                    onChange={(e) => setForm({ ...form, commonName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="ชื่อวิทยาศาสตร์ (Botanical Name)"
                    value={form.botanicalName}
                    onChange={(e) => setForm({ ...form, botanicalName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontStyle: 'italic', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="รหัสแปลง GAP สวน"
                    value={form.orchardGap}
                    onChange={(e) => setForm({ ...form, orchardGap: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                  <input
                    type="text"
                    placeholder="รหัสโรงคัดบรรจุ GMP"
                    value={form.packhouseGmp}
                    onChange={(e) => setForm({ ...form, packhouseGmp: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* หมวด 4: การกำจัดศัตรูพืช (Disinfestation Treatment) */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1b4332', marginBottom: '10px' }}>
                4. การกำจัดศัตรูพืชและการรับรองเพิ่มเติม (Disinfestation Treatment)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <input
                  type="text"
                  placeholder="วิธีการบำบัด (Treatment)"
                  value={form.treatmentType}
                  onChange={(e) => setForm({ ...form, treatmentType: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
                <input
                  type="text"
                  placeholder="อุณหภูมิและระยะเวลา (Duration and Temperature)"
                  value={form.temperatureDuration}
                  onChange={(e) => setForm({ ...form, temperatureDuration: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
                <textarea
                  rows={3}
                  placeholder="คำรับรองพิเศษตามพิธีสาร (Additional Declaration)"
                  value={form.additionalDeclaration}
                  onChange={(e) => setForm({ ...form, additionalDeclaration: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '12px', lineHeight: '1.4' }}
                />
              </div>
            </div>

          </div>

          {/* ฝั่งขวา: พรีวิวใบคำขอแบบทางการ พ.ก. 7 */}
          <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', fontSize: '12.5px', lineHeight: '1.5' }}>
            
            <div style={{ textAlign: 'center', borderBottom: '2px solid #1b4332', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d6a4f' }}>กรมวิชาการเกษตร กระทรวงเกษตรและสหกรณ์</div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#1b4332', margin: '4px 0' }}>
                คำขอใบรับรองสุขอนามัยพืช (แบบ พ.ก. 7)
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                APPLICATION FOR PHYTOSANITARY CERTIFICATE (DEPARTMENT OF AGRICULTURE, THAILAND)
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #cbd5e1', paddingBottom: '10px', marginBottom: '14px' }}>
              <div>เลขที่คำขอ: <strong>{form.formNumber}</strong></div>
              <div>วันที่ยื่นคำขอ: <strong>{form.applicationDate}</strong></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: '#1b4332', display: 'block', marginBottom: '2px' }}>1. ผู้ส่งออก (Exporter):</strong>
                <div>{applicant.companyName}</div>
                <div>Tax ID: {applicant.taxId} | ทะเบียน กวก: {applicant.doaRegNo}</div>
                <div style={{ color: '#64748b', fontSize: '11.5px', marginTop: '2px' }}>{applicant.address}</div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: '#1b4332', display: 'block', marginBottom: '2px' }}>2. ผู้รับปลายทาง (Consignee):</strong>
                <div>{form.consignee}</div>
                <div>{form.consigneeAddress}</div>
                <div style={{ color: '#2d6a4f', fontWeight: '700', marginTop: '2px' }}>ปลายทาง: {form.destinationCountry} ({form.pointOfEntry})</div>
              </div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '6px' }}>3. รายการพืชและรายละเอียดการบรรจุ:</strong>
              <div>• ชนิดพืช: <strong>{form.commonName}</strong></div>
              <div>• ชื่อวิทยาศาสตร์: <em style={{ color: '#2d6a4f', fontWeight: '700' }}>{form.botanicalName}</em> | HS Code: {form.hsCode}</div>
              <div>• รหัสแปลง GAP: {form.orchardGap}</div>
              <div>• รหัสโรงคัดบรรจุ GMP: {form.packhouseGmp}</div>
              <div>• ปริมาณและน้ำหนัก: {form.declaredWeight} ({form.numPackages})</div>
              <div>• เครื่องหมายและสัญลักษณ์หีบห่อ: {form.distinguishingMarks}</div>
            </div>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '6px' }}>4. การขนส่งและการกำจัดศัตรูพืช (Disinfestation Treatment):</strong>
              <div>• วิธีขนส่ง: {form.transportMode} ({form.conveyanceName})</div>
              <div>• วิธีบำบัดกำจัดศัตรูพืช: {form.treatmentType}</div>
              <div>• สารเคมีที่ใช้: {form.chemicalUsed}</div>
              <div>• อุณหภูมิ/ระยะเวลา: {form.temperatureDuration}</div>
            </div>

            <div style={{ backgroundColor: '#f4f9f5', border: '1px solid #b7e4c7', borderRadius: '6px', padding: '12px', marginBottom: '24px' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '4px' }}>5. ข้อความรับรองเพิ่มเติม (Additional Declaration):</strong>
              <div style={{ fontSize: '11.5px', color: '#334155', fontStyle: 'italic', lineHeight: '1.4' }}>
                "{form.additionalDeclaration}"
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', marginTop: '24px' }}>
              <div>
                <div style={{ width: '180px', borderBottom: '1px solid #334155', marginBottom: '4px' }}></div>
                <div>ลงชื่อผู้ยื่นคำขอ (Applicant)</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>({applicant.contactPerson})</div>
              </div>
              <div>
                <div style={{ width: '180px', borderBottom: '1px solid #334155', marginBottom: '4px' }}></div>
                <div>พนักงานเจ้าหน้าที่ผู้ตรวจพืช</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>กลุ่มบริการส่งออกสินค้าเกษตร กรมวิชาการเกษตร</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}