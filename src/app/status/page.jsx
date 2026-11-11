'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TransactionStatusPage() {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('all');

  // ข้อมูลดีลประวัติการทำธุรกรรมจาก deals.json
  const [allDeals, setAllDeals] = useState([]);
  const [selectedDealForModal, setSelectedDealForModal] = useState(null);

  // ข้อมูลฟอร์มสั้นสำหรับบันทึกรายการส่งออกรอบใหม่
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

  // ดึงข้อมูลจาก deals.json เมื่อโหลดหน้า
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
        setStatusMsg({ type: 'success', text: '✅ บันทึกรายการประวัติการส่งออกใหม่ลงไฟล์ JSON เรียบร้อยแล้ว' });
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

  // ระบบค้นหาประวัติการทำธุรกรรมจากข้อมูลใน deals.json
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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '92vh', padding: '28px 36px', width: '100%', boxSizing: 'border-box', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ width: '100%' }}>

        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#1b4332', fontWeight: '800', margin: '0 0 6px 0' }}>
              ประวัติการทำธุรกรรม (Transaction History)
            </h1>
            <div style={{ fontSize: '14px', color: '#6c757d' }}>
              ดึงข้อมูลประวัติรายการส่งออกทั้งหมดจาก <span style={{ color: '#1b4332', fontWeight: '700' }}>data/deals.json</span>
            </div>
          </div>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            style={{ padding: '11px 22px', backgroundColor: isFormOpen ? '#6c757d' : '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,67,50,0.18)' }}
          >
            {isFormOpen ? '✕ ปิดฟอร์ม' : '➕ บันทึกธุรกรรมใหม่'}
          </button>
        </div>

        {statusMsg && (
          <div style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', backgroundColor: statusMsg.type === 'success' ? '#d8f3dc' : '#fff0f0', color: statusMsg.type === 'success' ? '#1b4332' : '#e63946', border: `1px solid ${statusMsg.type === 'success' ? '#b7e4c7' : '#ffcdd2'}` }}>
            {statusMsg.text}
          </div>
        )}

        {/* ฟอร์มกรอกรายการดีลส่งออกใหม่ */}
        {isFormOpen && (
          <form onSubmit={handleSaveDeal} style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '14px', border: '2px solid #1b4332', marginBottom: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <h3 style={{ gridColumn: 'span 3', fontSize: '18px', color: '#1b4332', fontWeight: '800', margin: '0 0 6px 0', borderBottom: '2px solid #e9c46a', paddingBottom: '8px' }}>
              🌾 บันทึกประวัติรายการธุรกรรมใหม่
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>1. สินค้าเกษตรส่งออก <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.productName} onChange={(e) => setDealData({ ...dealData, productName: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- เลือกสินค้า --</option>
                {productOptions.map((item, idx) => (<option key={idx} value={item}>📦 {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>2. ประเทศปลายทาง <span style={{ color: '#e63946' }}>*</span></label>
              <select required value={dealData.destination} onChange={(e) => setDealData({ ...dealData, destination: e.target.value })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                <option value="">-- เลือกประเทศปลายทาง --</option>
                {destinationOptions.map((item, idx) => (<option key={idx} value={item}>✈️ {item}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>3. เงื่อนไข Incoterms</label>
              <select value={dealData.incotermCode} onChange={(e) => setDealData({ ...dealData, incotermCode: e.target.value, incoterm: `${e.target.value}` })} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #1b4332', fontSize: '14px', backgroundColor: '#f4f9f5', cursor: 'pointer', fontWeight: '600' }}>
                {incotermsList.map(item => (<option key={item.code} value={item.code}>{item.code} - {item.name}</option>))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อเกษตรกร / ผู้ส่งออก <span style={{ color: '#e63946' }}>*</span></label>
              <input type="text" required placeholder="เช่น สวนทุเรียนไทย หรือ ชื่อบริษัท" value={dealData.companyName} onChange={(e) => setDealData({ ...dealData, companyName: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ชื่อบริษัทผู้ซื้อ (Buyer)</label>
              <input type="text" placeholder="เช่น Shanghai Fresh Import Co." value={dealData.buyer} onChange={(e) => setDealData({ ...dealData, buyer: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>ปริมาณสินค้า</label>
              <input type="text" placeholder="เช่น 25,000 กิโลกรัม" value={dealData.quantity} onChange={(e) => setDealData({ ...dealData, quantity: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>มูลค่าธุรกรรม (บาท)</label>
              <input type="text" placeholder="เช่น 4,500,000 บาท" value={dealData.price} onChange={(e) => setDealData({ ...dealData, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1b4332', marginBottom: '6px' }}>กำหนดส่งมอบ</label>
              <input type="date" value={dealData.deliveryTarget} onChange={(e) => setDealData({ ...dealData, deliveryTarget: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#fff' }} />
            </div>

            <div style={{ gridColumn: 'span 3', textAlign: 'right', marginTop: '8px' }}>
              <button type="submit" disabled={loading} style={{ padding: '12px 32px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? '⚡ กำลังบันทึก...' : '💾 ยืนยันบันทึกธุรกรรม'}
              </button>
            </div>
          </form>
        )}

        {/* SEARCH BAR & FILTER OPTIONS (ค้นหาประวัติ) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '20px 24px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ position: 'relative', width: '60%' }}>
            <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#6c757d' }}>🔍</span>
            <input
              type="text"
              placeholder="ค้นหาประวัติใน deals.json (รหัสดีล EXP-XXX, สินค้า, ผู้ส่งออก, บริษัทผู้ซื้อ หรือประเทศ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '10px', border: '1.5px solid #ced4da', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedFilterStatus('all')}
              style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: selectedFilterStatus === 'all' ? '#1b4332' : '#f8f9fa', color: selectedFilterStatus === 'all' ? '#fff' : '#495057', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              ทั้งหมด ({allDeals.length})
            </button>
            <button
              onClick={() => setSelectedFilterStatus('processing')}
              style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: selectedFilterStatus === 'processing' ? '#1b4332' : '#f8f9fa', color: selectedFilterStatus === 'processing' ? '#fff' : '#495057', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              ⏳ กำลังดำเนินการ
            </button>
            <button
              onClick={() => setSelectedFilterStatus('completed')}
              style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: selectedFilterStatus === 'completed' ? '#1b4332' : '#f8f9fa', color: selectedFilterStatus === 'completed' ? '#fff' : '#495057', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              ✅ ส่งมอบสำเร็จแล้ว
            </button>
          </div>

        </div>

        {/* LIST OF TRANSACTION HISTORY (รายการประวัติธุรกรรมที่ดึงจาก deals.json) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '28px', border: '1px solid #e9ecef', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ borderBottom: '2px solid #e9c46a', paddingBottom: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', color: '#1b4332', fontWeight: '800', margin: 0 }}>
              รายการประวัติธุรกรรมส่งออก ({filteredDeals.length} ดีล)
            </h3>
            <Link href="/workspace" style={{ color: '#1b4332', fontSize: '13.5px', fontWeight: '700', textDecoration: 'none' }}>
              ไปยังหน้าติดตามดีลปัจจุบัน (Workspace) ➔
            </Link>
          </div>

          {filteredDeals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#6c757d', fontSize: '14.5px' }}>
              ไม่พบรายการประวัติธุรกรรมที่ตรงกับคำค้นหาในไฟล์ `deals.json`
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredDeals.map((item, index) => {
                const uploadedCount = (item.documents || []).filter(d => d.uploaded).length;

                return (
                  <div
                    key={item.dealId || index}
                    style={{
                      padding: '22px',
                      borderRadius: '12px',
                      border: '1px solid #e9ecef',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#1b4332', color: '#ffffff', padding: '4px 10px', borderRadius: '6px' }}>
                          {item.dealId}
                        </span>
                        <span style={{ fontSize: '17px', fontWeight: '800', color: '#1b4332' }}>
                          📦 {item.productName || 'ไม่ระบุสินค้า'}
                        </span>
                        <span style={{ fontSize: '13.5px', color: '#2d6a4f', fontWeight: '700' }}>
                          ➔ ✈️ {item.destination || 'ไม่ระบุปลายทาง'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '24px', fontSize: '13.5px', color: '#495057', marginTop: '10px' }}>
                        <div>ผู้ส่งออก: <strong style={{ color: '#1b4332' }}>{item.companyName || '-'}</strong></div>
                        <div>ผู้ซื้อ: <strong style={{ color: '#1b4332' }}>{item.buyer || '-'}</strong></div>
                        <div>ปริมาณ: <strong>{item.quantity || '-'}</strong></div>
                        <div>มูลค่ารวม: <strong style={{ color: '#2d6a4f' }}>{item.price || '-'}</strong></div>
                        <div>Incoterms: <strong>{item.incotermCode || '-'}</strong></div>
                      </div>

                      <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#6c757d', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span>📁 ไฟล์เอกสารแนบในระบบ: <strong style={{ color: '#1b4332' }}>{uploadedCount} / {item.documents?.length || 5} ไฟล์</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '800', padding: '5px 14px', borderRadius: '20px', backgroundColor: item.currentStep === 5 ? '#d8f3dc' : '#fff3cd', color: item.currentStep === 5 ? '#1b4332' : '#856404' }}>
                        {item.currentStep === 5 ? '✅ ส่งมอบสำเร็จแล้ว' : `⏳ ขั้นตอน Step 0${item.currentStep || 1}`}
                      </span>

                      <button
                        onClick={() => setSelectedDealForModal(item)}
                        style={{ padding: '9px 18px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
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

        {/* MODAL (ดูรายละเอียดเอกสารสัญญาของรอบธุรกรรม) */}
        {selectedDealForModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', width: '650px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e9c46a', paddingBottom: '12px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1b4332', fontSize: '20px', fontWeight: '800' }}>
                  📜 รายละเอียดธุรกรรม {selectedDealForModal.dealId}
                </h3>
                <button onClick={() => setSelectedDealForModal(null)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#1b4332' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', fontSize: '14px', marginBottom: '24px', backgroundColor: '#f4f9f5', padding: '16px', borderRadius: '10px' }}>
                <div>สินค้า: <strong>{selectedDealForModal.productName}</strong></div>
                <div>ปลายทาง: <strong>{selectedDealForModal.destination}</strong></div>
                <div>ผู้ส่งออก: <strong>{selectedDealForModal.companyName}</strong></div>
                <div>ผู้ซื้อ: <strong>{selectedDealForModal.buyer}</strong></div>
                <div>ปริมาณ: <strong>{selectedDealForModal.quantity}</strong></div>
                <div>ราคา: <strong style={{ color: '#2d6a4f' }}>{selectedDealForModal.price}</strong></div>
                <div>Incoterms: <strong>{selectedDealForModal.incoterm}</strong></div>
                <div>กำหนดส่งมอบ: <strong>{selectedDealForModal.deliveryTarget || '-'}</strong></div>
              </div>

              <h4 style={{ fontSize: '15px', color: '#1b4332', fontWeight: '800', marginBottom: '12px' }}>
                📁 เอกสารสัญญาในระบบธุรกรรมนี้:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {(selectedDealForModal.documents || []).map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1b4332' }}>
                      {doc.name}
                    </div>
                    {doc.uploaded ? (
                      <a href={doc.fileUrl} download={doc.fileName} style={{ padding: '6px 14px', backgroundColor: '#1b4332', color: '#fff', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}>
                        📥 ดาวน์โหลดไฟล์
                      </a>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#adb5bd' }}>⚪ ยังไม่ได้อัปโหลด</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right' }}>
                <button onClick={() => setSelectedDealForModal(null)} style={{ padding: '10px 24px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '13.5px', cursor: 'pointer' }}>
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