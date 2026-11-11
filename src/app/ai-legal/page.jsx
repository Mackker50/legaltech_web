'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function AILegalPage() {
  const context = useAppContext() || {};
  const { lang } = context;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: 'system',
      text: lang === 'en'
       ? '🌱 Welcome to ExportSure Compliance Advisor. Focus countries: China, USA, Japan, Malaysia, and India.'
      : '🌱 ยินดีต้อนรับสู่ระบบให้คำปรึกษากฎหมายและข้อกำหนดการส่งออกอัตโนมัติ (ExportSure Specialist)\n\nระบบรองรับการตรวจสอบข้อกำหนดส่งออก 5 ประเทศหลัก: จีน (CN), สหรัฐอเมริกา (US), ญี่ปุ่น (JP), มาเลเซีย (MY), และอินเดีย (IN)'
    }
  ]);

  // Fallback Rules สำหรับ 5 ประเทศ + ปัญหาสัญญาหลายฝ่าย
  const fallbackRules = [
    {
      keywords: ['จีน', 'china', 'gacc', 'decree 248', 'form e'],
      response: '🇨🇳 **ข้อกำหนดส่งออกไปจีน (GACC):**\n' +
        '1. **การขึ้นทะเบียน:** ต้องมีรหัสสวน GAP และโรงคัดบรรจุ GMP ที่ขึ้นทะเบียน GACC (Decree 248/249)\n' +
        '2. **ศัตรูพืชกักกันเด็ดขาด:** ห้ามพบเพลี้ยแป้ง (Planococcus minor), หนอนเจาะผลทุเรียน, และแมลงวันผลไม้\n' +
        '3. **สารตกค้าง:** โลหะหนักแคดเมียมต้องไม่เกิน 0.05 mg/kg\n' +
        '4. **สิทธิประโยชน์และเอกสาร:** ใช้ Form E (ACFTA ภาษี 0%), ใบรับรอง พ.ก. 7, Invoice และ B/L'
    },
    {
      keywords: ['สหรัฐ', 'usa', 'us', 'fda', 'อเมริกา'],
      response: '🇺🇸 **ข้อกำหนดส่งออกไปสหรัฐอเมริกา (US FDA & USDA):**\n' +
        '1. **ทะเบียนและการแจ้งล่วงหน้า:** ต้องมี FDA Food Facility Registration และยื่นแจ้ง Prior Notice (PN Number)\n' +
        '2. **การรมยา:** สินค้ากลุ่มเมล็ดพืช/ข้าว ต้องมี Fumigation Certificate ป้องกันมอดแมลง\n' +
        '3. **ความปลอดภัยทางอาหาร:** สารพิษอะฟลาท็อกซินต้องไม่เกิน 20 ppb ตามกฎหมาย FSMA'
    },
    {
      keywords: ['ญี่ปุ่น', 'japan', 'maff', 'vht', 'มะม่วง'],
      response: '🇯🇵 **ข้อกำหนดส่งออกไปญี่ปุ่น (MAFF):**\n' +
        '1. **การกำจัดแมลงวันผลไม้:** มะม่วงสดต้องผ่านการอบไอน้ำ (VHT) อุณหภูมิเนื้อผล 46.8°C นาน 10 นาที โดยมีผู้ตรวจ MAFF และ DOA ร่วมกำกับ\n' +
        '2. **สารเคมีตกค้าง:** ใช้เกณฑ์ Positive List System (เพดาน 0.01 ppm)\n' +
        '3. **เอกสารจำเป็น:** Phytosanitary Certificate สลักหลัง VHT และ Form JTEPA/RCEP'
    },
    {
      keywords: ['มาเลเซีย', 'malaysia', 'my', 'maqis', 'form d'],
      response: '🇲🇾 **ข้อกำหนดส่งออกไปมาเลเซีย (DOA Malaysia & MAQIS):**\n' +
        '1. **ใบอนุญาตนำเข้า:** ผู้นำเข้าต้องขอ MAQIS Import Permit ล่วงหน้าผ่านระบบ DagangNet\n' +
        '2. **การตรวจร่วมด่านสากล:** ขนส่งทางบกผ่านด่านสะเดา/ปาดังเบซาร์ ต้องตรวจปล่อยตามด่านที่ระบุในใบอนุญาต\n' +
        '3. **สิทธิประโยชน์และเอกสาร:** ใช้ ASEAN Form D (ATIGA ภาษี 0%), ใบรับรองสุขอนามัยพืช (พ.ก. 7), และ Truck Waybill'
    },
    {
      keywords: ['อินเดีย', 'india', 'in', 'dppqs', 'fssai'],
      response: '🇮🇳 **ข้อกำหนดส่งออกไปอินเดีย (DPPQS & FSSAI):**\n' +
        '1. **ข้อกำหนดกักกันพืช (PQ Order 2003):** ผู้นำเข้าต้องขอ PQ Permit และสินค้าส่วนใหญ่ต้องผ่านการรมยา Methyl Bromide (MB)\n' +
        '2. **การรับรองความปลอดภัย:** ต้องมีใบรับรอง Non-GM Origin และใบอนุญาตจาก FSSAI\n' +
        '3. **สิทธิประโยชน์และเอกสาร:** ใช้ Form AI (AIFTA) หรือ TIFTA Form, ใบรับรอง พ.ก. 7 สลักหลังกรรมวิธีบำบัด, และ Fumigation Certificate'
    },
    {
      keywords: ['สัญญาหลายฝ่าย', 'พ่อค้าคนกลาง', 'ข้อมูลตกหล่น', 'รายได้ตกหล่น'],
      response: '📌 **การจัดการสัญญาหลายฝ่ายเพื่อป้องกันข้อมูลและรายได้ตกหล่น:**\n' +
        '1. **สัญญาซื้อขาย (Sales Contract):** กำหนด Incoterms, มาตรฐานตรวจรับสินค้า, และอนุญาโตตุลาการให้รัดกุม\n' +
        '2. **สัญญาพ่อค้าคนกลาง (Broker Agreement):** ระบุค่านายหน้า ภาระการตรวจคุณภาพหน้าสวน และเกณฑ์การหักน้ำหนักให้ชัดเจน\n' +
        '3. **สัญญารับขน (Carriage Contract):** กำหนดการควบคุมอุณหภูมิตู้ Reefer และความรับผิดชอบในเอกสาร B/L หรือ Waybill'
    }
  ];

  // Quick Prompts ปรับให้ครอบคลุม 5 ประเทศ
  const quickPrompts = [
    '🇨🇳 ข้อกำหนดส่งออกไปจีน (GACC)',
    '🇺🇸 ข้อกำหนดส่งออกไปสหรัฐอเมริกา (US FDA)',
    '🇯🇵 ข้อกำหนดส่งออกไปญี่ปุ่น (MAFF / VHT)',
    '🇲🇾 ข้อกำหนดส่งออกไปมาเลเซีย (MAQIS / Form D)',
    '🇮🇳 ข้อกำหนดส่งออกไปอินเดีย (DPPQS / FSSAI)',
    '📜 สัญญาหลายฝ่าย และป้องกันข้อมูลตกหล่น'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { sender: 'system', text: data.reply }]);
          return;
        }
      }
      throw new Error('API reply unavailable');
    } catch (err) {
      const cleanQuery = query.toLowerCase();
      let autoReply = 'ขออภัยครับ ระบบไม่พบข้อมูลที่ตรงกับคำถามของคุณโดยตรง กรุณาสอบถามเกี่ยวกับ 5 ประเทศหลัก: จีน, สหรัฐอเมริกา, ญี่ปุ่น, มาเลเซีย, อินเดีย หรือ สัญญาหลายฝ่ายครับ';

      for (const rule of fallbackRules) {
        if (rule.keywords.some((kw) => cleanQuery.includes(kw))) {
          autoReply = rule.response;
          break;
        }
      }

      setMessages((prev) => [...prev, { sender: 'system', text: autoReply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '90vh', padding: '36px 20px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Banner Header */}
        <div style={{ backgroundColor: '#ffffff', padding: '24px 28px', borderRadius: '12px', borderLeft: '6px solid #1b4332', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '20px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#e9f5ed', color: '#1b4332', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
            AGRILEGAL COMPLIANCE SPECIALIST
          </div>
          <h1 style={{ fontSize: '24px', color: '#1b4332', fontWeight: '800', margin: '0 0 6px 0' }}>
            ⚖️ {lang === 'en' ? 'Export Legal & Protocol Advisor' : 'ระบบตรวจเช็กข้อกำหนดกฎหมายการส่งออกอัตโนมัติ'}
          </h1>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '13.5px' }}>
            {lang === 'en'
              ? 'Automated legal compliance checking for China, USA, Japan, Malaysia, and India.'
              : 'ตรวจเช็กข้อกำหนดศุลกากร มาตรการ SPS พิธีสารนำเข้า 5 ประเทศ (จีน, สหรัฐฯ, ญี่ปุ่น, มาเลเซีย, อินเดีย) และความเสี่ยงสัญญาหลายฝ่าย'}
          </p>
        </div>

        {/* แถบคำถามด่วน (Quick Prompts) */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
          {quickPrompts.map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(promptText)}
              disabled={loading}
              style={{
                whiteSpace: 'nowrap',
                padding: '7px 14px',
                borderRadius: '20px',
                border: '1px solid #ced4da',
                backgroundColor: '#ffffff',
                color: '#1b4332',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e9f5ed'; e.currentTarget.style.borderColor = '#1b4332'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#ced4da'; }}
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e9ecef', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', height: '560px' }}>
          
          {/* Messages Display */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fdfdfd' }}>
            {messages.map((m, idx) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    backgroundColor: isUser ? '#1b4332' : '#ffffff',
                    color: isUser ? '#ffffff' : '#212529',
                    padding: '14px 18px',
                    borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    fontSize: '13.5px',
                    lineHeight: '1.65',
                    whiteSpace: 'pre-line',
                    border: isUser ? 'none' : '1px solid #e9ecef',
                    borderLeft: !isUser ? '4px solid #e9c46a' : 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  {m.text}
                </div>
              );
            })}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#ffffff',
                  color: '#6c757d',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  border: '1px solid #e9ecef',
                  borderLeft: '4px solid #e9c46a'
                }}
              >
                ⏳ กำลังค้นหาข้อกำหนดและกฎหมายจาก info.json...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', padding: '16px', backgroundColor: '#ffffff', borderTop: '1px solid #e9ecef', gap: '12px' }}
          >
            <input
              type="text"
              placeholder="สอบถามข้อกำหนด เช่น ส่งออกไปจีน, มาเลเซีย MAQIS, อินเดีย DPPQS, สหรัฐ FDA, สัญญาหลายฝ่าย..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 26px',
                backgroundColor: '#1b4332',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
                boxShadow: '0 4px 12px rgba(27,67,50,0.18)'
              }}
            >
              {loading ? 'กำลังค้นหา...' : 'ส่งคำถาม ➔'}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}