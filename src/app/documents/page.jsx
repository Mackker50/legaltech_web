'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function DocumentsPage() {
  const [deals, setDeals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State ระบบกรองข้อมูล
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. ดึงข้อมูล User
      const resUser = await fetch('/api/users', { cache: 'no-store' });
      const userData = await resUser.json();
      if (userData.success) {
        setCurrentUser(userData.currentUser || userData.users?.[0]);
      }

      // 2. ดึงข้อมูล Deals จาก deals.json
      const resDeals = await fetch('/api/deals', { cache: 'no-store' });
      const dealsData = await resDeals.json();
      if (dealsData.success && Array.isArray(dealsData.deals)) {
        setDeals(dealsData.deals);
      } else {
        // Fallback ข้อมูลจำลองหากไฟล์ยังว่าง
        setDeals([
          {
            dealId: 'EXP-2026-001',
            productName: 'ทุเรียนหมอนทองสด',
            buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
            destination: 'จีน (Shanghai Port)',
            price: '4,500,000 บาท',
            docType: 'CONTRACT',
            docTitle: 'สัญญาซื้อขายส่งออก (Sales Contract)',
            status: 'COMPLETED',
            date: '2026-11-10'
          },
          {
            dealId: 'EXP-2026-001',
            productName: 'ทุเรียนหมอนทองสด',
            buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
            destination: 'จีน (Shanghai Port)',
            price: '4,500,000 บาท',
            docType: 'INVOICE',
            docTitle: 'ใบกำกับสินค้าส่งออก (Commercial Invoice)',
            status: 'COMPLETED',
            date: '2026-11-10'
          },
          {
            dealId: 'EXP-2026-001',
            productName: 'ทุเรียนหมอนทองสด',
            buyer: 'Shanghai Fresh Global Fruit Co., Ltd.',
            destination: 'จีน (Shanghai Port)',
            price: '4,500,000 บาท',
            docType: 'PHYTO',
            docTitle: 'ใบรับรองสุขอนามัยพืช (Phytosanitary Certificate)',
            status: 'PENDING',
            date: '2026-11-11'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  // ตรวจสอบและกรองข้อมูล
  const filteredDocuments = deals.filter((item) => {
    const pName = (item.productName || '').toLowerCase();
    const bName = (item.buyer || '').toLowerCase();
    const dId = (item.dealId || '').toLowerCase();
    const title = (item.docTitle || item.name || '').toLowerCase();
    const q = searchQuery.trim().toLowerCase();

    const matchesSearch = !q || pName.includes(q) || bName.includes(q) || dId.includes(q) || title.includes(q);
    const itemType = (item.docType || item.code || 'CONTRACT').toUpperCase();
    const matchesCategory = selectedCategory === 'ALL' || itemType === selectedCategory;
    const itemStatus = (item.status || (item.uploaded ? 'COMPLETED' : 'PENDING')).toUpperCase();
    const matchesStatus = selectedStatus === 'ALL' || itemStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '92vh', padding: '36px 32px 80px 32px', fontFamily: "'Prompt', sans-serif" }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>

        {/* ส่วนหัวหน้า */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#2d6a4f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
            Document Management Center
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1b4332', margin: 0 }}>
            📂 คลังเอกสารและสัญญาการค้าเกษตร
          </h1>
        </div>

        {/* แถบระบบกรองข้อมูล (Filter Toolbar) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', marginBottom: '28px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '14px', alignItems: 'center' }}>
            
            {/* ช่องค้นหา */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>ค้นหาเอกสาร</label>
              <input
                type="text"
                placeholder="ค้นหารหัสดีล, สินค้า, หรือผู้ซื้อ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* กรองประเภทเอกสาร */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>ประเภทเอกสาร</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}
              >
                <option value="ALL">ทั้งหมดทุกประเภท</option>
                <option value="CONTRACT">สัญญาซื้อขาย (Contract)</option>
                <option value="INVOICE">ใบกำกับสินค้า (Invoice)</option>
                <option value="PHYTO">ใบรับรองสุขอนามัยพืช (Phyto)</option>
                <option value="BL">ใบตราส่งทางเรือ (B/L)</option>
              </select>
            </div>

            {/* กรองสถานะ */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '4px' }}>สถานะเอกสาร</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', backgroundColor: '#fff', cursor: 'pointer', outline: 'none' }}
              >
                <option value="ALL">ทุกสถานะ</option>
                <option value="COMPLETED">อนุมัติ / พร้อมพิมพ์</option>
                <option value="PENDING">รอดำเนินการ / ตรวจสอบ</option>
              </select>
            </div>

            {/* ปุ่มล้างตัวกรอง */}
            <div style={{ paddingTop: '18px' }}>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setSelectedStatus('ALL'); }}
                style={{ padding: '10px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: '700', color: '#475569', cursor: 'pointer' }}
              >
                ล้างตัวกรอง
              </button>
            </div>

          </div>

          <div style={{ marginTop: '14px', fontSize: '12.5px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <span>พบเอกสารทั้งหมด <strong>{filteredDocuments.length}</strong> ฉบับ</span>
            <span>ผู้ส่งออก: <strong style={{ color: '#1b4332' }}>{currentUser?.name || 'ฐิติพงศ์ ลีลาจิรวัฒน์'}</strong></span>
          </div>
        </div>

        {/* ตารางแสดงผลรายการเอกสาร */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '12.5px' }}>
                <th style={{ padding: '14px 20px' }}>รหัสดีล & วันที่</th>
                <th style={{ padding: '14px 20px' }}>ชื่อเอกสาร</th>
                <th style={{ padding: '14px 20px' }}>สินค้า / ปลายทาง</th>
                <th style={{ padding: '14px 20px' }}>ผู้ซื้อ (Buyer)</th>
                <th style={{ padding: '14px 20px' }}>สถานะ</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    ❌ ไม่พบเอกสารที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc, idx) => {
                  const isDone = doc.status === 'COMPLETED' || doc.uploaded;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: '800', color: '#1b4332' }}>{doc.dealId || 'EXP-2026-001'}</div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{doc.date || '2026-11-10'}</div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: '700', color: '#334155' }}>{doc.docTitle || doc.name || 'เอกสารส่งออก'}</div>
                        <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#64748b' }}>
                          {doc.docType || doc.code || 'DOC'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontWeight: '600' }}>{doc.productName || 'ทุเรียนหมอนทองสด'}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{doc.destination || 'จีน'}</div>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#475569' }}>
                        {doc.buyer || 'Shanghai Fresh Import'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          backgroundColor: isDone ? '#d8f3dc' : '#fef9c3',
                          color: isDone ? '#1b4332' : '#854d0e'
                        }}>
                          {isDone ? '✓ พร้อมใช้งาน' : '⏳ รอดำเนินการ'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={handlePrint}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#1b4332',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          🖨️ พิมพ์ / PDF
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
}