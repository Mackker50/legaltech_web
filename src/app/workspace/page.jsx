'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function TransactionStatusPage() {
  const context = useAppContext() || {};
  const { lang } = context;

  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState('EXPORTER');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const incotermsList = [
    { code: 'EXW', name: 'Ex Works', desc: 'ผู้ซื้อรับผิดชอบค่าใช้จ่ายและความเสี่ยงทั้งหมดตั้งแต่โรงงาน' },
    { code: 'FCA', name: 'Free Carrier', desc: 'ผู้ขายส่งมอบสินค้าให้ผู้รับขนส่ง ณ สถานที่กำหนด' },
    { code: 'FOB', name: 'Free on Board', desc: 'ผู้ขายรับผิดชอบค่าใช้จ่ายและศุลกากรขาออกจนสินค้าลงเรือ' },
    { code: 'CFR', name: 'Cost and Freight', desc: 'ผู้ขายจ่ายค่าขนส่งทางเรือจนถึงท่าเรือปลายทาง' },
    { code: 'CIF', name: 'Cost, Insurance & Freight', desc: 'ผู้ขายจ่ายค่าขนส่งและประกันภัยทางทะเลถึงท่าเรือปลายทาง' },
    { code: 'DDP', name: 'Delivered Duty Paid', desc: 'ผู้ขายรับผิดชอบค่าใช้จ่ายและภาษีนำเข้าทั้งหมดจนถึงผู้ซื้อ' }
  ];

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
    { num: 5, title: 'ส่งมอบสำเร็จ', sub: 'ผู้ซื้อปลายทางรับมอบสินค้า' }
  ];

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '92vh', padding: '24px 32px', width: '100%', boxSizing: 'border-box', fontFamily: "'Prompt', sans-serif" }}>
      {/* Full Width Container */}
      <div style={{ width: '100%' }}>

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: '#1b4332', fontWeight: '800', margin: '0 0 4px 0' }}>
              ติดตามสถานะธุรกรรม
            </h1>
            <div style={{ fontSize: '13.5px', color: '#6c757d' }}>
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

        {/* Stepper Card - 100% Width */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '15px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0' }}>
            ความคืบหน้าการส่งออก (Transaction Stepper)
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

        {/* Grid Details (Left 75% | Right 25%) */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', width: '100%' }}>

          {/* Left Side: Trade Terms & Steps */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: '0 0 18px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  รายละเอียดข้อตกลงและเงื่อนไขการค้า (Trade Terms)
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', marginBottom: '24px', fontSize: '14px' }}>
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

                {/* Price Bar */}
                <div style={{ backgroundColor: '#f4f9f5', border: '1px solid #d8f3dc', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>💰</span>
                  <div style={{ fontSize: '13.5px', color: '#1b4332', fontWeight: '600' }}>
                    ราคารวมธุรกรรม (เปิดเผยเฉพาะ Exporter & Middleman): <span style={{ color: '#2d6a4f', fontSize: '16px', fontWeight: '800' }}>{dealData.price}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '700' }}>
                  <Link href="/documents" style={{ color: '#1b4332', textDecoration: 'none' }}>
                    ไปยังคลังเอกสารเพื่อแนบไฟล์ ➔
                  </Link>
                  <Link href="/ai-legal" style={{ color: '#1b4332', textDecoration: 'none' }}>
                    ปรึกษา AI ข้อกำหนดส่งออก ➔
                  </Link>
                </div>
              </div>
            )}

            {currentStep > 1 && (
              <div>
                <h3 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                  {stepsList[currentStep - 1].title}
                </h3>
                <p style={{ fontSize: '14px', color: '#495057' }}>{stepsList[currentStep - 1].sub}</p>
              </div>
            )}

            {/* Stepper Controllers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => prev - 1)}
                style={{ padding: '8px 18px', borderRadius: '6px', border: '1px solid #1b4332', backgroundColor: '#ffffff', color: '#1b4332', fontWeight: '700', cursor: currentStep === 1 ? 'not-allowed' : 'pointer', opacity: currentStep === 1 ? 0.4 : 1, fontSize: '13px' }}
              >
                ⬅️ ย้อนกลับ
              </button>
              <button
                disabled={currentStep === 5}
                onClick={() => setCurrentStep(prev => prev + 1)}
                style={{ padding: '8px 22px', borderRadius: '6px', border: 'none', backgroundColor: '#1b4332', color: '#ffffff', fontWeight: '700', cursor: currentStep === 5 ? 'not-allowed' : 'pointer', opacity: currentStep === 5 ? 0.4 : 1, fontSize: '13px' }}
              >
                ถัดไป ➔
              </button>
            </div>

          </div>

          {/* Right Side: Stakeholders */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '15px', color: '#1b4332', fontWeight: '700', margin: '0 0 16px 0' }}>
              ผู้เกี่ยวข้องในดีล (Stakeholders)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ backgroundColor: '#f4f9f5', border: '1px solid #d8f3dc', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#1b4332', marginBottom: '2px' }}>EXPORTER</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1b4332' }}>{dealData.companyName}</div>
                <div style={{ fontSize: '11px', color: '#2d6a4f', marginTop: '2px' }}>🟢 พร้อมส่งออก (Ready)</div>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#6c757d', marginBottom: '2px' }}>MIDDLEMAN</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#212529' }}>คุณสมชาย (ผู้รวบรวม & ตัดเกรด)</div>
                <div style={{ fontSize: '11px', color: '#2d6a4f', marginTop: '2px' }}>🟢 สินค้าพร้อมจัดส่ง</div>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#6c757d', marginBottom: '2px' }}>FARMER</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#212529' }}>กลุ่มเกษตรกรแปลงใหญ่ จ.จันทบุรี</div>
                <div style={{ fontSize: '11px', color: '#2d6a4f', marginTop: '2px' }}>🟢 เก็บเกี่ยวเรียบร้อย</div>
              </div>

              <div style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#6c757d', marginBottom: '2px' }}>FREIGHT_FORWARDER</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#212529' }}>Global Logistics Express</div>
                <div style={{ fontSize: '11px', color: '#6c757d', marginTop: '2px' }}>⚪ จองตู้คอนเทนเนอร์แล้ว</div>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Incoterms 2020 */}
        {isDrawerOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '380px', height: '100%', backgroundColor: '#ffffff', padding: '24px', boxSizing: 'border-box', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, color: '#1b4332', fontSize: '16px', fontWeight: '800' }}>📖 คู่มือ Incoterms 2020</h3>
                <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#1b4332' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {incotermsList.map((item) => (
                  <div
                    key={item.code}
                    onClick={() => handleSelectIncoterm(item)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: dealData.incotermCode === item.code ? '2px solid #1b4332' : '1px solid #e9ecef',
                      backgroundColor: dealData.incotermCode === item.code ? '#f4f9f5' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#1b4332', fontSize: '13.5px' }}>{item.code} - {item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>{item.desc}</div>
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