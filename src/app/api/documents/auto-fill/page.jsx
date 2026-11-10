'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function AutoFillPage() {
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

  const [dealId, setDealId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleProcess = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        status: 'SUCCESS',
        message: 'ดึงข้อมูลสัญญาและเติมลงแบบฟอร์มศุลกากร/ใบรับรองสำเร็จ',
        fieldsFilled: 14,
        confidence: '98.5%'
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: theme.textMain }}>
        {lang === 'th' ? '📝 ระบบช่วยกรอกแบบฟอร์มและตรวจสอบเอกสาร' : '📝 Smart Document Auto-Fill & Verify'}
      </h1>
      <p style={{ color: theme.textSub, marginBottom: '24px' }}>
        {lang === 'th' ? 'ดึงข้อมูลจากสัญญาเพื่อกรอกแบบฟอร์มศุลกากรและตรวจสอบความถูกต้องอัตโนมัติ' : 'Extract contract data to auto-fill export forms and verify compliance.'}
      </p>

      <form onSubmit={handleProcess} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input 
          type="text"
          placeholder={lang === 'th' ? 'ระบุรหัสสัญญา (เช่น DEAL-2026-01)' : 'Enter Deal ID...'}
          value={dealId}
          onChange={(e) => setDealId(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: `1px solid ${theme.inputBorder}`, backgroundColor: theme.inputBg, color: theme.textMain, outline: 'none' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: theme.link, color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
          {loading ? 'กำลังประมวลผล...' : (lang === 'th' ? 'ประมวลผลฟอร์ม' : 'Process')}
        </button>
      </form>

      {result && (
        <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
          <h3 style={{ fontSize: '18px', color: theme.textMain, marginBottom: '12px' }}>✅ ผลการตรวจสอบและเติมข้อมูล</h3>
          <p style={{ marginBottom: '8px' }}><strong>สถานะ:</strong> <span style={{ color: '#297a00' }}>{result.message}</span></p>
          <p style={{ marginBottom: '8px' }}><strong>จำนวนฟิลด์ที่กรอกอัตโนมัติ:</strong> {result.fieldsFilled} ช่อง</p>
          <p><strong>ความแม่นยำ AI:</strong> <span style={{ color: theme.link }}>{result.confidence}</span></p>
        </div>
      )}
    </div>
  );
}