'use client';

export const dynamic = 'force-dynamic';

import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function WorkspacePage() {
  const context = useAppContext() || {};
  const { theme, lang, user } = context;

  const currentTheme = theme || {
    cardBg: '#ffffff',
    textMain: '#1d1d1f',
    textSub: '#86868b',
    border: '#d2d2d7',
    link: '#0071e3',
    shadow: '0 4px 12px rgba(0,0,0,0.05)',
  };

  const role = user?.role || 'EXPORTER';

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: currentTheme.textMain }}>
          {lang === 'en' ? '🖥️ Workspace Dashboard' : '🖥️ ศูนย์ปฏิบัติการ AgriLegal'}
        </h1>
        <p style={{ color: currentTheme.textSub }}>
          {lang === 'en' ? `Welcome, ${user?.name || 'Guest'} (${role})` : `ยินดีต้อนรับคุณ ${user?.name || 'ผู้ใช้งาน'} (สถานะ: ${role})`}
        </p>
      </div>

      {/* Role-Based Dynamic Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {(role === 'EXPORTER' || role === 'BUYER') && (
          <Link href="/documents" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: currentTheme.cardBg, padding: '24px', borderRadius: '18px', border: `1px solid ${currentTheme.border}`, boxShadow: currentTheme.shadow, height: '100%' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
              <h3 style={{ color: currentTheme.textMain, margin: '0 0 8px 0' }}>คลังเอกสาร & สัญญา</h3>
              <p style={{ color: currentTheme.textSub, fontSize: '14px', margin: 0 }}>จัดการสัญญาซื้อขายและเอกสารศุลกากรย้อนหลัง</p>
            </div>
          </Link>
        )}

        {(role === 'EXPORTER' || role === 'FARMER') && (
          <Link href="/certificates" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: currentTheme.cardBg, padding: '24px', borderRadius: '18px', border: `1px solid ${currentTheme.border}`, boxShadow: currentTheme.shadow, height: '100%' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📜</div>
              <h3 style={{ color: currentTheme.textMain, margin: '0 0 8px 0' }}>ระบบขอใบรับรอง</h3>
              <p style={{ color: currentTheme.textSub, fontSize: '14px', margin: 0 }}>ยื่นขอ Phytosanitary Certificate และหนังสือรับรองถิ่นกำเนิด</p>
            </div>
          </Link>
        )}

        {role === 'EXPORTER' && (
          <Link href="/hs-classifier" style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: currentTheme.cardBg, padding: '24px', borderRadius: '18px', border: `1px solid ${currentTheme.border}`, boxShadow: currentTheme.shadow, height: '100%' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ color: currentTheme.textMain, margin: '0 0 8px 0' }}>HS Code & ภาษีศุลกากร</h3>
              <p style={{ color: currentTheme.textSub, fontSize: '14px', margin: 0 }}>วิเคราะห์พิกัดอัตราศุลกากรสินค้าเกษตรส่งออก</p>
            </div>
          </Link>
        )}

        <Link href="/supply-chain" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: currentTheme.cardBg, padding: '24px', borderRadius: '18px', border: `1px solid ${currentTheme.border}`, boxShadow: currentTheme.shadow, height: '100%' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚢</div>
            <h3 style={{ color: currentTheme.textMain, margin: '0 0 8px 0' }}>ติดตาม Supply Chain</h3>
            <p style={{ color: currentTheme.textSub, fontSize: '14px', margin: 0 }}>เช็กสถานะตู้สินค้าและการเดินทางจากสวนถึงท่าเรือปลายทาง</p>
          </div>
        </Link>
      </div>
    </div>
  );
}