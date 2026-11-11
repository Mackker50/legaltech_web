'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function TransactionStatusPage() {
  const context = useAppContext() || {};

  // กำหนดให้เริ่มต้นที่ Step 1 เสมอ
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // State สำหรับ Step 2: อัปโหลดเอกสาร & สร้างสัญญา
  const [activeDocTab, setActiveDocTab] = useState('upload');
  const [selectedDocTypeToGenerate, setSelectedDocTypeToGenerate] = useState('contract');

  // ข้อมูลเอกสารใน Step 2
  const [documents, setDocuments] = useState([
    { id: 'doc-1', name: 'ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate)', code: 'PHYTO', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-2', name: 'หนังสือสัญญาซื้อขายส่งออก (Export Sales Contract)', code: 'CONTRACT', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-3', name: 'ใบตราส่งสินค้าทางเรือ (Bill of Lading - B/L)', code: 'BL', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-4', name: 'ใบกำกับสินค้า (Commercial Invoice)', code: 'INVOICE', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-5', name: 'ใบรับรองแหล่งกำเนิดสินค้า (Certificate of Origin - C/O)', code: 'CO', required: false, uploaded: false, fileName: '', fileUrl: '' }
  ]);

  // State สำหรับ Step 3: Timeline สถานะตรวจสอบเอกสารแนวตั้ง
  const [auditTimeline, setAuditTimeline] = useState([
    {
      id: 1,
      title: 'ตรวจสอบใบรับรองสุขอนามัยพืช (Phytosanitary Certificate)',
      dept: 'กรมวิชาการเกษตร',
      status: 'success',
      time: '10 พ.ย. 2026 - 09:30 น.',
      remark: 'ตรวจสอบศัตรูพืชและสารตกค้างผ่านเกณฑ์มาตรฐานส่งออก'
    },
    {
      id: 2,
      title: 'ตรวจสอบสัญญาซื้อขายส่งออกและใบกำกับสินค้า',
      dept: 'กรมการค้าต่างประเทศ',
      status: 'success',
      time: '10 พ.ย. 2026 - 14:15 น.',
      remark: 'เอกสารสัญญาและพิกัดศุลกากรถูกต้องสมบูรณ์'
    },
    {
      id: 3,
      title: 'ยื่นพิธีการศุลกากรขาออก (Export Customs Clearance)',
      dept: 'กรมศุลกากร',
      status: 'pending',
      time: 'กำลังดำเนินการ...',
      remark: 'เจ้าหน้าที่กำลังตรวจสอบรายการสินค้าและใบขนสินค้าขาออก'
    },
    {
      id: 4,
      title: 'ตรวจรับรอง Certificate of Origin (C/O Form E)',
      dept: 'สภาหอการค้าแห่งประเทศไทย',
      status: 'pending',
      time: 'รอดำเนินการ',
      remark: 'รอผลอนุมัติพิธีการศุลกากรขาออกก่อนยื่นออกหนังสือรับรอง'
    }
  ]);

  // State สำหรับ Step 4: Timeline สถานะการจัดส่งสินค้าเกษตรแนวตั้ง
  const [shippingTimeline, setShippingTimeline] = useState([
    {
      id: 1,
      title: 'บรรจุสินค้าลงตู้คอนเทนเนอร์ห้องเย็น (Reefer Container Loading)',
      location: 'ลานบรรจุสินค้า จ.จันทบุรี',
      status: 'success',
      time: '11 พ.ย. 2026 - 06:00 น.',
      remark: 'บรรจุสินค้าเรียบร้อยแล้ว ตั้งอุณหภูมิควบคุมไว้ที่ 13°C'
    },
    {
      id: 2,
      title: 'ขนย้ายตู้สินค้าถึงท่าเรือขาออก (Arrival at Port of Origin)',
      location: 'ท่าเรือแหลมฉบัง (Laem Chabang Port)',
      status: 'success',
      time: '11 พ.ย. 2026 - 13:45 น.',
      remark: 'ตู้คอนเทนเนอร์ผ่านการตรวจชั่งน้ำหนักและเข้าสู่ลานตู้สินค้าเรียบร้อย'
    },
    {
      id: 3,
      title: 'ยกตู้สินค้าขึ้นเรือและเรือออกเดินทาง (Vessel Departure)',
      location: 'สายการเรือ COSCO Shipping Line (Vessel V.2026E)',
      status: 'pending',
      time: 'คาดการณ์ 12 พ.ย. 2026 - 08:00 น.',
      remark: 'กำลังรอการยกตู้ขึ้นเรือตามตารางการเดินเรือ'
    },
    {
      id: 4,
      title: 'เรือเดินทางถึงท่าเรือปลายทาง (Arrival at Destination Port)',
      location: 'ท่าเรือปลายทาง Shanghai Port, China',
      status: 'pending',
      time: 'คาดการณ์ 18 พ.ย. 2026',
      remark: 'อยู่ระหว่างเตรียมการสำหรับการขนส่งทางทะเล'
    }
  ]);

  // ตัวเลือกสินค้าเกษตร & ประเทศ
  const productOptions = [
    'ทุเรียนหมอนทองสด',
    'ทุเรียนแช่แข็ง',
    'มังคุดสด',
    'มะม่วงน้ำดอกไม้สด',
    'สับปะรดภูเก็ต / ภูแล',
    'ลำไยอบแห้ง / สด',
    'ข้าวหอมมะลิไทย',
    'ยางพาราแผ่นดิบ / ยางแท่ง'
  ];

  const destinationOptions = [
    'ญี่ปุ่น (ท่าเรือ Tokyo / Yokohama)',
    'เกาหลีใต้ (ท่าเรือ Busan)',
    'เวียดนาม (ด่านเส้นทางบก / ท่าเรือ)',
    'สิงคโปร์',
    'สหรัฐอเมริกา (Los Angeles / Long Beach)',
    'สหภาพยุโรป (Rotterdam)'
  ];

  const incotermsList = [
    { code: 'EXW', name: 'Ex Works (ส่งมอบหน้าสวน/โรงงาน)' },
    { code: 'FCA', name: 'Free Carrier (ส่งมอบให้ผู้ขนส่ง)' },
    { code: 'FOB', name: 'Free on Board (ส่งมอบขึ้นเรือ)' },
    { code: 'CFR', name: 'Cost and Freight (รวมค่าขนส่งถึงปลายทาง)' },
    { code: 'CIF', name: 'Cost, Insurance & Freight (รวมค่าขนส่ง+ประกันภัย)' },
    { code: 'DDP', name: 'Delivered Duty Paid (ส่งมอบถึงที่รวมภาษี)' }
  ];

  const [dealData, setDealData] = useState({
    dealId: 'EXP-' + new Date().getFullYear() + '-001',
    productName: '',
    destination: '',
    buyer: '',
    quantity: '',
    incoterm: '',
    incotermCode: '',
    deliveryTarget: '',
    price: '',
    companyName: ''
  });

  // Helper แปลงรูปแบบวันที่ให้ปลอดภัยสำหรับ input type="date"
  const formatDateForInput = (val) => {
    if (!val || typeof val !== 'string') return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    const parsed = new Date(val);
    if (isNaN(parsed.getTime())) return '';
    return parsed.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchDealData();
  }, []);

  const fetchDealData = async () => {
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      if (data.success && data.deals && data.deals.length > 0) {
        const latestDeal = data.deals[data.deals.length - 1];
        if (latestDeal && latestDeal.productName) {
          setDealData(prev => ({
            ...prev,
            ...latestDeal,
            dealId: latestDeal.dealId || prev.dealId,
            productName: latestDeal.productName || '',
            destination: latestDeal.destination || '',
            buyer: latestDeal.buyer || '',
            quantity: latestDeal.quantity || '',
            incoterm: latestDeal.incoterm || '',
            incotermCode: latestDeal.incotermCode || '',
            deliveryTarget: latestDeal.deliveryTarget || '',
            price: latestDeal.price || '',
            companyName: latestDeal.companyName || ''
          }));
          if (latestDeal.documents) setDocuments(latestDeal.documents);
          if (latestDeal.auditTimeline) setAuditTimeline(latestDeal.auditTimeline);
          if (latestDeal.shippingTimeline) setShippingTimeline(latestDeal.shippingTimeline);
        }
      }
    } catch (err) {
      console.error('Error loading deal:', err);
    } finally {
      // บังคับให้เป็น Step 1 เสมอทุกครั้งที่เปิดหน้านี้
      setCurrentStep(1);
    }
  };

  const handleSaveDeal = async (
    updatedData = dealData, 
    updatedDocs = documents, 
    updatedAudit = auditTimeline,
    updatedShipping = shippingTimeline,
    stepToSave = currentStep
  ) => {
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...updatedData, 
          documents: updatedDocs, 
          auditTimeline: updatedAudit, 
          shippingTimeline: updatedShipping,
          currentStep: stepToSave
        }),
      });

      const data = await res.json();
      if (data.success && data.deal) {
        setDealData(prev => ({ ...prev, ...data.deal }));
        if (data.deal.documents) setDocuments(data.deal.documents);
        if (data.deal.auditTimeline) setAuditTimeline(data.deal.auditTimeline);
        if (data.deal.shippingTimeline) setShippingTimeline(data.deal.shippingTimeline);
        setStatusMsg({ type: 'success', text: 'บันทึกข้อมูลเรียบร้อยแล้ว' });
        setIsFormOpen(false);
      } else {
        setStatusMsg({ type: 'error', text: data?.message || 'บันทึกไม่สำเร็จ' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'ไม่สามารถเชื่อมต่อระบบได้' });
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันอัปโหลดไฟล์จริง
  const handleFileUpload = (docId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUrl = e.target.result;
      const updatedDocs = documents.map(doc => {
        if (doc.id === docId) {
          return { ...doc, uploaded: true, fileName: file.name, fileUrl };
        }
        return doc;
      });
      setDocuments(updatedDocs);
      handleSaveDeal(dealData, updatedDocs, auditTimeline, shippingTimeline, currentStep);
    };
    reader.readAsDataURL(file);
  };

  // พิมพ์สัญญา
  const handlePrintDocument = (title) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - ${dealData.dealId}</title>
          <style>
            body { font-family: 'Sarabun', sans-serif; padding: 40px; line-height: 1.6; }
            h1 { text-align: center; color: #1b4332; }
            .box { border: 1px solid #ccc; padding: 20px; margin-top: 20px; border-radius: 8px; }
            .field { margin-bottom: 12px; }
            .label { font-weight: bold; color: #333; }
            .footer { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
            .sign-line { border-top: 1px solid #333; width: 200px; margin-top: 60px; padding-top: 5px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p style="text-align: right;">เลขที่เอกสาร: ${dealData.dealId}</p>
          <p style="text-align: right;">วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
          
          <div class="box">
            <div class="field"><span class="label">ผู้ส่งออก (Exporter):</span> ${dealData.companyName || '...................................................'}</div>
            <div class="field"><span class="label">ผู้ซื้อปลายทาง (Buyer):</span> ${dealData.buyer || '...................................................'}</div>
            <div class="field"><span class="label">รายการสินค้า (Commodity):</span> ${dealData.productName || '...................................................'}</div>
            <div class="field"><span class="label">ปริมาณ (Quantity):</span> ${dealData.quantity || '...................................................'}</div>
            <div class="field"><span class="label">มูลค่ารวม (Total Price):</span> ${dealData.price || '...................................................'}</div>
            <div class="field"><span class="label">เงื่อนไขส่งมอบ (Incoterms):</span> ${dealData.incoterm || '...................................................'}</div>
            <div class="field"><span class="label">ปลายทาง (Destination):</span> ${dealData.destination || '...................................................'}</div>
          </div>

          <p style="margin-top: 30px;">คู่สัญญาทั้งสองฝ่ายได้ตกลงตามข้อกำหนดและเงื่อนไขการส่งออกสินค้าเกษตรตามที่ระบุไว้ข้างต้นทุกประการ</p>

          <div class="footer">
            <div>
              <div class="sign-line">ลงชื่อผู้ส่งออก</div>
              (${dealData.companyName || 'ผู้ส่งออก'})
            </div>
            <div>
              <div class="sign-line">ลงชื่อผู้ซื้อ</div>
              (${dealData.buyer || 'ผู้ซื้อต่างประเทศ'})
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const getTimelineStatusStyle = (status) => {
    switch (status) {
      case 'success':
        return {
          bgColor: '#2d6a4f',
          color: '#ffffff',
          badgeBg: '#d8f3dc',
          badgeColor: '#1b4332',
          border: '2px solid #2d6a4f',
          icon: '✓',
          text: 'ดำเนินการสำเร็จ'
        };
      case 'pending':
        return {
          bgColor: '#e9c46a',
          color: '#1b4332',
          badgeBg: '#fff3cd',
          badgeColor: '#856404',
          border: '2px solid #e9c46a',
          icon: '🚚',
          text: 'กำลังขนส่ง / ดำเนินการ'
        };
      case 'failed':
        return {
          bgColor: '#e63946',
          color: '#ffffff',
          badgeBg: '#fff0f0',
          badgeColor: '#e63946',
          border: '2px solid #e63946',
          icon: '✕',
          text: 'การขนส่งมีปัญหา / ล่าช้า'
        };
      default:
        return {
          bgColor: '#6c757d',
          color: '#ffffff',
          badgeBg: '#e9ecef',
          badgeColor: '#495057',
          border: '2px solid #6c757d',
          icon: '•',
          text: 'รอดำเนินการ'
        };
    }
  };

  const stepsList = [
    { num: 1, title: 'ตกลงเงื่อนไขการค้า', sub: 'เลือกสินค้า ประเทศปลายทาง และราคา' },
    { num: 2, title: 'เตรียมเอกสาร & ใบรับรอง', sub: 'แนบไฟล์จริง หรือ ให้ระบบช่วยสร้างสัญญา' },
    { num: 3, title: 'ตรวจเอกสารศุลกากร', sub: 'ติดตามสถานะการอนุมัติเอกสาร' },
    { num: 4, title: 'ขนส่งสินค้าทางทะเล', sub: 'ติดตามสถานะการจัดส่งสินค้าเกษตร' },
    { num: 5, title: 'ส่งมอบสำเร็จ', sub: 'ผู้ซื้อปลายทางรับมอบสินค้าเรียบร้อย' }
  ];

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '92vh', padding: '24px 32px', width: '100%', boxSizing: 'border-box', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ width: '100%' }}>

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: '#1b4332', fontWeight: '800', margin: '0 0 4px 0' }}>
              ติดตามสถานะส่งออกสินค้าเกษตร
            </h1>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              รหัสรายการ: <span style={{ color: '#1b4332', fontWeight: '700' }}>{dealData.dealId}</span> {dealData.productName ? `(${dealData.productName})` : ''}
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              style={{ padding: '10px 20px', backgroundColor: isFormOpen ? '#6c757d' : '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(27,67,50,0.15)' }}
            >
              {isFormOpen ? '✕ ปิดหน้าเลือกข้อมูล' : '➕ จิ้มเลือกข้อมูลส่งออกใหม่'}
            </button>
          </div>
        </div>

        {statusMsg && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', backgroundColor: statusMsg.type === 'success' ? '#d8f3dc' : '#fff0f0', color: statusMsg.type === 'success' ? '#1b4332' : '#e63946', border: `1px solid ${statusMsg.type === 'success' ? '#b7e4c7' : '#ffcdd2'}` }}>
            {statusMsg.text}
          </div>
        )}

        {/* ฟอร์มเลือกข้อมูล */}
        {isFormOpen && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveDeal(); }} style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '14px', border: '2px solid #1b4332', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ gridColumn: 'span 3', fontSize: '18px', color: '#1b4332', fontWeight: '800', margin: '0 0 6px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
              🌾 เมนูลดการพิมพ์: จิ้มเลือกข้อมูลส่งออกของคุณ
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>1. เลือกประเภทสินค้าเกษตร <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.productName || ''} onChange={(e) => setDealData({ ...dealData, productName: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- คลิกเพื่อเลือกสินค้า --</option>
                {productOptions.map((item, idx) => (<option key={idx} value={item}>📦 {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>2. เลือกประเทศปลายทางที่จะส่ง <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.destination || ''} onChange={(e) => setDealData({ ...dealData, destination: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- คลิกเพื่อเลือกประเทศ --</option>
                {destinationOptions.map((item, idx) => (<option key={idx} value={item}>✈️ {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>3. เลือกเงื่อนไขส่งมอบ (Incoterms)</label>
              <select value={dealData.incotermCode || ''} onChange={(e) => setDealData({ ...dealData, incotermCode: e.target.value, incoterm: `${e.target.value}` })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- คลิกเพื่อเลือกเงื่อนไข --</option>
                {incotermsList.map(item => (<option key={item.code} value={item.code}>{item.code} - {item.name}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อกลุ่มเกษตรกร / บริษัทผู้ส่งออก <span style={{ color: '#e63946' }}>*</span></label>
              <input type="text" required placeholder="เช่น กลุ่มเกษตรกรสวนทุเรียน หรือ ชื่อบริษัท" value={dealData.companyName || ''} onChange={(e) => setDealData({ ...dealData, companyName: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อบริษัทผู้ซื้อปลายทาง (Buyer)</label>
              <input type="text" placeholder="เช่น Shanghai Fresh Import Co." value={dealData.buyer || ''} onChange={(e) => setDealData({ ...dealData, buyer: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ปริมาณสินค้าทั้งหมด</label>
              <input type="text" placeholder="เช่น 25,000 กิโลกรัม (1 ตู้เย็น)" value={dealData.quantity || ''} onChange={(e) => setDealData({ ...dealData, quantity: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ราคารวมธุรกรรม (บาท)</label>
              <input type="text" placeholder="เช่น 4,500,000 บาท" value={dealData.price || ''} onChange={(e) => setDealData({ ...dealData, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>กำหนดวันที่ส่งมอบ</label>
              <input type="date" value={formatDateForInput(dealData.deliveryTarget)} onChange={(e) => setDealData({ ...dealData, deliveryTarget: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }} />
            </div>

            <div style={{ gridColumn: 'span 3', textAlign: 'right', marginTop: '10px' }}>
              <button type="submit" disabled={loading} style={{ padding: '12px 32px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? '⚡ กำลังบันทึก...' : '💾 ยืนยันและบันทึกข้อมูลดีล'}
              </button>
            </div>
          </form>
        )}

        {/* Stepper Display */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '15px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0' }}>
            ความคืบหน้าขั้นตอนส่งออก (Transaction Stepper)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
            {stepsList.map((st) => {
              const isActive = currentStep === st.num;
              const isPassed = currentStep > st.num;
              return (
                <div
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  style={{
                    backgroundColor: isActive ? '#1b4332' : isPassed ? '#f4f9f5' : '#f8f9fa',
                    color: isActive ? '#ffffff' : '#212529',
                    borderRadius: '10px',
                    padding: '16px 14px',
                    border: isActive ? '2px solid #e9c46a' : isPassed ? '1px solid #d8f3dc' : '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '90px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', opacity: isActive ? 0.9 : 0.6, marginBottom: '4px' }}>
                      STEP 0{st.num} {isPassed && '✓'}
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', lineHeight: '1.3' }}>
                      {st.title}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', opacity: isActive ? 0.8 : 0.6, marginTop: '6px' }}>
                    {st.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Display Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', width: '100%' }}>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: 0 }}>
                    รายละเอียดเงื่อนไขส่งออกที่เลือกไว้
                  </h3>
                  {!dealData.productName && (
                    <button onClick={() => setIsFormOpen(true)} style={{ backgroundColor: '#fefae0', color: '#bc6c25', border: '1px solid #dda15e', padding: '6px 14px', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>
                      👉 คลิกที่นี่เพื่อจิ้มเลือกข้อมูล
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: '24px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>สินค้าเกษตรส่งออก:</span>
                    <strong style={{ color: dealData.productName ? '#1b4332' : '#adb5bd', fontSize: '15px' }}>
                      {dealData.productName ? `📦 ${dealData.productName}` : '- ยังไม่ได้เลือกสินค้า -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>ปริมาณ:</span>
                    <strong style={{ color: dealData.quantity ? '#1b4332' : '#adb5bd', fontSize: '15px' }}>
                      {dealData.quantity || '- ยังไม่ได้ระบุ -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>ประเทศปลายทาง:</span>
                    <strong style={{ color: dealData.destination ? '#1b4332' : '#adb5bd', fontSize: '15px' }}>
                      {dealData.destination ? `✈️ ${dealData.destination}` : '- ยังไม่ได้เลือกประเทศ -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>เงื่อนไข Incoterms:</span>
                    <strong style={{ color: dealData.incoterm ? '#1b4332' : '#adb5bd', fontSize: '15px' }}>
                      {dealData.incoterm ? `📖 ${dealData.incoterm}` : '- ยังไม่ได้เลือกเงื่อนไข -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>ผู้ซื้อปลายทาง:</span>
                    <strong style={{ color: dealData.buyer ? '#1b4332' : '#adb5bd', fontSize: '15px' }}>
                      {dealData.buyer || '- ยังไม่ได้ระบุ -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>กำหนดวันที่ส่งมอบ:</span>
                    <strong style={{ color: dealData.deliveryTarget ? '#1b4332' : '#adb5bd', fontSize: '15px' }}>
                      {dealData.deliveryTarget || '- ยังไม่ได้ระบุ -'}
                    </strong>
                  </div>
                </div>

                <div style={{ backgroundColor: dealData.price ? '#f4f9f5' : '#f8f9fa', border: dealData.price ? '1px solid #d8f3dc' : '1px dashed #ced4da', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                  <div style={{ fontSize: '14px', color: '#1b4332', fontWeight: '600' }}>
                    ราคารวมธุรกรรม: <span style={{ color: dealData.price ? '#2d6a4f' : '#adb5bd', fontSize: '17px', fontWeight: '800' }}>{dealData.price || '- ยังไม่ได้ระบุราคา -'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  📁 STEP 02: อัปโหลดเอกสาร & ช่วยทำหนังสือสัญญาการค้า
                </h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setActiveDocTab('upload')}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeDocTab === 'upload' ? '#1b4332' : '#e9ecef', color: activeDocTab === 'upload' ? '#ffffff' : '#495057', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    📤 1. อัปโหลดเอกสารจากเครื่อง (Upload Files)
                  </button>
                  <button
                    onClick={() => setActiveDocTab('generator')}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeDocTab === 'generator' ? '#1b4332' : '#e9ecef', color: activeDocTab === 'generator' ? '#ffffff' : '#495057', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    📝 2. ระบบช่วยสร้างหนังสือสัญญา (Contract Builder)
                  </button>
                </div>

                {activeDocTab === 'upload' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#6c757d', margin: '0 0 4px 0' }}>
                      เลือกอัปโหลดไฟล์เอกสารสำคัญในการจัดส่งสินค้าเกษตร (รองรับ PDF, PNG, JPG):
                    </p>
                    {documents.map((doc) => (
                      <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: doc.uploaded ? '#f4f9f5' : '#f8f9fa', border: doc.uploaded ? '1.5px solid #b7e4c7' : '1px solid #e9ecef', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1b4332' }}>
                            {doc.name} {doc.required && <span style={{ color: '#e63946' }}>*</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: doc.uploaded ? '#2d6a4f' : '#6c757d', marginTop: '2px' }}>
                            {doc.uploaded ? `✅ อัปโหลดสำเร็จ: ${doc.fileName}` : '⚪ ยังไม่ได้อัปโหลดเอกสาร'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          {doc.uploaded && (
                            <a href={doc.fileUrl} download={doc.fileName} style={{ padding: '6px 12px', backgroundColor: '#e9ecef', color: '#212529', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                              👁️ ดูไฟล์
                            </a>
                          )}
                          <label style={{ padding: '6px 14px', backgroundColor: '#1b4332', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            {doc.uploaded ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                            <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(doc.id, e)} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeDocTab === 'generator' && (
                  <div style={{ backgroundColor: '#f4f9f5', border: '1.5px solid #d8f3dc', padding: '20px', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1b4332', fontSize: '15px', fontWeight: '800' }}>
                      🤖 ระบบช่วยทำหนังสือสัญญาการค้าสำหรับเกษตรกร
                    </h4>
                    <p style={{ fontSize: '13px', color: '#495057', margin: '0 0 16px 0' }}>
                      ระบบจะดึงข้อมูลสินค้า ({dealData.productName || 'ทุเรียน'}), ผู้ซื้อ ({dealData.buyer || 'ผู้ซื้อ'}), และราคาส่งออก เพื่อสร้างสัญญามาตรฐานทางกฎหมายให้อัตโนมัติ
                    </p>

                    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <button onClick={() => setSelectedDocTypeToGenerate('contract')} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #1b4332', backgroundColor: selectedDocTypeToGenerate === 'contract' ? '#1b4332' : '#fff', color: selectedDocTypeToGenerate === 'contract' ? '#fff' : '#1b4332', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}>
                        📄 สัญญาซื้อขายส่งออก (Export Sales Contract)
                      </button>
                      <button onClick={() => setSelectedDocTypeToGenerate('invoice')} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #1b4332', backgroundColor: selectedDocTypeToGenerate === 'invoice' ? '#1b4332' : '#fff', color: selectedDocTypeToGenerate === 'invoice' ? '#fff' : '#1b4332', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}>
                        🧾 ใบกำกับสินค้า (Commercial Invoice)
                      </button>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '13px', marginBottom: '16px' }}>
                      <div style={{ fontWeight: '700', color: '#1b4332', marginBottom: '8px' }}>Preview เอกสารพร้อมพิมพ์:</div>
                      <div>• ผู้ส่งออก: {dealData.companyName || '(กรอกใน Step 1)'}</div>
                      <div>• ผู้ซื้อ: {dealData.buyer || '(กรอกใน Step 1)'}</div>
                      <div>• สินค้า: {dealData.productName || '(กรอกใน Step 1)'} | ปริมาณ: {dealData.quantity || '-'}</div>
                      <div>• ราคารวม: {dealData.price || '-'} | Incoterms: {dealData.incoterm || '-'}</div>
                    </div>

                    <button
                      onClick={() => handlePrintDocument(selectedDocTypeToGenerate === 'contract' ? 'หนังสือสัญญาซื้อขายส่งออกสินค้าเกษตร' : 'ใบกำกับสินค้าส่งออก (Commercial Invoice)')}
                      style={{ padding: '10px 24px', backgroundColor: '#e9c46a', color: '#1b4332', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    >
                      🖨️ พิมพ์ / บันทึกสัญญาเป็นไฟล์ PDF
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div>
                <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                    📋 STEP 03: สถานะการตรวจสอบเอกสารและใบรับรอง (Audit Timeline)
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#6c757d', margin: '4px 0 0 0' }}>
                    ติดตามการอนุมัติเอกสารจากหน่วยงานภาครัฐในรูปแบบเส้น Timeline แบบเรียลไทม์
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: '#f8f9fa', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e9ecef', fontSize: '12.5px', fontWeight: '600' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2d6a4f' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2d6a4f' }}></span> 🟢 สีเขียว: สำเร็จแล้ว
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#856404' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e9c46a' }}></span> 🟡 สีเหลือง: กำลังตรวจสอบ
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e63946' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e63946' }}></span> 🔴 สีแดง: ไม่สำเร็จ / ไม่ผ่าน
                  </span>
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px', marginTop: '10px' }}>
                  <div style={{ position: 'absolute', top: '12px', bottom: '24px', left: '13px', width: '3px', backgroundColor: '#e9ecef', zIndex: 1 }}></div>

                  {auditTimeline.map((item, index) => {
                    const style = getTimelineStatusStyle(item.status);
                    const isLast = index === auditTimeline.length - 1;

                    return (
                      <div key={item.id} style={{ position: 'relative', marginBottom: isLast ? 0 : '28px', zIndex: 2 }}>
                        <div style={{
                          position: 'absolute',
                          left: '-28px',
                          top: '2px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: style.bgColor,
                          color: style.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '800',
                          border: '3px solid #ffffff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          {style.icon}
                        </div>

                        <div style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          padding: '16px 20px',
                          border: style.border,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#6c757d', letterSpacing: '0.5px' }}>
                                🏛️ {item.dept}
                              </span>
                              <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: '#1b4332', margin: '2px 0 0 0' }}>
                                {item.title}
                              </h4>
                            </div>

                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              backgroundColor: style.badgeBg,
                              color: style.badgeColor,
                              fontSize: '11.5px',
                              fontWeight: '800',
                              whiteSpace: 'nowrap'
                            }}>
                              {style.text}
                            </span>
                          </div>

                          <div style={{ fontSize: '13px', color: '#495057', marginTop: '6px', lineHeight: '1.4' }}>
                            {item.remark}
                          </div>

                          <div style={{ fontSize: '11.5px', color: '#8d99ae', marginTop: '8px' }}>
                            🕒 อัปเดตล่าสุด: <span style={{ fontWeight: '600' }}>{item.time}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div>
                <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                    🚢 STEP 04: สถานะการขนส่งสินค้าทางทะเลและโลจิสติกส์ (Shipping Timeline)
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#6c757d', margin: '4px 0 0 0' }}>
                    ติดตามสถานะตู้คอนเทนเนอร์และการเดินทางของเรือขนส่งสินค้าแบบ real-time
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', backgroundColor: '#f8f9fa', padding: '10px 16px', borderRadius: '8px', border: '1px solid #e9ecef', fontSize: '12.5px', fontWeight: '600' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2d6a4f' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2d6a4f' }}></span> 🟢 สีเขียว: ดำเนินการสำเร็จ
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#856404' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e9c46a' }}></span> 🟡 สีเหลือง: กำลังขนส่ง
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e63946' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e63946' }}></span> 🔴 สีแดง: เกิดปัญหา / ล่าช้า
                  </span>
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px', marginTop: '10px' }}>
                  <div style={{ position: 'absolute', top: '12px', bottom: '24px', left: '13px', width: '3px', backgroundColor: '#e9ecef', zIndex: 1 }}></div>

                  {shippingTimeline.map((item, index) => {
                    const style = getTimelineStatusStyle(item.status);
                    const isLast = index === shippingTimeline.length - 1;

                    return (
                      <div key={item.id} style={{ position: 'relative', marginBottom: isLast ? 0 : '28px', zIndex: 2 }}>
                        
                        <div style={{
                          position: 'absolute',
                          left: '-28px',
                          top: '2px',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: style.bgColor,
                          color: style.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '800',
                          border: '3px solid #ffffff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}>
                          {style.icon}
                        </div>

                        <div style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '10px',
                          padding: '16px 20px',
                          border: style.border,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#6c757d', letterSpacing: '0.5px' }}>
                                📍 {item.location}
                              </span>
                              <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: '#1b4332', margin: '2px 0 0 0' }}>
                                {item.title}
                              </h4>
                            </div>

                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              backgroundColor: style.badgeBg,
                              color: style.badgeColor,
                              fontSize: '11.5px',
                              fontWeight: '800',
                              whiteSpace: 'nowrap'
                            }}>
                              {style.text}
                            </span>
                          </div>

                          <div style={{ fontSize: '13px', color: '#495057', marginTop: '6px', lineHeight: '1.4' }}>
                            {item.remark}
                          </div>

                          <div style={{ fontSize: '11.5px', color: '#8d99ae', marginTop: '8px' }}>
                            🕒 เวลาดำเนินการ: <span style={{ fontWeight: '600' }}>{item.time}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep > 4 && (
              <div>
                <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  {stepsList[currentStep - 1].title}
                </h3>
                <p style={{ fontSize: '14px', color: '#495057' }}>{stepsList[currentStep - 1].sub}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{ padding: '9px 20px', borderRadius: '6px', border: '1px solid #1b4332', backgroundColor: '#ffffff', color: '#1b4332', fontWeight: '700', cursor: currentStep === 1 ? 'not-allowed' : 'pointer', opacity: currentStep === 1 ? 0.4 : 1, fontSize: '13px' }}
              >
                ⬅️ ย้อนกลับ
              </button>
              <button
                disabled={currentStep === 5}
                onClick={() => {
                  const nextStep = currentStep + 1;
                  setCurrentStep(nextStep);
                  handleSaveDeal(dealData, documents, auditTimeline, shippingTimeline, nextStep);
                }}
                style={{ padding: '9px 24px', borderRadius: '6px', border: 'none', backgroundColor: '#1b4332', color: '#ffffff', fontWeight: '700', cursor: currentStep === 5 ? 'not-allowed' : 'pointer', opacity: currentStep === 5 ? 0.4 : 1, fontSize: '13px' }}
              >
                ขั้นตอนถัดไป ➔
              </button>
            </div>

          </div>

          {/* Right Side: Stakeholders */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '15px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0' }}>
              ผู้เกี่ยวข้องในดีลส่งออก
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ backgroundColor: '#f4f9f5', border: '1px solid #d8f3dc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#1b4332', marginBottom: '2px' }}>เกษตรกร / ผู้ส่งออก</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1b4332' }}>{dealData.companyName || '- รอเลือกข้อมูล -'}</div>
                <div style={{ fontSize: '11px', color: dealData.companyName ? '#2d6a4f' : '#adb5bd', marginTop: '2px' }}>
                  {dealData.companyName ? '🟢 พร้อมจัดส่ง' : '⚪ รอข้อมูล'}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#6c757d', marginBottom: '2px' }}>ผู้ซื้อต่างประเทศ</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#212529' }}>{dealData.buyer || '- รอเลือกข้อมูล -'}</div>
                <div style={{ fontSize: '11px', color: dealData.buyer ? '#2d6a4f' : '#adb5bd', marginTop: '2px' }}>
                  {dealData.buyer ? '🟢 รอรับมอบสินค้า' : '⚪ รอข้อมูล'}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}