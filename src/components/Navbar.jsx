'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout } = useAppContext();

  const navLinks = [
    { href: '/workspace', label: '🌿 Workspace' },
    { href: '/status', label: '📊 ติดตามสถานะ' },
    { href: '/auto-fill', label: '📝 เตรียมเอกสาร (Auto-Fill)' },
    { href: '/ai-legal', label: '⚖️ AI กฎหมาย 5 ประเทศ' }
  ];

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 24px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>

        {/* 1. โลโก้และชื่อแบรนด์ ExportSure */}
        <Link 
          href="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            textDecoration: 'none' 
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#1b4332',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: '800'
          }}>
            🛡️
          </div>
          <div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              color: '#1b4332', 
              letterSpacing: '-0.5px',
              lineHeight: '1.1'
            }}>
              ExportSure
            </div>
            <div style={{ fontSize: '10.5px', color: '#2d6a4f', fontWeight: '700' }}>
              AGRICULTURAL EXPORT LEGALTECH
            </div>
          </div>
        </Link>

        {/* 2. รายการเมนูนำทาง (Navigation Links) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? '800' : '600',
                  color: isActive ? '#1b4332' : '#475569',
                  backgroundColor: isActive ? '#e9f5ed' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. ส่วนข้อมูลผู้ใช้งานด้านขวา */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12.5px', fontWeight: '800', color: '#1b4332' }}>
              {currentUser?.name || 'ฐิติพงศ์ ลีลาจิรวัฒน์'}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {currentUser?.company || 'กลุ่มเกษตรกรแปลงใหญ่'}
            </div>
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#e9f5ed',
            color: '#1b4332',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '800',
            border: '1.5px solid #b7e4c7'
          }}>
            👤
          </div>
        </div>

      </div>
    </header>
  );
}