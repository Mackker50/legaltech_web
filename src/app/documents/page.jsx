'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

export default function DocumentsPage() {
  const context = useAppContext() || {};
  const { lang } = context;
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { id: 'DOC-2026-001', name: 'สัญญาซื้อขายทุเรียนสด (Sales Contract)', type: 'PDF', date: '2026-11-01', status: 'สมบูรณ์' },
    { id: 'DOC-2026-002', name: 'ใบรับรองสุขอนามัยพืช (Phytosanitary Cert)', type: 'PDF', date: '2026-11-05', status: 'รออนุมัติ' },
    { id: 'DOC-2026-003', name: 'หนังสือรับรองถิ่นกำเนิดสินค้า (Form E)', type: 'PDF', date: '2026-11-08', status: 'สมบูรณ์' },
    { id: 'DOC-2026-004', name: 'ใบกำกับสินค้าส่งออก (Commercial Invoice)', type: 'DOCX', date: '2026-11-09', status: 'ฉบับร่าง' },
  ];

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '90vh', padding: '40px 20px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Page Header Banner */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '10px', borderLeft: '6px solid #1b4332', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', color: '#1b4332', fontWeight: '800', margin: '0 0 8px 0' }}>
            {lang === 'en' ? '📁 Document Repository' : '📁 คลังเอกสารการส่งออกและสัญญาดิจิทัล'}
          </h1>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '14.5px' }}>
            {lang === 'en' ? 'Manage and store export compliance documents.' : 'ระบบจัดเก็บ ดึงข้อมูล และจัดการเอกสารทางกฎหมายและศุลกากรย้อนหลัง'}
          </p>
        </div>

        {/* Search & Action Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input 
            type="text"
            placeholder={lang === 'en' ? 'Search documents or IDs...' : 'ค้นหาเอกสาร หรือรหัสสัญญา...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', backgroundColor: '#ffffff', fontSize: '14px', outline: 'none' }}
          />
          <Link href="/documents/auto-fill" style={{ padding: '12px 20px', backgroundColor: '#1b4332', color: '#ffffff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📝</span> {lang === 'en' ? 'Smart Auto-Fill' : 'ช่วยกรอกฟอร์มอัตโนมัติ'}
          </Link>
        </div>

        {/* Document Table Container */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e9ecef', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#1b4332', color: '#ffffff' }}>
                <th style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600' }}>รหัสเอกสาร</th>
                <th style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600' }}>ชื่อเอกสาร</th>
                <th style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600' }}>ประเภท</th>
                <th style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600' }}>วันที่สร้าง</th>
                <th style={{ padding: '14px 18px', fontSize: '14px', fontWeight: '600' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #e9ecef', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                  <td style={{ padding: '14px 18px', color: '#1b4332', fontWeight: '700', fontSize: '13.5px' }}>{doc.id}</td>
                  <td style={{ padding: '14px 18px', color: '#212529', fontSize: '14px', fontWeight: '500' }}>{doc.name}</td>
                  <td style={{ padding: '14px 18px', color: '#6c757d', fontSize: '13px' }}>{doc.type}</td>
                  <td style={{ padding: '14px 18px', color: '#6c757d', fontSize: '13px' }}>{doc.date}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '12px', 
                      fontWeight: '600',
                      backgroundColor: doc.status === 'สมบูรณ์' ? '#d8f3dc' : doc.status === 'รออนุมัติ' ? '#fefae0' : '#e9ecef',
                      color: doc.status === 'สมบูรณ์' ? '#1b4332' : doc.status === 'รออนุมัติ' ? '#bc6c25' : '#495057'
                    }}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}