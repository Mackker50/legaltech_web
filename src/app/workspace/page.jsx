'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WorkspacePage() {
  const [userRole, setUserRole] = useState('EXPORTER');
  const [formData, setFormData] = useState({
    product: 'ทุเรียนหมอนทองสด (Fresh Durian)',
    quantity: '25,000 กิโลกรัม',
    price: '4,500,000 บาท',
    buyer: 'Shanghai Fresh Import Co., Ltd.',
    destination: 'จีน (ท่าเรือ Shanghai)',
    incoterm: 'CIF',
    deliveryDate: '2026-11-20',
  });

  const [activeDeals, setActiveDeals] = useState([
    {
      id: 'EXP-2026-001',
      product: 'ทุเรียนหมอนทองสด',
      quantity: '25,000 กิโลกรัม',
      price: '4,500,000 บาท',
      destination: 'จีน (Shanghai)',
      incoterm: 'CIF',
      status: 'กำลังเตรียมเอกสาร',
      stakeholders: ['ผู้ส่งออก', 'พ่อค้าคนกลาง', 'กลุ่มเกษตรกรจันทบุรี', 'Global Logistics'],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleCreateDeal = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newDeal = {
        id: `EXP-2026-00${activeDeals.length + 1}`,
        product: formData.product,
        quantity: formData.quantity,
        price: formData.price,
        destination: formData.destination,
        incoterm: formData.incoterm,
        status: 'สร้างรายการใหม่เรียบร้อย',
        stakeholders: ['ผู้ส่งออก', 'คู่สัญญาหลัก'],
      };

      setActiveDeals([newDeal, ...activeDeals]);
      setIsSubmitting(false);
      setNotice('✅ สร้างรายการธุรกรรมส่งออกสำเร็จ!');
    }, 800);
  };

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.02em', color: '#1d1d1f', margin: '0 0 6px 0' }}>
            Export Transaction Workspace
          </h1>
          <p style={{ fontSize: '15px', color: '#86868b', margin: 0 }}>
            บันทึกรายละเอียดดีล เงื่อนไขการค้า (Trade Terms) และบริหารผู้เกี่ยวข้อง
          </p>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#86868b' }}>สวมบทบาท:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={{ border: 'none', backgroundColor: 'transparent', fontSize: '13px', fontWeight: '600', color: '#1d1d1f', outline: 'none', cursor: 'pointer' }}
          >
            <option value="EXPORTER">👨‍🌾 ผู้ส่งออก (Exporter)</option>
            <option value="MIDDLEMAN">🤝 พ่อค้าคนกลาง (Middleman)</option>
            <option value="FARMER">🧑‍🌾 เกษตรกร (Farmer)</option>
            <option value="FREIGHT_FORWARDER">🚢 บริษัทขนส่ง (Forwarder)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#1d1d1f' }}>
            สร้างรายการธุรกรรมส่งออกใหม่
          </h2>

          <form onSubmit={handleCreateDeal} style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '4px' }}>สินค้าเกษตร:</label>
              <input
                type="text"
                required
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '4px' }}>ปริมาณ:</label>
                <input
                  type="text"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '4px' }}>Incoterms ที่ใช้:</label>
                <select
                  value={formData.incoterm}
                  onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box', backgroundColor: '#fff' }}
                >
                  <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  <option value="FOB">FOB (Free on Board)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '4px' }}>ประเทศปลายทาง & ท่าเรือ:</label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#86868b', marginBottom: '4px' }}>มูลค่ารวมการค้า ( Commercial Price ):</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d2d2d7', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', color: '#86868b', marginTop: '2px', display: 'block' }}>
                🔒 ข้อมูลมูลค่าราคาจะถูกซ่อนจากเกษตรกรและบริษัทขนส่งตามสิทธิ์ Data Privacy
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: '#0071e3',
                color: '#fff',
                border: 'none',
                borderRadius: '980px',
                padding: '12px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '8px',
                boxShadow: '0 4px 12px rgba(0,113,227,0.25)'
              }}
            >
              {isSubmitting ? 'กำลังบันทึกดีล...' : 'เปิด Workspace สำหรับดีลนี้'}
            </button>
          </form>

          {notice && (
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#eefbdf', color: '#297a00', fontSize: '13px', fontWeight: '500' }}>
              {notice}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(0, 0, 0, 0.04)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 16px 0', color: '#1d1d1f' }}>
              รายการดีลส่งออกที่กำลังดำเนินการ
            </h2>

            <div style={{ display: 'grid', gap: '14px' }}>
              {activeDeals.map((deal) => {
                const canSeePrice = userRole === 'EXPORTER' || userRole === 'MIDDLEMAN';

                return (
                  <div
                    key={deal.id}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: '#fafafa',
                      border: '1px solid rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#0071e3', backgroundColor: '#e8f2fc', padding: '2px 8px', borderRadius: '6px' }}>
                        {deal.id}
                      </span>
                      <span style={{ fontSize: '12px', color: '#297a00', fontWeight: '500' }}>
                        {deal.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1d1d1f', marginBottom: '4px' }}>
                      {deal.product} ({deal.quantity})
                    </div>
                    
                    <div style={{ fontSize: '13px', color: '#86868b', marginBottom: '8px' }}>
                      ปลายทาง: {deal.destination} • เงื่อนไข: <strong>{deal.incoterm}</strong>
                    </div>

                    <div style={{ fontSize: '13px', paddingTop: '8px', borderTop: '1px dashed #e5e5ea' }}>
                      {canSeePrice ? (
                        <span style={{ color: '#297a00', fontWeight: '600' }}>
                          💰 ราคาสัญญา: {deal.price}
                        </span>
                      ) : (
                        <span style={{ color: '#86868b', fontStyle: 'italic' }}>
                          🔒 [มูลค่าทางการค้าถูกซ่อนตามสิทธิ์ Data Privacy]
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                      <Link href="/status" style={{ fontSize: '12px', color: '#0071e3', textDecoration: 'none', fontWeight: '500' }}>
                        ดูสถานะส่งออก →
                      </Link>
                      <Link href="/documents" style={{ fontSize: '12px', color: '#424245', textDecoration: 'none', fontWeight: '500', marginLeft: '12px' }}>
                        แนบเอกสาร →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}