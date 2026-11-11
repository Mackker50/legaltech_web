'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function TransactionStatusPage() {
  const context = useAppContext() || {};
  const { lang } = context;

  // สถานะ Step (1 ถึง 5)
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState('EXPORTER');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ข้อมูลดีล/ธุรกรรม (Step 1)
  const [dealData, setDealData] = useState({
    dealId: 'EXP-2026-001',
    productName: 'ทุเรียนหมอนทองสด',
    destination: 'จีน (ท่าเรือ Shanghai)',
    buyer: 'Shanghai Fresh Import Co.',
    quantity: '25,000 กิโลกรัม (1 ตู้เย็น)',
    incoterm: 'CIF (Cost, Insurance & Freight)',
    incotermCode: 'CIF',
    deliveryTarget: '20 พ.ย. 2026',
    price: '4,500,000 บาท',
    companyName: 'บริษัท ไทย อกริ เอ็กซ์พอร์ต จำกัด'
  });

  // รายการ Incoterms สำหรับ Drawer
  const incotermsList = [
    { code: 'EXW', name: 'Ex Works', desc: 'ผู้ซื้อรับผิดชอบค่าใช้จ่ายและความเสี่ยงทั้งหมดตั้งแต่โรงงาน' },
    { code: 'FCA', name: 'Free Carrier', desc: 'ผู้ขายส่งมอบสินค้าให้ผู้รับขนส่ง ณ สถานที่กำหนด' },
    { code: 'FOB', name: 'Free on Board', desc: 'ผู้ขายรับผิดชอบค่าใช้จ่ายและศุลกากรขาออกจนสินค้าลงเรือ' },
    { code: 'CFR', name: 'Cost and Freight', desc: 'ผู้ขายจ่ายค่าขนส่งทางเรือจนถึงท่าเรือปลายทาง' },
    { code: 'CIF', name: 'Cost, Insurance & Freight', desc: 'ผู้ขายจ่ายค่าขนส่งและประกันภัยทางทะเลถึงท่าเรือปลายทาง' },
    { code: 'DDP', name: 'Delivered Duty Paid', desc: 'ผู้ขายรับผิดชอบค่าใช้จ่ายและภาษีนำเข้าทั้งหมดจนถึงผู้ซื้อ' }
  ];

  // เลือก Incoterm จาก Drawer
  const handleSelectIncoterm = (item) => {
    setDealData(prev => ({
      ...prev,
      incotermCode: item.code,
      incoterm: `${item.code} (${item.name})`
    }));
    setIsDrawerOpen(false);
  };

  const stepsList = [
    { num: 1, title: 'ตกลงเงื่อนไขการค้า', sub: 'ระบุ Incoterms และราคาส่งออก' },
    { num: 2, title: 'เตรียมเอกสาร & ใบรับรอง', sub: 'อัปโหลด Phytosanitary & B/L' },
    { num: 3, title: 'สถานะการตรวจเอกสาร', sub: 'อนุมัติใบรับรองและศุลกากร' },
    { num: 4, title: 'ขนส่งสินค้าทางทะเล', sub: 'ตู้คอนเทนเนอร์ห้องเย็นออกเดินทาง' },
    { num: 5, title: 'ส่งมอบสำเร็จ', sub: 'ผู้ซื้อปลายทางรับมอบสินค้าเรียบร้อย' }
  ];

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '92vh', padding: '32px 24px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

        {/* Top Header & Role Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#1b4332', fontWeight: '800', margin: '0 0 6px 0' }}>
              ติดตามสถานะธุรกรรม
            </h1>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              ดีลหมายเลข: <span style={{ color: '#1b4332', fontWeight: '700' }}>{dealData.dealId}</span> ({dealData.productName} ไป{dealData.destination.split(' ')[0]})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{ padding: '8px 16px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>📖</span> เงื่อนไข Incoterms (Drawer)
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e9ecef', fontSize: '13px' }}>
              <span style={{ color: '#6c757d' }}>จำลองบทบาท:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ border: 'none', outline: 'none', fontWeight: '700', color: '#1b4332', backgroundColor: 'transparent', cursor: 'pointer' }}
              >
                <option value="EXPORTER">🧑‍💼 ผู้ส่งออก (Exporter)</option>
                <option value="MIDDLEMAN">👨‍🌾 ผู้รวบรวม (Middleman)</option>
                <option value="BUYER">🏢 ผู้ซื้อปลายทาง (Buyer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Stepper Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e9ecef', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: '0 0 20px 0' }}>
            ความคืบหน้าการส่งออก (Transaction Stepper)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
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
                    borderRadius: '12px',
                    padding: '16px 14px',
                    border: isActive ? '2px solid #e9c46a' : isPassed ? '1px solid #d8f3dc' : '1px solid #e9ecef',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '100px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', opacity: isActive ? 0.9 : 0.6, marginBottom: '6px' }}>
                      STEP 0{st.num} {isPassed && '✓'}
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', lineHeight: '1.3', marginBottom: '4px' }}>
                      {st.title}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', opacity: isActive ? 0.8 : 0.6, lineHeight: '1.2' }}>
                    {st.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area based on Selected Step */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '24px' }}>

          {/* Left Main Details Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e9ecef', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
            
            {/* STEP 1 CONTENT */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: '17px', color: '#1b4332', fontWeight: '700', margin: '0 0 20px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  รายละเอียดข้อตกลงและเงื่อนไขการค้า (Trade Terms)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginBottom: '24px', fontSize: '14px' }}>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>สินค้าส่งออก:</span>
                    <strong style={{ color: '#1b4332' }}>{dealData.productName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>ปริมาณ:</span>
                    <strong style={{ color: '#1b4332' }}>{dealData.quantity}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>ประเทศปลายทาง:</span>
                    <strong style={{ color: '#1b4332' }}>{dealData.destination}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>เงื่อนไข Incoterms:</span>
                    <strong style={{ color: '#1b4332' }}>{dealData.incoterm}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>ผู้ซื้อปลายทาง:</span>
                    <strong style={{ color: '#1b4332' }}>{dealData.buyer}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#6c757d', display: 'block', fontSize: '12.5px', marginBottom: '2px' }}>เป้าหมายการส่งมอบ:</span>
                    <strong style={{ color: '#1b4332' }}>{dealData.deliveryTarget}</strong>
                  </div>
                </div>

                {/* Price Box */}
                <div style={{ backgroundColor: '#f4f9f5', border: '1px solid #d8f3dc', padding: '16px 20px', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>💰</span>
                  <div style={{ fontSize: '14px', color: '#1b4332', fontWeight: '600' }}>
                    ราคารวมธุรกรรม (เปิดเผยเฉพาะ Exporter & Middleman): <span style={{ color: '#2d6a4f', fontSize: '17px', fontWeight: '800' }}>{dealData.price}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '13.5px', fontWeight: '600' }}>
                  <Link href="/documents" style={{ color: '#1b4332', textDecoration: 'none' }}>
                    ไปยังคลังเอกสารเพื่อแนบไฟล์ ➔
                  </Link>
                  <Link href="/ai-legal" style={{ color: '#1b4332', textDecoration: 'none' }}>
                    ปรึกษา AI ข้อกำหนดส่งออก ➔
                  </Link>
                </div>
              </div>
            )}

            {/* STEP 2 CONTENT */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: '17px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  เตรียมเอกสาร & ใบรับรอง (Documents Preparation)
                </h3>
                <p style={{ fontSize: '13.5px', color: '#6c757d', marginBottom: '20px' }}>อัปโหลดและตรวจทานเอกสารทางกฎหมายและสุขอนามัยพืชก่อนส่งตรวจอนุมัติ</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Sales Contract (สัญญาซื้อขาย)', 'Phytosanitary Certificate (ใบรับรองสุขอนามัยพืช)', 'Bill of Lading (B/L)', 'Form E (หนังสือรับรองถิ่นกำเนิด)'].map((doc, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef', fontSize: '13.5px' }}>
                      <span style={{ fontWeight: '600', color: '#1b4332' }}>📄 {doc}</span>
                      <span style={{ backgroundColor: '#d8f3dc', color: '#1b4332', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '700' }}>พร้อมส่งตรวจ</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 CONTENT */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ fontSize: '17px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  สถานะการตรวจเอกสาร (Document Compliance)
                </h3>
                <div style={{ backgroundColor: '#d8f3dc', color: '#1b4332', padding: '16px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>
                  ✓ ผ่านการอนุมัติใบรับรองสุขอนามัยพืช (DOA) และพิธีการศุลกากรขาออกเรียบร้อยแล้ว
                </div>
              </div>
            )}

            {/* STEP 4 CONTENT */}
            {currentStep === 4 && (
              <div>
                <h3 style={{ fontSize: '17px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  ขนส่งสินค้าทางทะเล (In Transit)
                </h3>
                <div style={{ fontSize: '14px', color: '#1b4332', lineHeight: '1.6' }}>
                  🚢 ตู้คอนเทนเนอร์ห้องเย็น (Reefer Container) อยู่ระหว่างการเดินทางมุ่งหน้าสู่ <strong>{dealData.destination}</strong>
                  <div style={{ marginTop: '10px', color: '#6c757d', fontSize: '13px' }}>อุณหภูมิตู้คอนเทนเนอร์ปัจจุบัน: 13.0°C (ปกติ)</div>
                </div>
              </div>
            )}

            {/* STEP 5 CONTENT */}
            {currentStep === 5 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '20px', color: '#1b4332', fontWeight: '800', marginBottom: '8px' }}>ส่งมอบสินค้าสำเร็จเรียบร้อย!</h3>
                <p style={{ color: '#6c757d', fontSize: '14px' }}>ผู้ซื้อปลายทาง ({dealData.buyer}) ได้รับมอบสินค้าตามเงื่อนไข {dealData.incotermCode} สมบูรณ์แล้ว</p>
              </div>
            )}

            {/* Step Control Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #1b4332', backgroundColor: '#ffffff', color: '#1b4332', fontWeight: '700', cursor: currentStep === 1 ? 'not-allowed' : 'pointer', opacity: currentStep === 1 ? 0.5 : 1, fontSize: '13px' }}
              >
                ⬅️ ย้อนกลับ Step
              </button>
              <button
                disabled={currentStep === 5}
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#1b4332', color: '#ffffff', fontWeight: '700', cursor: currentStep === 5 ? 'not-allowed' : 'pointer', opacity: currentStep === 5 ? 0.5 : 1, fontSize: '13px', boxShadow: '0 4px 10px rgba(27,67,50,0.2)' }}
              >
                ไปยัง Step ถัดไป ➔
              </button>
            </div>

          </div>

          {/* Right Stakeholders Sidebar */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e9ecef', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0' }}>
              ผู้เกี่ยวข้องในดีล (Stakeholders)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Exporter */}
              <div style={{ backgroundColor: '#f4f9f5', border: '1px solid #d8f3dc', padding: '14px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#1b4332' }}>EXPORTER</span>
                  <span style={{ fontSize: '10px', backgroundColor: '#0071e3', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>คุณอยู่ที่บทบาทนี้</span>
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1b4332' }}>{dealData.companyName}</div>
                <div style={{ fontSize: '12px', color: '#2d6a4f', marginTop: '4px' }}>🟢 พร้อมส่งออก (Ready)</div>
              </div>

              {/* Middleman */}
              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#6c757d', marginBottom: '4px' }}>MIDDLEMAN</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#212529' }}>คุณสมชาย (ผู้รวบรวม & ตัดเกรด)</div>
                <div style={{ fontSize: '12px', color: '#2d6a4f', marginTop: '4px' }}>🟢 สินค้าพร้อมจัดส่ง</div>
              </div>

              {/* Farmer */}
              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#6c757d', marginBottom: '4px' }}>FARMER</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#212529' }}>กลุ่มเกษตรกรแปลงใหญ่ จ.จันทบุรี</div>
                <div style={{ fontSize: '12px', color: '#2d6a4f', marginTop: '4px' }}>🟢 เก็บเกี่ยวเรียบร้อย</div>
              </div>

              {/* Freight Forwarder */}
              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#6c757d', marginBottom: '4px' }}>FREIGHT_FORWARDER</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#212529' }}>Global Logistics Express</div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>⚪ จองตู้คอนเทนเนอร์แล้ว</div>
              </div>

            </div>
          </div>

        </div>

        {/* Incoterms Drawer Component */}
        {isDrawerOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '400px', height: '100%', backgroundColor: '#ffffff', padding: '28px', boxSizing: 'border-box', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e9c46a', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0, color: '#1b4332', fontSize: '18px', fontWeight: '800' }}>📖 คู่มือ Incoterms 2020</h3>
                <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#1b4332' }}>✕</button>
              </div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '16px' }}>เลือกเงื่อนไขเพื่อซิงก์ข้อมูลใส่ในดีลส่งออก:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {incotermsList.map((item) => (
                  <div
                    key={item.code}
                    onClick={() => handleSelectIncoterm(item)}
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      border: dealData.incotermCode === item.code ? '2px solid #1b4332' : '1px solid #e9ecef',
                      backgroundColor: dealData.incotermCode === item.code ? '#f4f9f5' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#1b4332', fontSize: '14px' }}>{item.code} - {item.name}</div>
                    <div style={{ fontSize: '12.5px', color: '#6c757d', marginTop: '4px', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}