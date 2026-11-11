'use client';

import { useState } from 'react';

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '🌱 สวัสดีครับ ยินดีต้อนรับสู่ระบบตอบกลับอัตโนมัติ AgriLegal Pro มีอะไรให้ช่วยเหลือไหมครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: '❌ ไม่สามารถเชื่อมต่อระบบตอบกลับได้ในขณะนี้' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', width: '340px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #e9ecef', overflow: 'hidden', fontFamily: "'Prompt', sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1b4332', color: '#ffffff', padding: '14px 16px', fontWeight: '700', fontSize: '15px' }}>
        💬 ระบบตอบกลับอัตโนมัติ (Auto-Response)
      </div>

      {/* Message Area */}
      <div style={{ height: '280px', padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8f9fa' }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: m.sender === 'user' ? '#1b4332' : '#ffffff',
            color: m.sender === 'user' ? '#ffffff' : '#212529',
            padding: '10px 14px',
            borderRadius: '10px',
            maxWidth: '80%',
            fontSize: '13px',
            border: m.sender === 'user' ? 'none' : '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ fontSize: '12px', color: '#6c757d' }}>กำลังค้นหาคำตอบ...</div>}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #e9ecef' }}>
        <input
          type="text"
          placeholder="พิมพ์คำถามที่ต้องการค้นหา..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: '12px', border: 'none', outline: 'none', fontSize: '13px' }}
        />
        <button type="submit" style={{ padding: '12px 16px', backgroundColor: '#1b4332', color: '#ffffff', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
          ส่ง
        </button>
      </form>
    </div>
  );
}