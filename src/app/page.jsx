'use client';

import { useState } from 'react';

export default function HomePage() {
  // 1. User & Role Management (RBAC Simulation)
  const [userRole, setUserRole] = useState('EXPORTER');

  // 2. Export Transaction Workspace & Trade Terms State
  const [transaction, setTransaction] = useState({
    orderNo: 'EXP-2026-001',
    product: 'ทุเรียนหมอนทองสด (Fresh Durian)',
    quantity: '25,000 กิโลกรัม (1 ตู้คอนเทนเนอร์ห้องเย็น)',
    price: '4,500,000 บาท',
    buyer: 'Shanghai Fresh Import Co., Ltd.',
    destination: 'จีน (ท่าเรือ Shanghai)',
    incoterm: 'CIF',
    deliveryDate: '2026-11-20',
  });

  // 3. Transaction Status Tracking
  const [currentStep, setCurrentStep] = useState(2); // 1: ตกลงเงื่อนไข, 2: เตรียมเอกสาร, 3: ขนส่ง, 4: ส่งมอบ
  const steps = [
    { id: 1, label: '1. ตกลงเงื่อนไขการค้า' },
    { id: 2, label: '2. ตรวจสอบ & เตรียมเอกสาร' },
    { id: 3, label: '3. ดำเนินการจัดส่ง' },
    { id: 4, label: '4. ส่งมอบสินค้าสำเร็จ' },
  ];

  // 4. Stakeholder Coordination List
  const stakeholders = [
    { role: 'EXPORTER', name: 'บริษัท ไทย อกริ เอกซ์พอร์ต จำกัด', status: 'พร้อมส่งออก', isCurrent: userRole === 'EXPORTER' },
    { role: 'MIDDLEMAN', name: 'คุณสมชาย (ผู้รวบรวม & คัดเกรด)', status: 'สินค้าพร้อมจัดส่ง', isCurrent: userRole === 'MIDDLEMAN' },
    { role: 'FARMER', name: 'กลุ่มเกษตรกรแปลงใหญ่ จ.จันทบุรี', status: 'เก็บเกี่ยวเรียบร้อย', isCurrent: userRole === 'FARMER' },
    { role: 'FREIGHT_FORWARDER', name: 'Global Logistics Express', status: 'จองตู้เรือเรียบร้อย', isCurrent: userRole === 'FREIGHT_FORWARDER' },
  ];

  // 5. AI Advisor & Checklist States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [checklistData, setChecklistData] = useState(null);
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  // 6. Document Upload & Security Control State
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: 'Phytosanitary Certificate (ใบรับรองปลอดศัตรูพืช)', party: 'EXPORTER', isConfidential: false, status: 'ครบแล้ว' },
    { name: 'Bill of Lading (B/L ใบรับขนสินค้าทางทะเล)', party: 'FREIGHT_FORWARDER', isConfidential: false, status: 'กำลังดำเนินการ' },
    { name: 'Commercial Invoice & Price Contract (สัญญาซื้อขายส่วนต่าง)', party: 'EXPORTER', isConfidential: true, status: 'ครบแล้ว' },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConfidential, setIsConfidential] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // --- API Handlers ---
  const handleConsultAI = async () => {
    if (!aiPrompt) return alert('กรุณากรอกข้อสงสัยทางกฎหมาย');
    setLoadingAi(true);
    setAiAdvice('');

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCategory: transaction.product,
          destinationCountry: transaction.destination,
          incoterm: transaction.incoterm,
          prompt: aiPrompt,
        }),
      });
      const data = await res.json();
      if (data.success) setAiAdvice(data.advice);
      else setAiAdvice('เกิดข้อผิดพลาด: ' + (data.error || data.message));
    } catch (err) {
      setAiAdvice('ไม่สามารถเชื่อมต่อ API ได้: ' + err.message);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGenerateChecklist = async () => {
    setLoadingChecklist(true);
    try {
      const res = await fetch('/api/ai/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: transaction.product,
          destination: transaction.destination,
          incoterm: transaction.incoterm,
        }),
      });
      const data = await res.json();
      if (data.success) setChecklistData(data.data);
      else alert('เกิดข้อผิดพลาด: ' + (data.error || data.message));
    } catch (err) {
      alert('ไม่สามารถเชื่อมต่อ API ได้: ' + err.message);
    } finally {
      setLoadingChecklist(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('กรุณาเลือกไฟล์ก่อน');

    setUploadStatus('กำลังอัปโหลดไฟล์...');
    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('isConfidential', isConfidential);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'x-user-role': userRole },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadStatus(`✅ อัปโหลดสำเร็จ: ${data.fileInfo.originalName}`);
        setUploadedDocs([
          ...uploadedDocs,
          {
            name: data.fileInfo.originalName,
            party: userRole,
            isConfidential,
            status: 'ครบแล้ว',
          },
        ]);
      } else {
        setUploadStatus(`❌ ล้มเหลว (403/500): ${data.message}`);
      }
    } catch (err) {
      setUploadStatus(`❌ เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', color: '#1e293b' }}>
      
      {/* 1. Header & Role Management Switcher */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', color: '#fff', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌾 AgriLegal Workspace
          </h1>
          <small style={{ color: '#94a3b8' }}>แพลตฟอร์มจัดการธุรกรรมและสัญญาส่งออกสินค้าเกษตร (LegalTech for Agri-Export)</small>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px', color: '#cbd5e1' }}>สวมบทบาทผู้ใช้:</label>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', color: '#0f172a', border: 'none', cursor: 'pointer' }}
          >
            <option value="EXPORTER">👨‍🌾 ผู้ส่งออก (Exporter)</option>
            <option value="MIDDLEMAN">🤝 พ่อค้าคนกลาง (Middleman)</option>
            <option value="FARMER">🧑‍🌾 เกษตรกร (Farmer)</option>
            <option value="FREIGHT_FORWARDER">🚢 Freight Forwarder</option>
          </select>
        </div>
      </header>

      {/* 2. Transaction Status Tracking Stepper */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#475569' }}>📍 สถานะธุรกรรมการส่งออก (Transaction Progress)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isDone = step.id < currentStep;
            return (
              <div 
                key={step.id} 
                onClick={() => setCurrentStep(step.id)}
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px', 
                  textAlign: 'center', 
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#2563eb' : isDone ? '#dcfce7' : '#f1f5f9',
                  color: isActive ? '#fff' : isDone ? '#166534' : '#64748b',
                  fontWeight: isActive || isDone ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {step.label} {isDone ? '✓' : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Main Column */}
        <div style={{ display: 'grid', gap: '24px' }}>

          {/* 3. Export Transaction Workspace & Trade Terms Record */}
          <section style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>📦 รายละเอียดธุรกรรมส่งออก (Transaction Workspace)</h2>
              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                ดีลหมายเลข: {transaction.orderNo}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div><strong>สินค้าเกษตร:</strong> {transaction.product}</div>
              <div><strong>ปริมาณส่งออก:</strong> {transaction.quantity}</div>
              <div><strong>ประเทศปลายทาง:</strong> {transaction.destination}</div>
              <div><strong>ผู้ซื้อปลายทาง:</strong> {transaction.buyer}</div>
              <div>
                <strong>เงื่อนไข Incoterms:</strong>{' '}
                <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                  {transaction.incoterm} (Cost, Insurance & Freight)
                </span>
              </div>
              <div><strong>วันส่งมอบเป้าหมาย:</strong> {transaction.deliveryDate}</div>

              {/* Data Privacy Control: Commercial Price strictly hidden from Farmer & Forwarder */}
              {(userRole === 'EXPORTER' || userRole === 'MIDDLEMAN') ? (
                <div style={{ gridColumn: 'span 2', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '6px', color: '#166534' }}>
                  <strong>💰 ราคารวมธุรกรรม (เปิดเผยเฉพาะ Exporter & Middleman):</strong> {transaction.price}
                </div>
              ) : (
                <div style={{ gridColumn: 'span 2', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '10px', borderRadius: '6px', color: '#94a3b8', fontSize: '13px' }}>
                  🔒 *ข้อมูลมูลค่าทางการค้าสงวนสิทธิ์เฉพาะคู่สัญญาหลัก (Exporter & Middleman)*
                </div>
              )}
            </div>
          </section>

          {/* 4. AI LegalTech Assistant & Document Checklist */}
          <section style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              🤖 AI Trade Terms & Legal Advisor (Gemini LegalTech)
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>
                สอบถามข้อสงสัยทางกฎหมายการส่งออก / การแบ่งหน้าที่ตาม Incoterms:
              </label>
              <textarea
                rows={3}
                placeholder="เช่น เงื่อนไข CIF ไปจีน ใครเป็นผู้รับผิดชอบทำใบรับรองศัตรูพืช และผู้ขายต้องทำประกันภัยคุ้มครองถึงจุดไหน?"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={handleConsultAI}
                disabled={loadingAi}
                style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {loadingAi ? 'กำลังประมวลผล...' : 'ปรึกษา AI Legal Specialist'}
              </button>
              <button
                onClick={handleGenerateChecklist}
                disabled={loadingChecklist}
                style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {loadingChecklist ? 'กำลังสกัด Checklist...' : 'สร้าง Document Checklist อัตโนมัติ'}
              </button>
            </div>

            {aiAdvice && (
              <div style={{ padding: '14px', backgroundColor: '#f8fafc', borderLeft: '4px solid #2563eb', borderRadius: '4px', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}>
                <strong style={{ color: '#1e40af' }}>💡 คำแนะนำทางกฎหมายจาก AI:</strong>
                <p style={{ margin: '8px 0 0 0' }}>{aiAdvice}</p>
              </div>
            )}

            {checklistData && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>📋 Checklist เอกสารทางกฎหมายที่จำเป็นสำหรับดีลนี้</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>ชื่อเอกสาร</th>
                      <th style={{ padding: '8px' }}>ฝ่ายที่รับผิดชอบ</th>
                      <th style={{ padding: '8px' }}>สถานะความจำเป็น</th>
                      <th style={{ padding: '8px' }}>คำแนะนำ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checklistData.required_documents?.map((doc, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{doc.doc_name}</td>
                        <td style={{ padding: '8px' }}><span style={{ backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>{doc.responsible_party}</span></td>
                        <td style={{ padding: '8px' }}>{doc.is_mandatory ? '🔴 จำเป็นต้องมี' : '🟡 ทางเลือก'}</td>
                        <td style={{ padding: '8px', color: '#64748b' }}>{doc.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* 5. Document Management & Confidentiality Control */}
          <section style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
              📄 คลังเอกสาร & ควบคุมสิทธิ์เข้าถึง (Document Management & Access Control)
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>รายการเอกสาร</th>
                  <th style={{ padding: '10px' }}>ผู้อัปโหลด</th>
                  <th style={{ padding: '10px' }}>การจำกัดสิทธิ์</th>
                  <th style={{ padding: '10px' }}>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocs.map((doc, idx) => {
                  // Hide Confidential contracts from Farmer & Freight Forwarder
                  const isHidden = doc.isConfidential && (userRole === 'FARMER' || userRole === 'FREIGHT_FORWARDER');
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>
                        {isHidden ? '🔒 [เอกสารสัญญาซื้อขายแบบปกปิด]' : doc.name}
                      </td>
                      <td style={{ padding: '10px' }}>{doc.party}</td>
                      <td style={{ padding: '10px' }}>
                        {doc.isConfidential ? (
                          <span style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '2px 6px', borderRadius: '4px' }}>🔒 เอกสารลับ (เฉพาะ Exporter/Middleman)</span>
                        ) : (
                          <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>🌐 ทุกฝ่ายเข้าถึงได้</span>
                        )}
                      </td>
                      <td style={{ padding: '10px', color: isHidden ? '#94a3b8' : '#059669', fontWeight: 'bold' }}>
                        {isHidden ? 'ไม่มีสิทธิ์เข้าถึง' : doc.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Upload Form */}
            <form onSubmit={handleFileUpload} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>แนบเอกสารเพิ่มเข้าสู่ธุรกรรม (อัปโหลดในนาม: {userRole})</h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <label style={{ fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isConfidential} onChange={(e) => setIsConfidential(e.target.checked)} />
                  {' '}🔒 กำหนดเป็นเอกสารลับเฉพาะ (เข้าถึงได้เฉพาะคู่สัญญาหลัก)
                </label>
              </div>
              <button type="submit" style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                อัปโหลดเอกสาร
              </button>
              {uploadStatus && <div style={{ marginTop: '8px', fontSize: '13px', color: uploadStatus.includes('✅') ? '#166534' : '#991b1b' }}>{uploadStatus}</div>}
            </form>
          </section>

        </div>

        {/* Right Sidebar: Stakeholder Coordination */}
        <div>
          <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
              🤝 การประสานงานผู้เกี่ยวข้อง (Stakeholder Coordination)
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {stakeholders.map((sh, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    backgroundColor: sh.isCurrent ? '#eff6ff' : '#f8fafc',
                    border: sh.isCurrent ? '1.5px solid #3b82f6' : '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}>{sh.role}</span>
                    {sh.isCurrent && <span style={{ fontSize: '10px', backgroundColor: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>คุณอยู่บทบาทนี้</span>}
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{sh.name}</div>
                  <div style={{ fontSize: '12px', color: '#059669' }}>สถานะ: {sh.status}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}