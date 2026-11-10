'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function DocumentsPage() {
  const context = useAppContext() || {};
  const theme = context.theme || {
    textMain: '#111',
    textSub: '#666',
    cardBg: '#fff',
    border: '#e5e5ea',
    inputBorder: '#d1d1d6',
    inputBg: '#f9f9fb',
    link: '#0071e3',
    shadow: '0 4px 12px rgba(0,0,0,0.05)'
  };
  const lang = context.lang || 'th';

  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { id: 'DOC-001', name: 'สัญญาซื้อขายทุเรียนสด (Sales Contract)', type: 'PDF', date: '2026-11-01', status: 'สมบูรณ์' },
    { id: 'DOC-002', name: 'ใบรับรองสุขอนามัยพืช (Phytosanitary Cert)', type: 'PDF', date: '2026-11-05', status: 'รออนุมัติ' },
    { id: 'DOC-003', name: 'หนังสือรับรองถิ่นกำเนิดสินค้า (Form E)', type: 'PDF', date: '2026-11-08', status: 'สมบูรณ์' },
    { id: 'DOC-004', name: 'ใบกำกับสินค้า (Commercial Invoice)', type: 'DOCX', date: '2026-11-09', status: 'ฉบับร่าง' },
  ];

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: theme.textMain }}>
        {lang === 'th' ? '📁 คลังเอกสารการส่งออก' : '📁 Document Repository'}
      </h1>
      <p style={{ color: theme.textSub, marginBottom: '24px' }}>
        {lang === 'th' ? 'จัดการ ดึงข้อมูล และจัดเก็บเอกสารทางกฎหมายและศุลกากรย้อนหลัง' : 'Manage, search, and store your export compliance documents.'}
      </p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input 
          type="text"
          placeholder={lang === 'th' ? 'ค้นหาเอกสาร หรือรหัสสัญญา...' : 'Search documents or IDs...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none' }}
        />
      </div>

      <div style={{ backgroundColor: theme.cardBg, borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}`, backgroundColor: theme.inputBg }}>
              <th style={{ padding: '16px', color: theme.textMain, fontSize: '14px' }}>รหัสเอกสาร</th>
              <th style={{ padding: '16px', color: theme.textMain, fontSize: '14px' }}>ชื่อเอกสาร</th>
              <th style={{ padding: '16px', color: theme.textMain, fontSize: '14px' }}>วันที่สร้าง</th>
              <th style={{ padding: '16px', color: theme.textMain, fontSize: '14px' }}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                <td style={{ padding: '16px', color: theme.link, fontWeight: '600' }}>{doc.id}</td>
                <td style={{ padding: '16px', color: theme.textMain }}>{doc.name}</td>
                <td style={{ padding: '16px', color: theme.textSub, fontSize: '13px' }}>{doc.date}</td>
                <td style={{ padding: '16px', color: doc.status === 'สมบูรณ์' ? '#297a00' : theme.textSub }}>{doc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}