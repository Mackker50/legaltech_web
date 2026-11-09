'use client';

import { useState } from 'react';

export default function DocumentsPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConfidential, setIsConfidential] = useState(false);
  const [userRole, setUserRole] = useState('EXPORTER');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Phytosanitary_Certificate_Durian.pdf',
      role: 'EXPORTER',
      isConfidential: false,
      date: '09 พ.ย. 2026',
    },
    {
      id: 2,
      name: 'Commercial_Invoice_Confidential.pdf',
      role: 'EXPORTER',
      isConfidential: true,
      date: '08 พ.ย. 2026',
    },
    {
      id: 3,
      name: 'Bill_of_Lading_BL_001.pdf',
      role: 'FREIGHT_FORWARDER',
      isConfidential: false,
      date: '07 พ.ย. 2026',
    },
  ]);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('กรุณาเลือกไฟล์เอกสารก่อนอัปโหลด');
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

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

      if (res.ok && data.success) {
        setUploadStatus({
          type: 'success',
          message: `✅ ${data.message} (${data.fileInfo?.originalName || selectedFile.name})`,
        });

        setDocuments((prev) => [
          {
            id: Date.now(),
            name: data.fileInfo?.originalName || selectedFile.name,
            role: userRole,
            isConfidential: isConfidential,
            date: 'วันนี้',
          },
          ...prev,
        ]);

        setSelectedFile(null);
        setIsConfidential(false);
        e.target.reset();
      } else {
        setUploadStatus({
          type: 'error',
          message: `❌ ${data.message || 'เกิดข้อผิดพลาดในการอัปโหลด'}`,
        });
      }
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: `❌ ไม่สามารถเชื่อมต่อระบบได้: ${err.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '600', letterSpacing: '-0.02em', color: '#1d1d1f', margin: '0 0 6px 0' }}>
            คลังเอกสารส่งออก & สิทธิ์ความลับ (RBAC)
          </h1>
          <p style={{ fontSize: '15px', color: '#86868b', margin: 0 }}>
            แนบเอกสารทางกฎหมาย ใบรับรอง และสัญญา พร้อมกำหนดสิทธิ์การมองเห็นข้อมูล
          </p>
        </div>

        <div style={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#86868b' }}>จำลองสวมบทบาท:</span>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            style={{ border: 'none', backgroundColor: 'transparent', fontSize: '13px', fontWeight: '600', color: '#1d1d1f', outline: 'none', cursor: 'pointer' }}
          >
            <option value="EXPORTER">👨‍🌾 ผู้ส่งออก (Exporter)</option>
            <option value="MIDDLEMAN">🤝 พ่อค้าคนกลาง (Middleman)</option>
            <option value="FARMER">🧑‍🌾 เกษตรกร (Farmer)</option>
            <option value="FREIGHT_FORWARDER">🚢 บริษัทขนส่ง (Forwarder)</option>
          </select>
        </div>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.04)'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#1d1d1f' }}>
          อัปโหลดเอกสารใหม่เข้าสู่ระบบ
        </h2>

        <form onSubmit={handleFileUpload}>
          <div style={{
            border: '2px dashed #e5e5ea',
            borderRadius: '14px',
            padding: '28px',
            textAlign: 'center',
            backgroundColor: '#fafafa',
            marginBottom: '20px'
          }}>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ fontSize: '14px', color: '#424245' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#1d1d1f', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isConfidential}
                onChange={(e) => setIsConfidential(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#0071e3' }}
              />
              🔒 <strong>กำหนดเป็นเอกสารลับเฉพาะ</strong> (จำกัดการเข้าถึงเฉพาะ Exporter & Middleman)
            </label>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            style={{
              backgroundColor: isUploading ? '#86868b' : '#0071e3',
              color: '#ffffff',
              border: 'none',
              borderRadius: '980px',
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0, 113, 227, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            {isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลดเอกสารเข้าสู่ระบบ'}
          </button>
        </form>

        {uploadStatus && (
          <div style={{
            marginTop: '20px',
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: uploadStatus.type === 'success' ? '#eefbdf' : '#ffebeb',
            color: uploadStatus.type === 'success' ? '#297a00' : '#d70015',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {uploadStatus.message}
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '36px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(0, 0, 0, 0.04)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#1d1d1f' }}>
          รายการเอกสารทั้งหมดในดีลปัจจุบัน
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {documents.map((doc) => {
            const isHidden = doc.isConfidential && (userRole === 'FARMER' || userRole === 'FREIGHT_FORWARDER');

            return (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  backgroundColor: isHidden ? '#f5f5f7' : '#fafafa',
                  border: '1px solid rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: isHidden ? '#86868b' : '#1d1d1f' }}>
                    {isHidden ? '🔒 [เอกสารสัญญาซื้อขายลับเฉพาะ — ปกปิดตามสิทธิ์ RBAC]' : doc.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#86868b', marginTop: '4px' }}>
                    อัปโหลดโดย: {doc.role} • {doc.date}
                  </div>
                </div>
                <div>
                  {doc.isConfidential ? (
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#ffebeb', color: '#d70015', fontWeight: '500' }}>
                      เอกสารลับเฉพาะ
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#eefbdf', color: '#297a00', fontWeight: '500' }}>
                      เปิดเผยทั่วไป
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}