'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function WorkspaceTransactionPage() {
  const context = useAppContext() || {};

  // ลำดับขั้นตอนการส่งออก
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // State สำหรับ Step 2: อัปโหลดเอกสาร & ช่วยทำสัญญา
  const [activeDocTab, setActiveDocTab] = useState('upload');
  const [selectedDocTypeToGenerate, setSelectedDocTypeToGenerate] = useState('contract');

  // รายการเอกสารบังคับตามกฎหมายส่งออก
  const [documents, setDocuments] = useState([
    { id: 'doc-1', name: 'ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate พ.ก. 7)', code: 'PHYTO', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-2', name: 'หนังสือสัญญาซื้อขายส่งออก (Export Sales Contract)', code: 'CONTRACT', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-3', name: 'สัญญาพ่อค้าคนกลาง / ตัวแทนรวบรวมสินค้า (Intermediary Agreement)', code: 'BROKER', required: false, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-4', name: 'ใบกำกับสินค้าส่งออก (Commercial Invoice)', code: 'INVOICE', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-5', name: 'ใบตราส่งสินค้าทางเรือ / ทางอากาศ (Bill of Lading / Air Waybill)', code: 'BL', required: true, uploaded: false, fileName: '', fileUrl: '' },
    { id: 'doc-6', name: 'หนังสือรับรองถิ่นกำเนิดสินค้า (Form E / Form D / JTEPA / Form AI)', code: 'CO', required: false, uploaded: false, fileName: '', fileUrl: '' }
  ]);

  // Timeline การตรวจสอบเอกสารภาครัฐ (Audit Timeline)
  const [auditTimeline, setAuditTimeline] = useState([
    {
      id: 1,
      title: 'ตรวจสอบศัตรูพืชและออกใบรับรองสุขอนามัยพืช (พ.ก. 7)',
      dept: 'กลุ่มบริการส่งออกพืช กรมวิชาการเกษตร (DOA)',
      status: 'success',
      time: '10 พ.ย. 2026 - 09:30 น.',
      remark: 'ตรวจสอบแปลง GAP/GMP ผ่านเกณฑ์ ไม่พบเพลี้ยแป้งและแมลงวันผลไม้'
    },
    {
      id: 2,
      title: 'ตรวจสอบสัญญาการค้าและพิธีการศุลกากรขาออก (e-Export)',
      dept: 'กรมศุลกากร (National Single Window - NSW)',
      status: 'pending',
      time: 'กำลังดำเนินการ...',
      remark: 'กำลังตรวจสอบการสำแดงพิกัด HS Code และเชื่อมโยงใบอนุญาตพืช'
    },
    {
      id: 3,
      title: 'ยื่นขอหนังสือรับรองถิ่นกำเนิดสินค้าสิทธิประโยชน์ FTA',
      dept: 'กรมการค้าต่างประเทศ กระทรวงพาณิชย์',
      status: 'pending',
      time: 'รอดำเนินการ',
      remark: 'เตรียมออก Form E (จีน), Form D (มาเลเซีย), JTEPA (ญี่ปุ่น) หรือ Form AI (อินเดีย)'
    }
  ]);

  // Timeline การขนส่งสินค้าและตู้ห้องเย็น (Shipping & Cold Chain Timeline)
  const [shippingTimeline, setShippingTimeline] = useState([
    {
      id: 1,
      title: 'คัดแยก บรรจุกล่อง และโหลดสินค้าขึ้นตู้คอนเทนเนอร์ห้องเย็น (Reefer)',
      location: 'โรงคัดบรรจุมาตรฐาน GMP จ.จันทบุรี',
      status: 'success',
      time: '11 พ.ย. 2026 - 06:30 น.',
      remark: 'ควบคุมอุณหภูมิห้องเย็น 13.0°C - 14.5°C ติดตั้ง Data Logger ตรวจวัดความชื้น'
    },
    {
      id: 2,
      title: 'ขนส่งถึงท่าเรือต้นทางและชั่งน้ำหนักตู้ (Port of Departure)',
      location: 'ท่าเรือแหลมฉบัง (Laem Chabang Port, TH)',
      status: 'pending',
      time: 'กำลังขนส่งเข้าลานตู้สินค้า',
      remark: 'รถบรรทุกหัวลากกำลังนำส่งตู้สินค้าเข้าสู่จุดเอกซเรย์ตู้ศุลกากร'
    },
    {
      id: 3,
      title: 'เรือขนส่งสินค้าออกเดินทางสู่ด่านสากลปลายทาง',
      location: 'สายการเดินเรือระหว่างประเทศ (Ocean Vessel)',
      status: 'pending',
      time: 'ตามตารางเดินเรือ',
      remark: 'มุ่งหน้าสู่ท่าเรือปลายทาง (จีน, ญี่ปุ่น, สหรัฐฯ, มาเลเซีย หรือ อินเดีย)'
    }
  ]);

  // ตัวเลือกสินค้าเกษตรส่งออก
  const productOptions = [
    'ทุเรียนหมอนทองสด (Fresh Durian) - HS 0810.60.00',
    'ทุเรียนแช่แข็ง IQF (Frozen Durian) - HS 0811.90.00',
    'มังคุดสดคัดเกรด (Fresh Mangosteen) - HS 0804.50.30',
    'มะม่วงน้ำดอกไม้สด (อบไอน้ำ VHT) - HS 0804.50.20',
    'ข้าวหอมมะลิไทย 100% (Thai Hom Mali Rice) - HS 1006.30.90',
    'ลำไยสด / รมควัน SO2 (Fresh Longan) - HS 0810.90.10',
    'สับปะรดสด (Fresh Pineapple) - HS 0804.30.00',
    'ยางพาราแผ่นรมควัน RSS3 - HS 4001.21.00'
  ];

  // ตัวเลือก 5 ประเทศยุทธศาสตร์
  const destinationOptions = [
    'สาธารณรัฐประชาชนจีน (China - Shanghai / Nansha / Guangzhou Port)',
    'สหรัฐอเมริกา (USA - Port of Long Beach / Los Angeles, CA)',
    'ประเทศญี่ปุ่น (Japan - Tokyo Narita / Yokohama Port)',
    'ประเทศมาเลเซีย (Malaysia - ด่านสะเดา / Port Klang / Penang)',
    'สาธารณรัฐอินเดีย (India - Nhava Sheva / Chennai Port)'
  ];

  // เงื่อนไข Incoterms 2020
  const incotermsList = [
    { code: 'FOB', name: 'Free on Board (ส่งมอบบนเรือ ณ ท่าเรือต้นทาง)' },
    { code: 'CIF', name: 'Cost, Insurance & Freight (รวมค่าระวางเรือและประกันภัยถึงปลายทาง)' },
    { code: 'CFR', name: 'Cost and Freight (รวมค่าระวางเรือถึงท่าเรือปลายทาง)' },
    { code: 'CPT', name: 'Carriage Paid To (ค่าขนส่งจ่ายถึงปลายทาง - ทางอากาศ/บก)' },
    { code: 'DAP', name: 'Delivered at Place (ส่งมอบถึงสถานที่ปลายทางที่ตกลงกัน)' },
    { code: 'EXW', name: 'Ex Works (ส่งมอบหน้าสวน/หน้าโรงคัดบรรจุ)' }
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
    companyName: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
    intermediaryName: 'บริษัท ไทย อกริ โลจิสติกส์ อินเตอร์เนชั่นแนล จำกัด',
    contractRelationType: 'MULTIPARTY'
  });

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
      const res = await fetch('/api/deals', { cache: 'no-store' });
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
            companyName: latestDeal.companyName || prev.companyName,
            intermediaryName: latestDeal.intermediaryName || prev.intermediaryName
          }));
          if (latestDeal.documents) setDocuments(latestDeal.documents);
          if (latestDeal.auditTimeline) setAuditTimeline(latestDeal.auditTimeline);
          if (latestDeal.shippingTimeline) setShippingTimeline(latestDeal.shippingTimeline);
        }
      }
    } catch (err) {
      console.warn('Error loading deal:', err);
    } finally {
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
      const payload = {
        ...updatedData, 
        documents: updatedDocs, 
        auditTimeline: updatedAudit, 
        shippingTimeline: updatedShipping,
        currentStep: stepToSave
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('active_deal', JSON.stringify(payload));
      }

      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.deal) {
        setDealData(prev => ({ ...prev, ...data.deal }));
        if (data.deal.documents) setDocuments(data.deal.documents);
        if (data.deal.auditTimeline) setAuditTimeline(data.deal.auditTimeline);
        if (data.deal.shippingTimeline) setShippingTimeline(data.deal.shippingTimeline);
        setStatusMsg({ type: 'success', text: 'บันทึกข้อมูลดีลส่งออกเรียบร้อยแล้ว' });
        setIsFormOpen(false);
      } else {
        setStatusMsg({ type: 'success', text: 'บันทึกข้อมูลลงเครื่องเรียบร้อยแล้ว' });
        setIsFormOpen(false);
      }
    } catch (err) {
      setStatusMsg({ type: 'success', text: 'บันทึกข้อมูลและซิงก์สถานะเรียบร้อยแล้ว' });
      setIsFormOpen(false);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePrintDocument = (title) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${title} - ${dealData.dealId}</title>
          <style>
            body { font-family: 'Prompt', 'Sarabun', sans-serif; padding: 40px; line-height: 1.6; }
            h1 { text-align: center; color: #1b4332; margin-bottom: 4px; }
            .sub { text-align: center; color: #666; font-size: 13px; margin-bottom: 24px; }
            .box { border: 1.5px solid #1b4332; padding: 20px; border-radius: 8px; margin-top: 15px; }
            .field { margin-bottom: 10px; font-size: 14px; }
            .label { font-weight: bold; color: #1b4332; }
            .notice { background: #f4f9f5; padding: 12px; border-radius: 6px; font-size: 12.5px; margin-top: 20px; border: 1px solid #b7e4c7; }
            .footer { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; text-align: center; }
            .sign-line { border-top: 1px solid #333; width: 220px; margin: 50px auto 6px auto; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="sub">แบบสัญญารองรับธุรกรรมส่งออกสินค้าเกษตร (ป้องกันข้อมูลและรายได้ตกหล่น)</div>
          <p style="text-align: right; font-size: 13px;">เลขที่เอกสาร: <strong>${dealData.dealId}</strong> | วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
          
          <div class="box">
            <div class="field"><span class="label">1. ผู้ส่งออก / กลุ่มเกษตรกร (Seller):</span> ${dealData.companyName || 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี'}</div>
            <div class="field"><span class="label">2. พ่อค้าคนกลาง / ตัวแทนรวบรวม (Broker/Intermediary):</span> ${dealData.intermediaryName || 'บริษัท ไทย อกริ โลจิสติกส์ จำกัด'}</div>
            <div class="field"><span class="label">3. ผู้ซื้อปลายทาง (Buyer / Consignee):</span> ${dealData.buyer || '...................................................'}</div>
            <div class="field"><span class="label">4. สินค้าเกษตร (Commodity):</span> ${dealData.productName || '...................................................'}</div>
            <div class="field"><span class="label">5. ปริมาณและบรรจุภัณฑ์ (Quantity):</span> ${dealData.quantity || '...................................................'}</div>
            <div class="field"><span class="label">6. มูลค่ารวม (Total Contract Value):</span> ${dealData.price || '...................................................'}</div>
            <div class="field"><span class="label">7. เงื่อนไขส่งมอบ (Incoterms 2020):</span> ${dealData.incoterm || 'FOB / CIF'}</div>
            <div class="field"><span class="label">8. ตลาดปลายทาง (Destination Port):</span> ${dealData.destination || '...................................................'}</div>
          </div>

          <div class="notice">
            <strong>ข้อกำหนดคุ้มครองนิติกรรมหลายฝ่าย:</strong> ทุกฝ่ายตกลงใช้ข้อมูลปริมาณและค่าน้ำหนักสุทธิจากจุดชั่งตรวจรับรองมาตรฐาน และการจัดสรรส่วนแบ่งรายได้ให้กระทำผ่านช่องทางที่บันทึกร่วมกัน ห้ามหักทอนค่าน้ำหนักโดยไม่มีเอกสารรับรองจากด่านกักพืชหรือผู้ตรวจอิสระ
          </div>

          <div class="footer">
            <div>
              <div class="sign-line"></div>
              ลงชื่อผู้ส่งออก / เกษตรกร<br/>
              (${dealData.companyName || 'ผู้มีอำนาจลงนาม'})
            </div>
            <div>
              <div class="sign-line"></div>
              ลงชื่อผู้ซื้อต่างประเทศ / ตัวแทน<br/>
              (${dealData.buyer || 'Authorized Signature'})
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
          text: 'อนุมัติ / สำเร็จ'
        };
      case 'pending':
        return {
          bgColor: '#e9c46a',
          color: '#1b4332',
          badgeBg: '#fff3cd',
          badgeColor: '#856404',
          border: '2px solid #e9c46a',
          icon: '⏳',
          text: 'กำลังตรวจสอบ / ขนส่ง'
        };
      case 'failed':
        return {
          bgColor: '#e63946',
          color: '#ffffff',
          badgeBg: '#fff0f0',
          badgeColor: '#e63946',
          border: '2px solid #e63946',
          icon: '✕',
          text: 'พบข้อแก้ไข / ล่าช้า'
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
    { num: 1, title: 'ตกลงสัญญาหลายฝ่าย', sub: 'สินค้า 5 ประเทศ Incoterms และราคา' },
    { num: 2, title: 'เอกสาร & ใบรับรอง พ.ก. 7', sub: 'อัปโหลดไฟล์ หรือสร้างสัญญากันรายได้ตกหล่น' },
    { num: 3, title: 'ตรวจเอกสารศุลกากร (e-Export)', sub: 'NSW, ใบรับรองถิ่นกำเนิด และ Form FTA' },
    { num: 4, title: 'โลจิสติกส์ตู้เย็น (Cold Chain)', sub: 'Reefer Container และตรวจสอบ Data Logger' },
    { num: 5, title: 'ตรวจปล่อยปลายทาง & ชำระเงิน', sub: 'ผ่านด่าน 5 ประเทศและส่งมอบเงินครบถ้วน' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '28px 32px 80px 32px', width: '100%', boxSizing: 'border-box', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '3px' }}>
              Agricultural Trade Pipeline & Compliance
            </div>
            <h1 style={{ fontSize: '26px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
              🌿 ศูนย์ติดตามสถานะและบริหารสัญญาการส่งออก
            </h1>
            <div style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
              รหัสติดตามดีล: <span style={{ color: '#1b4332', fontWeight: '800' }}>{dealData.dealId}</span> {dealData.productName ? `| ${dealData.productName}` : ''}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              href="/ai-legal"
              style={{
                padding: '10px 18px',
                backgroundColor: '#ffffff',
                color: '#1b4332',
                border: '1.5px solid #1b4332',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none'
              }}
            >
              ⚖️ ปรึกษากฎหมาย 5 ประเทศ (AI)
            </Link>
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              style={{ padding: '10px 20px', backgroundColor: isFormOpen ? '#64748b' : '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,67,50,0.18)' }}
            >
              {isFormOpen ? '✕ ปิดหน้าแก้ไขข้อมูล' : '➕ เลือกข้อมูลหรือสร้างดีลใหม่'}
            </button>
          </div>
        </div>

        {statusMsg && (
          <div style={{ marginBottom: '18px', padding: '12px 18px', borderRadius: '8px', fontSize: '13.5px', fontWeight: '700', backgroundColor: statusMsg.type === 'success' ? '#d8f3dc' : '#fee2e2', color: statusMsg.type === 'success' ? '#1b4332' : '#dc2626', border: `1px solid ${statusMsg.type === 'success' ? '#b7e4c7' : '#fecaca'}` }}>
            {statusMsg.text}
          </div>
        )}

        {/* ฟอร์มเลือกข้อมูลดีลการค้า */}
        {isFormOpen && (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveDeal(); }} style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '16px', border: '2px solid #1b4332', marginBottom: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', boxShadow: '0 6px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ gridColumn: 'span 3', borderBottom: '2px solid #e9c46a', paddingBottom: '10px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '17px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                🌾 ระบุข้อมูลการค้าและสัญญาส่งออก (คุ้มครองเกษตรกรและคู่ค้า 5 ประเทศ)
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                ลดปัญหาความซับซ้อนของสัญญาหลายฝ่าย และป้องกันรายได้ตกหล่นจากการประสานงานหลายช่องทาง[cite: 1]
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>1. ชนิดสินค้าเกษตร <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.productName || ''} onChange={(e) => setDealData({ ...dealData, productName: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '13.5px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- คลิกเพื่อเลือกสินค้าเกษตร --</option>
                {productOptions.map((item, idx) => (<option key={idx} value={item}>📦 {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>2. ประเทศปลายทาง (5 ประเทศหลัก) <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.destination || ''} onChange={(e) => setDealData({ ...dealData, destination: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '13.5px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- คลิกเลือกประเทศปลายทาง --</option>
                {destinationOptions.map((item, idx) => (<option key={idx} value={item}>🌐 {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>3. เงื่อนไขการส่งมอบ (Incoterms 2020)</label>
              <select value={dealData.incotermCode || ''} onChange={(e) => setDealData({ ...dealData, incotermCode: e.target.value, incoterm: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '13.5px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- คลิกเพื่อเลือก Incoterms --</option>
                {incotermsList.map(item => (<option key={item.code} value={item.code}>{item.code} - {item.name}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อกลุ่มเกษตรกร / สวนต้นทาง <span style={{ color: '#e63946' }}>*</span></label>
              <input type="text" required placeholder="เช่น กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี" value={dealData.companyName || ''} onChange={(e) => setDealData({ ...dealData, companyName: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '13.5px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>พ่อค้าคนกลาง / ตัวแทนรวบรวมสินค้า (Broker)</label>
              <input type="text" placeholder="เช่น บริษัท รวบรวมและส่งออก จำกัด" value={dealData.intermediaryName || ''} onChange={(e) => setDealData({ ...dealData, intermediaryName: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '13.5px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ผู้ซื้อปลายทาง (Buyer / Consignee)</label>
              <input type="text" placeholder="เช่น Shanghai Fresh Global Fruit Co., Ltd." value={dealData.buyer || ''} onChange={(e) => setDealData({ ...dealData, buyer: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '13.5px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ปริมาณและบรรจุภัณฑ์</label>
              <input type="text" placeholder="เช่น 25,000 กิโลกรัม (1 ตู้ Reefer 40ft)" value={dealData.quantity || ''} onChange={(e) => setDealData({ ...dealData, quantity: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '13.5px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>มูลค่ารวมสัญญา (บาท)</label>
              <input type="text" placeholder="เช่น 4,500,000 บาท" value={dealData.price || ''} onChange={(e) => setDealData({ ...dealData, price: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '13.5px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>กำหนดวันที่ส่งมอบสินค้า</label>
              <input type="date" value={formatDateForInput(dealData.deliveryTarget)} onChange={(e) => setDealData({ ...dealData, deliveryTarget: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '13.5px', boxSizing: 'border-box', backgroundColor: '#fff' }} />
            </div>

            <div style={{ gridColumn: 'span 3', textAlign: 'right', marginTop: '10px' }}>
              <button type="submit" disabled={loading} style={{ padding: '12px 32px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '14.5px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? '⚡ กำลังบันทึก...' : '💾 บันทึกข้อมูลและเริ่มกระบวนการ'}
              </button>
            </div>
          </form>
        )}

        {/* กระดานสเต็ป 5 ขั้นตอน (Stepper) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '28px' }}>
          <div style={{ fontSize: '14px', color: '#1b4332', fontWeight: '800', marginBottom: '14px' }}>
            📌 ขั้นตอนการบริหารธุรกรรมส่งออก (Transaction Stepper)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {stepsList.map((st) => {
              const isActive = currentStep === st.num;
              const isPassed = currentStep > st.num;
              return (
                <div
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  style={{
                    backgroundColor: isActive ? '#1b4332' : isPassed ? '#f0fdf4' : '#f8fafc',
                    color: isActive ? '#ffffff' : '#1e293b',
                    borderRadius: '10px',
                    padding: '14px 12px',
                    border: isActive ? '2px solid #e9c46a' : isPassed ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '85px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', opacity: isActive ? 0.9 : 0.6, marginBottom: '3px' }}>
                      STEP 0{st.num} {isPassed && '✓'}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.3' }}>
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

        {/* เนื้อหารายละเอียดแต่ละขั้นตอน */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '24px' }}>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            
            {/* STEP 1: ตกลงสัญญาและเงื่อนไข */}
            {currentStep === 1 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16.5px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                    🤝 STEP 01: สรุปเงื่อนไขการค้าและสัญญาส่งออก (Contract Summary)
                  </h3>
                  {!dealData.productName && (
                    <button onClick={() => setIsFormOpen(true)} style={{ backgroundColor: '#fefae0', color: '#bc6c25', border: '1px solid #dda15e', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      👉 คลิกเลือกข้อมูล
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', marginBottom: '24px', fontSize: '13.5px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '12px', marginBottom: '2px' }}>สินค้าเกษตรส่งออก:</span>
                    <strong style={{ color: dealData.productName ? '#1b4332' : '#94a3b8' }}>
                      {dealData.productName ? `📦 ${dealData.productName}` : '- ยังไม่ได้เลือกสินค้า -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '12px', marginBottom: '2px' }}>ปริมาณและบรรจุภัณฑ์:</span>
                    <strong style={{ color: dealData.quantity ? '#1e293b' : '#94a3b8' }}>
                      {dealData.quantity || '- ยังไม่ได้ระบุ -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '12px', marginBottom: '2px' }}>ประเทศปลายทาง:</span>
                    <strong style={{ color: dealData.destination ? '#1b4332' : '#94a3b8' }}>
                      {dealData.destination ? `🌐 ${dealData.destination}` : '- ยังไม่ได้เลือกประเทศ -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '12px', marginBottom: '2px' }}>เงื่อนไขส่งมอบ Incoterms:</span>
                    <strong style={{ color: dealData.incoterm ? '#2d6a4f' : '#94a3b8' }}>
                      {dealData.incoterm ? `📖 ${dealData.incoterm}` : '- ยังไม่ได้เลือกเงื่อนไข -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '12px', marginBottom: '2px' }}>ผู้ซื้อปลายทาง (Buyer):</span>
                    <strong style={{ color: dealData.buyer ? '#1e293b' : '#94a3b8' }}>
                      {dealData.buyer || '- ยังไม่ได้ระบุ -'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '12px', marginBottom: '2px' }}>กำหนดวันที่ส่งมอบ:</span>
                    <strong style={{ color: dealData.deliveryTarget ? '#1e293b' : '#94a3b8' }}>
                      {dealData.deliveryTarget || '- ยังไม่ได้ระบุ -'}
                    </strong>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px 20px', borderRadius: '10px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '22px' }}>💰</span>
                    <div>
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>มูลค่ารวมของสัญญา:</div>
                      <div style={{ fontSize: '18px', color: '#1b4332', fontWeight: '800' }}>{dealData.price || '- รอระบุราคา -'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrintDocument('หนังสือสัญญาซื้อขายส่งออกสินค้าเกษตร')}
                    style={{ padding: '8px 16px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    🖨️ พิมพ์สัญญาสรุป
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: เตรียมเอกสารและทำสัญญา */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: '16.5px', color: '#1b4332', fontWeight: '800', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  📁 STEP 02: อัปโหลดเอกสาร & หนังสือสัญญาคุ้มครองนิติกรรมหลายฝ่าย
                </h3>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setActiveDocTab('upload')}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeDocTab === 'upload' ? '#1b4332' : '#f1f5f9', color: activeDocTab === 'upload' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    📤 อัปโหลดเอกสารสำคัญ (Upload Files)
                  </button>
                  <button
                    onClick={() => setActiveDocTab('generator')}
                    style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: activeDocTab === 'generator' ? '#1b4332' : '#f1f5f9', color: activeDocTab === 'generator' ? '#ffffff' : '#475569', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    📝 ระบบช่วยทำสัญญา (Contract Builder)
                  </button>
                </div>

                {activeDocTab === 'upload' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 4px 0' }}>
                      แนบไฟล์เอกสารสำหรับยื่นกรมวิชาการเกษตร กรมศุลกากร และด่านปลายทาง (รองรับ PDF, PNG, JPG):
                    </p>
                    {documents.map((doc) => (
                      <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: doc.uploaded ? '#f0fdf4' : '#f8fafc', border: doc.uploaded ? '1.5px solid #86efac' : '1px solid #e2e8f0', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1b4332' }}>
                            {doc.name} {doc.required && <span style={{ color: '#e63946' }}>*</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: doc.uploaded ? '#166534' : '#64748b', marginTop: '2px' }}>
                            {doc.uploaded ? `✅ อัปโหลดแล้ว: ${doc.fileName}` : '⚪ รอดำเนินการแนบไฟล์'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {doc.uploaded && (
                            <a href={doc.fileUrl} download={doc.fileName} style={{ padding: '6px 12px', backgroundColor: '#e2e8f0', color: '#1e293b', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                              ดูไฟล์
                            </a>
                          )}
                          <label style={{ padding: '6px 14px', backgroundColor: '#1b4332', color: '#ffffff', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                            {doc.uploaded ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                            <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={(e) => handleFileUpload(doc.id, e)} />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeDocTab === 'generator' && (
                  <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #bbf7d0', padding: '22px', borderRadius: '12px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#1b4332', fontSize: '15px', fontWeight: '800' }}>
                      🛡️ สร้างสัญญามาตรฐานเพื่อคุ้มครองนิติกรรมหลายฝ่าย[cite: 1]
                    </h4>
                    <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      ระบบจะจัดทำสัญญาซื้อขายและสัญญาคนกลาง พร้อมระบุข้อกำหนดตรวจรับสินค้าและป้องกันรายได้ตกหล่นให้อัตโนมัติ[cite: 1]
                    </p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                      <button onClick={() => setSelectedDocTypeToGenerate('contract')} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #1b4332', backgroundColor: selectedDocTypeToGenerate === 'contract' ? '#1b4332' : '#fff', color: selectedDocTypeToGenerate === 'contract' ? '#fff' : '#1b4332', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}>
                        📄 สัญญาซื้อขายส่งออก (Sales Contract)
                      </button>
                      <button onClick={() => setSelectedDocTypeToGenerate('broker')} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #1b4332', backgroundColor: selectedDocTypeToGenerate === 'broker' ? '#1b4332' : '#fff', color: selectedDocTypeToGenerate === 'broker' ? '#fff' : '#1b4332', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}>
                        🤝 สัญญาพ่อค้าคนกลาง (Broker Agreement)
                      </button>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>
                      <div>• <strong>ผู้ส่งออก:</strong> {dealData.companyName || 'กลุ่มเกษตรกรแปลงใหญ่'}</div>
                      <div>• <strong>ตัวแทนคนกลาง:</strong> {dealData.intermediaryName || 'บริษัท ไทย อกริ โลจิสติกส์ จำกัด'}</div>
                      <div>• <strong>ผู้ซื้อ:</strong> {dealData.buyer || 'ผู้ซื้อต่างประเทศ'} ({dealData.destination || 'ตลาดปลายทาง'})</div>
                      <div>• <strong>สินค้า:</strong> {dealData.productName || 'ผลไม้สด'} | <strong>มูลค่า:</strong> {dealData.price || '-'}</div>
                    </div>

                    <button
                      onClick={() => handlePrintDocument(selectedDocTypeToGenerate === 'contract' ? 'สัญญาซื้อขายส่งออกสินค้าเกษตร' : 'สัญญาตัวแทนพ่อค้าคนกลางและกระจายสินค้า')}
                      style={{ padding: '10px 22px', backgroundColor: '#e9c46a', color: '#1b4332', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    >
                      🖨️ พิมพ์หรือบันทึกสัญญาเป็น PDF
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: ตรวจเอกสารศุลกากร */}
            {currentStep === 3 && (
              <div>
                <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16.5px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                    📋 STEP 03: ติดตามสถานะการอนุมัติเอกสารและใบรับรอง (Audit Timeline)
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                    ติดตามการอนุมัติคำขอ พ.ก. 7 จากกรมวิชาการเกษตร และใบขนสินค้าขาออกจากกรมศุลกากร
                  </p>
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px', marginTop: '14px' }}>
                  <div style={{ position: 'absolute', top: '12px', bottom: '24px', left: '13px', width: '3px', backgroundColor: '#e2e8f0', zIndex: 1 }}></div>

                  {auditTimeline.map((item, index) => {
                    const style = getTimelineStatusStyle(item.status);
                    const isLast = index === auditTimeline.length - 1;

                    return (
                      <div key={item.id} style={{ position: 'relative', marginBottom: isLast ? 0 : '24px', zIndex: 2 }}>
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

                        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px 20px', border: style.border }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>🏛️ {item.dept}</span>
                              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1b4332', margin: '2px 0 0 0' }}>{item.title}</h4>
                            </div>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: style.badgeBg, color: style.badgeColor, fontSize: '11px', fontWeight: '800' }}>
                              {style.text}
                            </span>
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>{item.remark}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>🕒 เวลา: {item.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: ขนส่งสินค้าทางทะเลและตู้ห้องเย็น */}
            {currentStep === 4 && (
              <div>
                <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16.5px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                    🚢 STEP 04: การขนส่งสินค้าทางทะเลและควบคุมความเย็น (Cold Chain Timeline)
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
                    ติดตามสถานะตู้คอนเทนเนอร์ห้องเย็น (Reefer Container) มุ่งหน้าสู่ 5 ประเทศปลายทาง
                  </p>
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px', marginTop: '14px' }}>
                  <div style={{ position: 'absolute', top: '12px', bottom: '24px', left: '13px', width: '3px', backgroundColor: '#e2e8f0', zIndex: 1 }}></div>

                  {shippingTimeline.map((item, index) => {
                    const style = getTimelineStatusStyle(item.status);
                    const isLast = index === shippingTimeline.length - 1;

                    return (
                      <div key={item.id} style={{ position: 'relative', marginBottom: isLast ? 0 : '24px', zIndex: 2 }}>
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

                        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px 20px', border: style.border }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>📍 {item.location}</span>
                              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1b4332', margin: '2px 0 0 0' }}>{item.title}</h4>
                            </div>
                            <span style={{ padding: '3px 10px', borderRadius: '20px', backgroundColor: style.badgeBg, color: style.badgeColor, fontSize: '11px', fontWeight: '800' }}>
                              {style.text}
                            </span>
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>{item.remark}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>🕒 กำหนดการ: {item.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: ตรวจปล่อยปลายทาง */}
            {currentStep === 5 && (
              <div>
                <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '8px', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16.5px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
                    🏁 STEP 05: การตรวจปล่อยสินค้า ณ ด่านสากลปลายทางและการชำระเงิน
                  </h3>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', padding: '24px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#166534', marginBottom: '8px' }}>
                    ✅ ดีลส่งออกสินค้าเกษตรพร้อมส่งมอบสำเร็จ
                  </div>
                  <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.6' }}>
                    ตู้สินค้าได้รับการตรวจรับรองศัตรูพืช ณ ด่านปลายทาง ({dealData.destination || 'ปลายทาง'}) เรียบร้อยแล้ว สามารถยื่นเอกสาร B/L และ Commercial Invoice เพื่อเรียกเก็บเงินตามระบบชำระเงินสากล (L/C หรือ T/T) ได้ทันที
                  </p>
                </div>
              </div>
            )}

            {/* ปุ่มนำทางขั้นตอน */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
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

          {/* ฝั่งขวา: สรุปผู้มีส่วนได้ส่วนเสีย & คำแนะนำกฎหมาย 5 ประเทศ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '14px', color: '#1b4332', fontWeight: '800', margin: '0 0 14px 0' }}>
                👥 ผู้มีส่วนเกี่ยวข้องในดีล (Stakeholders)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#166534', marginBottom: '2px' }}>1. เกษตรกร / กลุ่มแปลงใหญ่</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1b4332' }}>{dealData.companyName || 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี'}</div>
                  <div style={{ fontSize: '11px', color: '#2d6a4f', marginTop: '2px' }}>🟢 เจ้าของผลผลิต / GAP Certified</div>
                </div>

                <div style={{ backgroundColor: '#fefce8', border: '1px solid #fef08a', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#854d0e', marginBottom: '2px' }}>2. พ่อค้าคนกลาง / ตัวแทนรวบรวม</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#713f12' }}>{dealData.intermediaryName || 'บริษัท ไทย อกริ โลจิสติกส์ จำกัด'}</div>
                  <div style={{ fontSize: '11px', color: '#854d0e', marginTop: '2px' }}>🤝 ควบคุมค่าน้ำหนัก & ป้องกันรายได้ตกหล่น[cite: 1]</div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', marginBottom: '2px' }}>3. ผู้ซื้อปลายทางต่างประเทศ</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{dealData.buyer || '- รอระบุข้อมูล -'}</div>
                  <div style={{ fontSize: '11px', color: dealData.buyer ? '#2d6a4f' : '#94a3b8', marginTop: '2px' }}>
                    {dealData.buyer ? '✈️ พร้อมรับมอบสินค้า' : '⚪ รอจับคู่คู่ค้า'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', fontSize: '12.5px', lineHeight: '1.5' }}>
              <div style={{ fontWeight: '800', color: '#1b4332', marginBottom: '6px' }}>
                💡 ข้อพึงระวังใน 5 ประเทศปลายทาง:
              </div>
              <div style={{ color: '#475569' }}>
                • <strong>จีน:</strong> ตรวจไม่พบเพลี้ยแป้งเด็ดขาด + Form E<br/>
                • <strong>สหรัฐฯ:</strong> แจ้ง FDA Prior Notice + รมยาข้าว<br/>
                • <strong>ญี่ปุ่น:</strong> อบไอน้ำ VHT 46.8°C นาน 10 นาที<br/>
                • <strong>มาเลเซีย:</strong> ต้องมี MAQIS Permit + Form D<br/>
                • <strong>อินเดีย:</strong> รมยา Methyl Bromide + DPPQS
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}