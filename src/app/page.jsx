'use client';

import { useState } from 'react';

export default function HomePage() {
  // 1. User Role State (จำลองสิทธิ์ RBAC)
  const [userRole, setUserRole] = useState('EXPORTER');

  // 2. AI Advisor States
  const [productCategory, setProductCategory] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('');
  const [prompt, setPrompt] = useState('');
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // 3. AI Checklist States
  const [incoterm, setIncoterm] = useState('FOB');
  const [checklistData, setChecklistData] = useState(null);
  const [loadingChecklist, setLoadingChecklist] = useState(false);

  // 4. File Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConfidential, setIsConfidential] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // --- Handlers ---
  const handleConsultAI = async () => {
    if (!prompt) return alert('กรุณากรอกคำถาม');
    setLoadingAi(true);
    setAiAdvice('');

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productCategory, destinationCountry, prompt })
      });
      const data = await res.json();
      if (data.success) {
        setAiAdvice(data.advice);
      } else {
        setAiAdvice('เกิดข้อผิดพลาด: ' + (data.error || data.message));
      }
    } catch (err) {
      setAiAdvice('ไม่สามารถเชื่อมต่อ API ได้: ' + err.message);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGenerateChecklist = async () => {
    if (!productCategory || !destinationCountry) {
      return alert('กรุณากรอกสินค้าและประเทศปลายทาง');
    }
    setLoadingChecklist(true);
    setChecklistData(null);

    try {
      const res = await fetch('/api/ai/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productCategory, destination: destinationCountry, incoterm })
      });
      const data = await res.json();
      if (data.success) {
        setChecklistData(data.data);
      } else {
        alert('เกิดข้อผิดพลาด: ' + (data.error || data.message));
      }
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
        headers: {
          'x-user-role': userRole // ส่งสิทธิ์ Role ปัจจุบันไปทดสอบ RBAC
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUploadStatus(`✅ อัปโหลดสำเร็จ: ${data.fileInfo?.filename || data.message}`);
      } else {
        setUploadStatus(`❌ ล้มเหลว (403/500): ${data.message}`);
      }
    } catch (err) {
      setUploadStatus(`❌ เกิดข้อผิดพลาด: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* Top Header & Role Switcher */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', color: '#fff', padding: '16px 24px', borderRadius: '8px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px' }}>🌾 AgriLegal - Export Portal</h1>
          <small style={{ color: '#94a3b8' }}>LegalTech for Agricultural Exportation</small>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px' }}>จำลองสิทธิ์ผู้ใช้งาน:</label>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', color: '#000' }}
          >
            <option value="EXPORTER">👨‍🌾 ผู้ส่งออก (Exporter)</option>
            <option value="MIDDLEMAN">🤝 พ่อค้าคนกลาง (Middleman)</option>
            <option value="FREIGHT_FORWARDER">🚢 Freight Forwarder</option>
          </select>
        </div>
      </header>

      <div style={{ display: 'grid', gap: '24px' }}>
        
        {/* Section 1: AI Legal Advisor */}
        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            🤖 AI Legal & Incoterms Assistant
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>ประเภทสินค้า:</label>
              <input 
                type="text" 
                placeholder="เช่น ทุเรียนหมอนทองสด" 
                value={productCategory} 
                onChange={(e) => setProductCategory(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>ประเทศปลายทาง:</label>
              <input 
                type="text" 
                placeholder="เช่น จีน (Shanghai)" 
                value={destinationCountry} 
                onChange={(e) => setDestinationCountry(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>Incoterm ที่ใช้:</label>
              <select 
                value={incoterm} 
                onChange={(e) => setIncoterm(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="FOB">FOB (Free on Board)</option>
                <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                <option value="EXW">EXW (Ex Works)</option>
                <option value="DDP">DDP (Delivered Duty Paid)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>ข้อสงสัยทางกฎหมายการค้า/เอกสารสัญญา:</label>
            <textarea 
              rows={3} 
              placeholder="เช่น ข้อตกลง FOB ไปจีน ใครต้องเป็นผู้รับผิดชอบการทำใบรับรองศัตรูพืช (Phytosanitary Cert)?" 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleConsultAI} 
              disabled={loadingAi}
              style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              {loadingAi ? 'กำลังวิเคราะห์...' : 'ปรึกษา AI Legal Specialist'}
            </button>
            <button 
              onClick={handleGenerateChecklist} 
              disabled={loadingChecklist}
              style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              {loadingChecklist ? 'กำลังสร้าง Checklist...' : 'สร้าง Document Checklist'}
            </button>
          </div>

          {/* Display AI Advice */}
          {aiAdvice && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '4px', whiteSpace: 'pre-wrap', color: '#0f172a' }}>
              <strong>คำแนะนำจาก AI:</strong>
              <p style={{ margin: '8px 0 0 0' }}>{aiAdvice}</p>
            </div>
          )}

          {/* Display Document Checklist Table */}
          {checklistData && (
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ color: '#0f172a' }}>📋 รายการเอกสารทางกฎหมายที่จำเป็น</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#cbd5e1', textAlign: 'left', color: '#0f172a' }}>
                    <th style={{ padding: '8px' }}>ชื่อเอกสาร</th>
                    <th style={{ padding: '8px' }}>ฝ่ายที่ต้องจัดหา</th>
                    <th style={{ padding: '8px' }}>ความจำเป็น</th>
                    <th style={{ padding: '8px' }}>คำอธิบายเพิ่มเติม</th>
                  </tr>
                </thead>
                <tbody>
                  {checklistData.required_documents?.map((doc, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', color: '#334155' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{doc.doc_name}</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          {doc.responsible_party}
                        </span>
                      </td>
                      <td style={{ padding: '8px' }}>{doc.is_mandatory ? '🔴 จำเป็น' : '🟡 ทางเลือก'}</td>
                      <td style={{ padding: '8px', fontSize: '13px' }}>{doc.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Section 2: Document Management & Upload */}
        <section style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            📄 Upload & Access Control (RBAC)
          </h2>
          <form onSubmit={handleFileUpload}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>เลือกไฟล์เอกสาร (PDF/PNG):</label>
              <input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ marginTop: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', cursor: 'pointer', color: '#334155' }}>
                <input 
                  type="checkbox" 
                  checked={isConfidential} 
                  onChange={(e) => setIsConfidential(e.target.checked)} 
                />
                {' '}🔒 กำหนดเป็นเอกสารลับเฉพาะ (เข้าถึงได้เฉพาะ Exporter & Middleman)
              </label>
            </div>
            <button 
              type="submit" 
              style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              อัปโหลดเอกสารเข้าสู่ระบบ
            </button>
          </form>

          {uploadStatus && (
            <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '4px', backgroundColor: uploadStatus.includes('✅') ? '#dcfce7' : '#fee2e2', color: uploadStatus.includes('✅') ? '#166534' : '#991b1b' }}>
              {uploadStatus}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}