'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('all');

  // รายการประวัติธุรกรรมจาก deals.json
  const [allDeals, setAllDeals] = useState([]);
  const [selectedDealForModal, setSelectedDealForModal] = useState(null);

  // ฟอร์มสำหรับบันทึกรายการดีลใหม่
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dealData, setDealData] = useState({
    dealId: 'EXP-' + new Date().getFullYear() + '-00' + Math.floor(Math.random() * 90 + 10),
    productName: '',
    destination: '',
    buyer: '',
    quantity: '',
    incoterm: 'FOB - Free on Board',
    incotermCode: 'FOB',
    deliveryTarget: '',
    price: '',
    companyName: ''
  });

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
    'จีน (ท่าเรือ Shanghai / Guangzhou)',
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

  useEffect(() => {
    fetchDealData();
  }, []);

  const fetchDealData = async () => {
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      if (data.success && data.deals) {
        setAllDeals(data.deals);
      }
    } catch (err) {
      console.error('Error loading deals from json:', err);
    }
  };

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dealData, currentStep: 1 }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'บันทึกรายการประวัติการทำธุรกรรมใหม่สำเร็จแล้ว' });
        setIsFormOpen(false);
        if (data.deals) setAllDeals(data.deals);
        else fetchDealData();
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'บันทึกไม่สำเร็จ' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'ไม่สามารถเชื่อมต่อระบบได้' });
    } finally {
      setLoading(false);
    }
  };

  // คำนวณภาพรวม Stats
  const completedDealsCount = allDeals.filter(d => d.currentStep === 5).length;
  const processingDealsCount = allDeals.filter(d => d.currentStep < 5).length;

  // ฟิลเตอร์ค้นหาดีล
  const filteredDeals = allDeals.filter(deal => {
    const matchesSearch = 
      (deal.dealId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.buyer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (deal.destination || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilterStatus === 'completed') {
      return matchesSearch && deal.currentStep === 5;
    } else if (selectedFilterStatus === 'processing') {
      return matchesSearch && deal.currentStep < 5;
    }
    return matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#f4f6f8', minHeight: '100vh', padding: '36px 48px', width: '100%', boxSizing: 'border-box', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Top Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Agricultural Export Logistics
            </div>
            <h1 style={{ fontSize: '32px', color: '#1b4332', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
              ประวัติการทำธุรกรรม
            </h1>
            <p style={{ fontSize: '14.5px', color: '#6c757d', margin: '6px 0 0 0' }}>
              รวบรวมข้อมูลรายการส่งออกสินค้าเกษตร สถานะดำเนินงาน และคลังเอกสารสัญญาย้อนหลังทั้งหมด
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            style={{ padding: '12px 24px', backgroundColor: isFormOpen ? '#6c757d' : '#1b4332', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14.5px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(27,67,50,0.2)', transition: 'all 0.2s ease' }}
          >
            {isFormOpen ? '✕ ปิดฟอร์ม' : '➕ บันทึกธุรกรรมใหม่'}
          </button>
        </div>

        {/* Dashboard Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#6c757d', marginBottom: '6px' }}>ดีลส่งออกทั้งหมด</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#1b4332' }}>{allDeals.length} <span style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d' }}>รายการ</span></div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#856404', marginBottom: '6px' }}>⏳ กำลังดำเนินการ</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#b78103' }}>{processingDealsCount} <span style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d' }}>รายการ</span></div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '20px 24px', borderRadius: '16px', border: '1px solid #e9ecef', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#2d6a4f', marginBottom: '6px' }}>✅ สำเร็จเรียบร้อย</div>
            <div style={{ fontSize: '30px', fontWeight: '800', color: '#2d6a4f' }}>{completedDealsCount} <span style={{ fontSize: '14px', fontWeight: '600', color: '#6c757d' }}>รายการ</span></div>
          </div>
        </div>

        {statusMsg && (
          <div style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: statusMsg.type === 'success' ? '#d8f3dc' : '#fff0f0', color: statusMsg.type === 'success' ? '#1b4332' : '#e63946', border: `1px solid ${statusMsg.type === 'success' ? '#b7e4c7' : '#ffcdd2'}` }}>
            {statusMsg.text}
          </div>
        )}

        {/* Drawer Form สำหรับบันทึกรายการดีลใหม่ */}
        {isFormOpen && (
          <form onSubmit={handleSaveDeal} style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '18px', border: '2px solid #1b4332', marginBottom: '32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
            <h3 style={{ gridColumn: 'span 3', fontSize: '19px', color: '#1b4332', fontWeight: '800', margin: '0 0 8px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '10px' }}>
              🌾 เพิ่มรายการดีลส่งออกใหม่
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>1. สินค้าเกษตรส่งออก <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.productName} onChange={(e) => setDealData({ ...dealData, productName: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600', outline: 'none' }}>
                <option value="">-- เลือกประเภทสินค้า --</option>
                {productOptions.map((item, idx) => (<option key={idx} value={item}>📦 {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>2. ประเทศปลายทาง <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.destination} onChange={(e) => setDealData({ ...dealData, destination: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600', outline: 'none' }}>
                <option value="">-- เลือกประเทศปลายทาง --</option>
                {destinationOptions.map((item, idx) => (<option key={idx} value={item}>✈️ {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>3. เงื่อนไข Incoterms</label>
              <select value={dealData.incotermCode} onChange={(e) => setDealData({ ...dealData, incotermCode: e.target.value, incoterm: `${e.target.value}` })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600', outline: 'none' }}>
                {incotermsList.map(item => (<option key={item.code} value={item.code}>{item.code} - {item.name}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อผู้ส่งออก / กลุ่มเกษตรกร <span style={{ color: '#e63946' }}>*</span></label>
              <input type="text" required placeholder="เช่น กลุ่มเกษตรกรจันทบุรี หรือ ชื่อบริษัท" value={dealData.companyName} onChange={(e) => setDealData({ ...dealData, companyName: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อบริษัทผู้ซื้อ (Buyer)</label>
              <input type="text" placeholder="เช่น Shanghai Fresh Import Co." value={dealData.buyer} onChange={(e) => setDealData({ ...dealData, buyer: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ปริมาณสินค้าทั้งหมด</label>
              <input type="text" placeholder="เช่น 25,000 กิโลกรัม" value={dealData.quantity} onChange={(e) => setDealData({ ...dealData, quantity: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>มูลค่าธุรกรรม (บาท)</label>
              <input type="text" placeholder="เช่น 4,500,000 บาท" value={dealData.price} onChange={(e) => setDealData({ ...dealData, price: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>กำหนดวันที่ส่งมอบ</label>
              <input type="date" value={dealData.deliveryTarget} onChange={(e) => setDealData({ ...dealData, deliveryTarget: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }} />
            </div>

            <div style={{ gridColumn: 'span 3', textAlign: 'right', marginTop: '10px' }}>
              <button type="submit" disabled={loading} style={{ padding: '12px 36px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(27,67,50,0.15)' }}>
                {loading ? '⚡ กำลังบันทึก...' : '💾 บันทึกประวัติธุรกรรมใหม่'}
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter Toolbar */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e9ecef', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', marginBottom: '28px', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#8d99ae' }}>🔍</span>
            <input
              type="text"
              placeholder="ค้นหาตามรหัสดีล (EXP-XXX), ประเภทสินค้า, ชื่อผู้ส่งออก, บริษัทผู้ซื้อ หรือประเทศปลายทาง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '13px 16px 13px 48px', borderRadius: '12px', border: '1.5px solid #e9ecef', fontSize: '14px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#f8f9fa' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setSelectedFilterStatus('all')}
              style={{ padding: '11px 20px', borderRadius: '10px', border: 'none', backgroundColor: selectedFilterStatus === 'all' ? '#1b4332' : '#f8f9fa', color: selectedFilterStatus === 'all' ? '#fff' : '#495057', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              ทั้งหมด ({allDeals.length})
            </button>
            <button
              onClick={() => setSelectedFilterStatus('processing')}
              style={{ padding: '11px 20px', borderRadius: '10px', border: 'none', backgroundColor: selectedFilterStatus === 'processing' ? '#1b4332' : '#f8f9fa', color: selectedFilterStatus === 'processing' ? '#fff' : '#495057', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              ⏳ กำลังดำเนินการ
            </button>
            <button
              onClick={() => setSelectedFilterStatus('completed')}
              style={{ padding: '11px 20px', borderRadius: '10px', border: 'none', backgroundColor: selectedFilterStatus === 'completed' ? '#1b4332' : '#f8f9fa', color: selectedFilterStatus === 'completed' ? '#fff' : '#495057', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              ✅ สำเร็จแล้ว
            </button>
          </div>

        </div>

        {/* Transaction History Cards List */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', border: '1px solid #e9ecef', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '14px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '19px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
              รายการประวัติธุรกรรมส่งออก ({filteredDeals.length} ดีล)
            </h3>
            <Link href="/workspace" style={{ color: '#1b4332', fontSize: '13.5px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ติดตามดีลปัจจุบัน (Workspace) ➔
            </Link>
          </div>

          {filteredDeals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '56px 20px', color: '#6c757d', fontSize: '15px' }}>
              ไม่พบประวัติการทำธุรกรรมที่ตรงตามเงื่อนไขค้นหา
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {filteredDeals.map((item, index) => {
                const uploadedCount = (item.documents || []).filter(d => d.uploaded).length;

                return (
                  <div
                    key={item.dealId || index}
                    style={{
                      padding: '24px',
                      borderRadius: '14px',
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#1b4332', color: '#ffffff', padding: '4px 12px', borderRadius: '6px', letterSpacing: '0.5px' }}>
                          {item.dealId}
                        </span>
                        <span style={{ fontSize: '18px', fontWeight: '800', color: '#1b4332' }}>
                          📦 {item.productName || 'ไม่ระบุสินค้า'}
                        </span>
                        <span style={{ fontSize: '14px', color: '#2d6a4f', fontWeight: '700' }}>
                          ➔ ✈️ {item.destination || 'ไม่ระบุปลายทาง'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '28px', fontSize: '13.5px', color: '#495057', marginTop: '12px' }}>
                        <div>ผู้ส่งออก: <strong style={{ color: '#1b4332' }}>{item.companyName || '-'}</strong></div>
                        <div>ผู้ซื้อ: <strong style={{ color: '#1b4332' }}>{item.buyer || '-'}</strong></div>
                        <div>ปริมาณ: <strong>{item.quantity || '-'}</strong></div>
                        <div>มูลค่ารวม: <strong style={{ color: '#2d6a4f' }}>{item.price || '-'}</strong></div>
                        <div>Incoterms: <strong>{item.incotermCode || '-'}</strong></div>
                      </div>

                      <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#6c757d', display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span>📁 ไฟล์เอกสารในระบบ: <strong style={{ color: '#1b4332' }}>{uploadedCount} / {item.documents?.length || 5} ไฟล์</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '14px', flexShrink: 0 }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '800', padding: '6px 16px', borderRadius: '20px', backgroundColor: item.currentStep === 5 ? '#d8f3dc' : '#fff3cd', color: item.currentStep === 5 ? '#1b4332' : '#856404' }}>
                        {item.currentStep === 5 ? '✅ ส่งมอบสำเร็จแล้ว' : `⏳ ขั้นตอน Step 0${item.currentStep || 1}`}
                      </span>

                      <button
                        onClick={() => setSelectedDealForModal(item)}
                        style={{ padding: '10px 20px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      >
                        👁️ ดูรายละเอียด & เอกสารสัญญา
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal แสดงรายละเอียดธุรกรรมและดาวน์โหลดเอกสาร */}
        {selectedDealForModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(3px)' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '36px', width: '680px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e9c46a', paddingBottom: '14px', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, color: '#1b4332', fontSize: '21px', fontWeight: '800' }}>
                  📜 รายละเอียดธุรกรรม {selectedDealForModal.dealId}
                </h3>
                <button onClick={() => setSelectedDealForModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#1b4332' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px', fontSize: '14px', marginBottom: '28px', backgroundColor: '#f4f9f5', padding: '20px', borderRadius: '12px', border: '1px solid #d8f3dc' }}>
                <div>สินค้า: <strong>{selectedDealForModal.productName}</strong></div>
                <div>ปลายทาง: <strong>{selectedDealForModal.destination}</strong></div>
                <div>ผู้ส่งออก: <strong>{selectedDealForModal.companyName}</strong></div>
                <div>ผู้ซื้อ: <strong>{selectedDealForModal.buyer}</strong></div>
                <div>ปริมาณ: <strong>{selectedDealForModal.quantity}</strong></div>
                <div>ราคา: <strong style={{ color: '#2d6a4f' }}>{selectedDealForModal.price}</strong></div>
                <div>Incoterms: <strong>{selectedDealForModal.incoterm}</strong></div>
                <div>กำหนดส่งมอบ: <strong>{selectedDealForModal.deliveryTarget || '-'}</strong></div>
              </div>

              <h4 style={{ fontSize: '16px', color: '#1b4332', fontWeight: '800', marginBottom: '14px' }}>
                📁 เอกสารสัญญาและใบรับรองในดีลนี้:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {(selectedDealForModal.documents || []).map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e9ecef' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1b4332' }}>
                      {doc.name}
                    </div>
                    {doc.uploaded ? (
                      <a href={doc.fileUrl} download={doc.fileName} style={{ padding: '7px 16px', backgroundColor: '#1b4332', color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                        📥 ดาวน์โหลดไฟล์
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#adb5bd' }}>⚪ ยังไม่ได้อัปโหลด</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setSelectedDealForModal(null)} style={{ padding: '11px 28px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                  ปิดหน้าต่าง
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}