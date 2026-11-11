'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StatusTrackingPage() {
  const [activeDeal, setActiveDeal] = useState(null);
  const [loading, setLoading] = useState(true);

  // 5 ขั้นตอนมาตรฐานในการส่งออกสินค้าเกษตรตามกฎหมาย
  const pipelineSteps = [
    {
      stepNumber: 1,
      title: 'ทำสัญญาซื้อขายและสัญญาคนกลาง (Multi-Party Contract)',
      desc: 'ระบุ Incoterms 2020, HS Code, สเปกความชื้น และข้อกำหนดป้องกันรายได้ตกหล่น',
      authority: 'คู่ค้า / พ่อค้าคนกลาง',
      badge: 'CONTRACT VALIDATED'
    },
    {
      stepNumber: 2,
      title: 'ขอใบรับรองสุขอนามัยพืช (พ.ก. 7 - DOA)',
      desc: 'ตรวจสอบศัตรูพืชกักกัน ตรวจรับรองแปลง GAP และโรงคัดบรรจุ GMP ผ่านระบบ e-Phyto',
      authority: 'กรมวิชาการเกษตร (DOA)',
      badge: 'SPS / PHYTO'
    },
    {
      stepNumber: 3,
      title: 'พิธีการศุลกากรขาออก (e-Export Customs)',
      desc: 'ยื่นใบขนสินค้าขาออกผ่านระบบ NSW และขอหนังสือรับรองถิ่นกำเนิดสินค้า (Form E / D / JTEPA / AI)',
      authority: 'กรมศุลกากร / กรมการค้าต่างประเทศ',
      badge: 'CUSTOMS CLEARED'
    },
    {
      stepNumber: 4,
      title: 'ควบคุมการขนส่งและอุณหภูมิ (Reefer Cold Chain)',
      desc: 'บรรจุตู้สินค้า ควบคุมความชื้น/อุณหภูมิห้องเย็น พร้อมบันทึก Data Logger ตลอดเส้นทาง',
      authority: 'สายการเดินเรือ / Freight Forwarder',
      badge: 'COLD CHAIN MONITOR'
    },
    {
      stepNumber: 5,
      title: 'ตรวจปล่อย ณ ด่านสากลปลายทางและส่งมอบ',
      desc: 'ยื่นตรวจปล่อย ณ ด่านปลายทาง (GACC, MAFF, FDA, MAQIS, DPPQS) และชำระเงินตาม L/C หรือ T/T',
      authority: 'ด่านกักกันพืชประเทศปลายทาง',
      badge: 'FINAL DELIVERY'
    }
  ];

  useEffect(() => {
    loadStatusData();
  }, []);

  const loadStatusData = async () => {
    try {
      // 1. ตรวจสอบข้อมูลจาก localStorage ก่อน (กรณีผู้ใช้กดเลือกดีลมาจาก Workspace)
      if (typeof window !== 'undefined') {
        const localActive = localStorage.getItem('active_deal');
        if (localActive) {
          try {
            const parsed = JSON.parse(localActive);
            if (parsed && parsed.dealId) {
              setActiveDeal(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error('Invalid deal format in localStorage', e);
          }
        }
      }

      // 2. ถ้าไม่มีใน localStorage ให้ดึงจาก API
      const res = await fetch('/api/deals', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.deals) && data.deals.length > 0) {
          setActiveDeal(data.deals[0]);
          setLoading(false);
          return;
        }
      }

      // 3. Fallback ข้อมูลเริ่มต้นถ้ายังไม่มีดีล
      setActiveDeal({
        dealId: 'EXP-2026-CN01',
        productName: 'ทุเรียนหมอนทองสดเกรดส่งออก (HS: 0810.60.00)',
        destination: 'สาธารณรัฐประชาชนจีน (China - Shanghai Port)',
        buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
        companyName: 'กลุ่มเกษตรกรแปลงใหญ่ จันทบุรี',
        intermediaryName: 'บริษัท ไทย อกริ โลจิสติกส์ จำกัด',
        quantity: '25,000 กิโลกรัม (ตู้ Reefer 40ft)',
        price: '4,500,000 บาท',
        incoterm: 'CIF - Cost, Insurance and Freight',
        currentStep: 2,
        status: 'IN_PROGRESS',
        date: '2026-11-10'
      });
    } catch (err) {
      console.warn('Status fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = activeDeal?.currentStep || 2;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '36px 32px 80px 32px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>

        {/* แถบหัวเรื่องด้านบน */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              Export Tracking & Legal Compliance
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1b4332', margin: 0 }}>
              📊 ติดตามสถานะและขั้นตอนพิธีการส่งออก
            </h1>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: '4px 0 0 0' }}>
              ระบบตรวจสอบกระบวนการส่งออกตามข้อกำหนดกฎหมายของ 5 ประเทศเป้าหมาย
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
            <Link
              href="/ai-legal"
              style={{
                padding: '9px 18px',
                backgroundColor: '#1b4332',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(27,67,50,0.18)'
              }}
            >
              ⚖️ ปรึกษากฎหมาย AI
            </Link>
          </div>
        </div>

        {/* กล่องสรุปรายละเอียดของดีลปัจจุบัน */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>รหัสติดตามธุรกรรม:</span>
              <strong style={{ fontSize: '18px', color: '#1b4332', marginLeft: '8px' }}>{activeDeal?.dealId || 'EXP-2026-CN01'}</strong>
            </div>
            <span style={{ padding: '4px 14px', backgroundColor: '#d8f3dc', color: '#1b4332', borderRadius: '20px', fontSize: '12.5px', fontWeight: '800' }}>
              กำลังดำเนินการ (ขั้นตอนที่ {currentStep} จาก 5)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>สินค้าส่งออก:</span>
              <strong style={{ color: '#1e293b', fontSize: '14px' }}>{activeDeal?.productName || 'ทุเรียนหมอนทองสด'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>ตลาดปลายทาง:</span>
              <strong style={{ color: '#1e293b', fontSize: '14px' }}>{activeDeal?.destination || 'จีน (Shanghai Port)'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>ผู้ซื้อปลายทาง (Buyer):</span>
              <strong style={{ color: '#1e293b', fontSize: '14px' }}>{activeDeal?.buyer || 'Shanghai Fresh Global Fruit'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', marginBottom: '2px' }}>เงื่อนไข / มูลค่าสัญญา:</span>
              <strong style={{ color: '#2d6a4f', fontSize: '14px' }}>{activeDeal?.incoterm || 'CIF'} | {activeDeal?.price || '4,500,000 บาท'}</strong>
            </div>
          </div>
        </div>

        {/* แผนภูมิความคืบหน้า 5 ขั้นตอน (Stepper Timeline) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#1b4332', margin: '0 0 22px 0' }}>
            📌 ไทม์ไลน์ความคืบหน้าขั้นตอนส่งออกตามมาตรฐานกฎหมาย
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {pipelineSteps.map((st, i) => {
              const isPast = st.stepNumber < currentStep;
              const isCurrent = st.stepNumber === currentStep;

              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'flex-start',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    backgroundColor: isCurrent ? '#f4f9f5' : isPast ? '#ffffff' : '#fafafa',
                    border: isCurrent ? '1.5px solid #1b4332' : '1px solid #e2e8f0',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isPast ? '#16a34a' : isCurrent ? '#1b4332' : '#cbd5e1',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '14px',
                      flexShrink: 0
                    }}
                  >
                    {isPast ? '✓' : st.stepNumber}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: isCurrent ? '#1b4332' : '#334155' }}>
                        {st.title}
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        {st.authority}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', lineHeight: '1.5' }}>
                      {st.desc}
                    </div>
                  </div>

                  <div>
                    {isPast && (
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#16a34a' }}>✓ สำเร็จ</span>
                    )}
                    {isCurrent && (
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#1b4332', backgroundColor: '#d8f3dc', padding: '4px 10px', borderRadius: '20px' }}>
                        กำลังดำเนินการ
                      </span>
                    )}
                    {!isPast && !isCurrent && (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>รอดำเนินการ</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* กล่องสรุปข้อกำหนดความปลอดภัยและมาตรการของ 5 ประเทศเป้าหมาย */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px 28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1b4332', margin: '0 0 16px 0' }}>
            🛡️ ข้อกำหนดศุลกากรและมาตรการ SPS ของ 5 ประเทศเป้าหมาย (info.json)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', fontSize: '12.5px' }}>
            <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #1b4332' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '4px' }}>🇨🇳 สาธารณรัฐประชาชนจีน (GACC)</strong>
              ตรวจไม่พบเพลี้ยแป้งและแมลงวันผลไม้เด็ดขาด (Zero Tolerance) แคดเมียมไม่เกิน 0.05 mg/kg และใช้สิทธิ Form E (ACFTA) ยกเว้นภาษีนำเข้า 0%
            </div>

            <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #1b4332' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '4px' }}>🇺🇸 สหรัฐอเมริกา (US FDA & USDA)</strong>
              ต้องแจ้ง FDA Prior Notice ล่วงหน้า โรงงานมีเลขทะเบียน Facility Registration และเมล็ดพืช/ข้าวสารต้องผ่านการรมยา (Fumigation)
            </div>

            <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #1b4332' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '4px' }}>🇯🇵 ประเทศญี่ปุ่น (MAFF)</strong>
              มะม่วงสดต้องผ่านการอบไอน้ำ (VHT) อุณหภูมิเนื้อผล 46.8°C นาน 10 นาที และควบคุมสารเคมีตกค้างตามเกณฑ์ Positive List System (0.01 ppm)
            </div>

            <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #1b4332' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '4px' }}>🇲🇾 ประเทศมาเลเซีย (MAQIS)</strong>
              ผู้นำเข้าต้องมี Import Permit จากระบบ DagangNet ผ่านด่านตรวจร่วมตามที่ระบุในใบอนุญาต และใช้ Form D (ATIGA) ลดภาษีนำเข้า 0%
            </div>

            <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #1b4332' }}>
              <strong style={{ color: '#1b4332', display: 'block', marginBottom: '4px' }}>🇮🇳 สาธารณรัฐอินเดีย (DPPQS & FSSAI)</strong>
              ผู้นำเข้าต้องมี PQ Permit และสินค้าพืชส่วนใหญ่ต้องผ่านการรมยา Methyl Bromide (MB) พร้อมแนบใบรับรอง Non-GM Origin
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}