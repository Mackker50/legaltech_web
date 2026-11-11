'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function AILegalPage() {
  const context = useAppContext() || {};
  const { lang } = context;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'system',
      text: '🌱 ยินดีต้อนรับสู่ระบบให้คำปรึกษากฎหมายและข้อกำหนดการส่งออกอัตโนมัติ (Rule-Based Legal Specialist) กรุณาพิมพ์คำถามหรือหัวข้อที่คุณต้องการตรวจสอบ เช่น สัญญา, ใบรับรอง, HS Code, ภาษี หรือ มาตรการส่งออก'
    }
  ]);

  // คลังกฎและคำตอบที่เตรียมไว้ล่วงหน้า (Non-AI Rule-Based Database)
  const knowledgeRules = [
    {
      keywords: ['สัญญา', 'contract', 'ข้อตกลง', 'sales contract'],
      response: '📌 **ข้อกำหนดด้านสัญญาซื้อขายสินค้าเกษตร (Sales Contract):**\n1. ควรกำหนดเงื่อนไขการส่งมอบ (Incoterms 2020) เช่น FOB หรือ CIF ให้ชัดเจน\n2. ต้องระบุมาตรฐานชั้นคุณภาพสินค้า ความชื้น และเกณฑ์การตรวจรับสินค้า ณ ท่าเรือปลายทาง\n3. เพิ่มข้อกำหนด Force Majeure ที่ครอบคลุมถึงการระบาดของโรคพืช หรือการเปลี่ยนแปลงมาตรการกักกันพืชของรัฐบาลปลายทาง'
    },
    {
      keywords: ['ใบรับรอง', 'สุขอนามัยพืช', 'phyto', 'phytosanitary', 'doa', 'กรมวิชาการเกษตร'],
      response: '📜 **การขอใบรับรองสุขอนามัยพืช (Phytosanitary Certificate - DOA):**\n1. สินค้าเกษตรสดต้องได้รับการรับรองแปลงปลูก GAP และโรงคัดบรรจุ GMP/GACP\n2. ต้องผ่านการตรวจสุ่มตัวอย่างศัตรูพืชและสารตกค้างตามมาตรฐานประเทศคู่ค้า\n3. ยื่นคำขอผ่านระบบ e-Phyto ของกรมวิชาการเกษตรล่วงหน้าอย่างน้อย 3-5 วันทำการ'
    },
    {
      keywords: ['hs code', 'พิกัด', 'ภาษี', 'fta', 'form e', 'ศุลกากร'],
      response: '🔍 **สิทธิประโยชน์ภาษีศุลกากรและ HS Code:**\n1. สินค้าเกษตรไทยส่วนใหญ่ได้รับสิทธิยกเว้นภาษี (0%) ภายใต้ FTA เช่น ASEAN-China FTA (Form E), JTEPA\n2. ต้องตรวจสอบว่าสินค้าแปรรูปหรือสดตรงตามข้อกำหนดถิ่นกำเนิดสินค้า (Rules of Origin - ROO)\n3. ยื่นขอ Form E จากกรมการค้าต่างประเทศเพื่อนำไปลดหย่อนภาษี ณ ประเทศปลายทาง'
    },
    {
      keywords: ['ขนส่ง', 'supply chain', 'ตู้คอนเทนเนอร์', 'ความเย็น', 'reefer', 'ติดตาม'],
      response: '🚢 **มาตรการขนส่งและควบคุมอุณหภูมิ (Reefer Container):**\n1. สินค้าประเภทผลไม้สดต้องมีการทำ Pre-cooling อุณหภูมิตามที่กำหนดก่อนบรรจุตู้\n2. มีการติดตั้งอุปกรณ์บันทึกอุณหภูมิ (Data Logger) ตลอดการเดินทางเพื่อยืนยัน Cold Chain Protocol\n3. สามารถติดตามสถานะการเดินทางของตู้สินค้าได้ในระบบผ่านเมนู "ติดตาม Supply Chain"'
    },
    {
      keywords: ['สวัสดี', 'สวัสดีครับ', 'สวัสดีค่ะ', 'hello', 'hi'],
      response: '🌱 สวัสดีครับ ระบบพร้อมให้บริการข้อมูลกฎหมายและมาตรการส่งออกสินค้าเกษตร คุณสามารถพิมพ์คำค้นหาที่ต้องการสอบถามได้เลยครับ'
    }
  ];

  const defaultResponse = 'ขออภัยครับ ระบบไม่พบข้อมูลที่ตรงกับคำถามของคุณ กรุณาพิมพ์คำค้นหาเพิ่มเติม เช่น "สัญญา", "ใบรับรอง", "HS Code" หรือ "ขนส่ง" หรือติดต่อเจ้าหน้าที่ผ่านสายด่วน HOTLINE: 02-XXX-XXXX ครับ';

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userQuery }];
    setMessages(newMessages);
    setInput('');

    // ค้นหาคำตอบแบบ Rule-Based (Matching)
    const cleanQuery = userQuery.toLowerCase();
    let autoReply = defaultResponse;

    for (const rule of knowledgeRules) {
      const match = rule.keywords.some(kw => cleanQuery.includes(kw));
      if (match) {
        autoReply = rule.response;
        break;
      }
    }

    // ตอบกลับทันที (Low Latency)
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'system', text: autoReply }]);
    }, 300);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '90vh', padding: '40px 20px', fontFamily: "'Prompt', 'Sarabun', sans-serif" }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Banner Header */}
        <div style={{ backgroundColor: '#ffffff', padding: '28px', borderRadius: '10px', borderLeft: '6px solid #1b4332', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#fefae0', color: '#bc6c25', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', marginBottom: '8px', border: '1px solid #dda15e' }}>
            NON-AI RULE-BASED LEGAL ADVISORY
          </div>
          <h1 style={{ fontSize: '26px', color: '#1b4332', fontWeight: '800', margin: '0 0 8px 0' }}>
            ⚖️ {lang === 'en' ? 'Legal Specialist (Rule-Based)' : 'ระบบตรวจเช็กข้อกำหนดกฎหมายการส่งออกอัตโนมัติ'}
          </h1>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '14.5px' }}>
            {lang === 'en' ? 'Automated compliance rule-checking for agricultural export.' : 'ค้นหาข้อกำหนดทางกฎหมาย มาตรการศุลกากร และแนวปฏิบัติการส่งออกสินค้าเกษตรตามกฎที่กำหนดไว้แม่นยำ 100%'}
          </p>
        </div>

        {/* Chat / Query Area */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e9ecef', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', height: '520px' }}>
          
          {/* Messages Display */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fdfdfd' }}>
            {messages.map((m, idx) => (
              <div 
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  backgroundColor: m.sender === 'user' ? '#1b4332' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#212529',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line',
                  border: m.sender === 'user' ? 'none' : '1px solid #e9ecef',
                  borderLeft: m.sender === 'system' ? '4px solid #e9c46a' : 'none',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input Form Bar */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', padding: '16px', backgroundColor: '#ffffff', borderTop: '1px solid #e9ecef', gap: '12px' }}>
            <input 
              type="text"
              placeholder="สอบถามข้อกำหนด เช่น สัญญา, Phytosanitary, Form E, HS Code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '12px 28px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(27,67,50,0.2)' }}>
              ค้นหาข้อมูล
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}