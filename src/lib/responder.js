// คลังคำตอบที่เตรียมไว้ล่วงหน้า (Pre-defined Rules & Responses)
const responseRules = [
  {
    id: 'DOCUMENTS',
    keywords: ['คลังเอกสาร', 'สัญญา', 'document', 'contract'],
    response: '📁 คุณสามารถเข้าใช้งานคลังเอกสารส่งออกและสัญญาดิจิทัลได้ที่เมนู "คลังเอกสารส่งออก" หรือเข้าผ่านลิงก์ /documents',
  },
  {
    id: 'CERTIFICATE',
    keywords: ['ใบรับรอง', 'สุขอนามัยพืช', 'phyto', 'form e', 'กรมวิชาการเกษตร'],
    response: '📜 สำหรับการยื่นขอใบรับรองสุขอนามัยพืช (Phytosanitary Certificate) และหนังสือรับรองถิ่นกำเนิดสินค้า สามารถยื่นคำขอได้ที่เมนู "ขอใบรับรอง"',
  },
  {
    id: 'HS_CODE',
    keywords: ['hs code', 'พิกัด', 'ภาษี', 'อัตราภาษี'],
    response: '🔍 คุณสามารถตรวจสอบพิกัดอัตราศุลกากรสินค้าเกษตรและอัตราภาษีปลายทางได้ที่เมนู "พิกัด HS Code & ภาษี"',
  },
  {
    id: 'SUPPLY_CHAIN',
    keywords: ['ติดตาม', 'จัดส่ง', 'tracking', 'supply chain', 'สถานะ'],
    response: '🚢 ตรวจสอบสถานะตู้สินค้าเกษตรตั้งแต่แปลงปลูกจนถึงท่าเรือปลายทางได้ที่เมนู "ติดตาม Supply Chain"',
  },
  {
    id: 'GREETING',
    keywords: ['สวัสดี', 'สวัสดีครับ', 'สวัสดีค่ะ', 'hello', 'hi'],
    response: '🌱 สวัสดีครับ ยินดีต้อนรับสู่ AgriLegal Pro คุณสามารถพิมพ์คำถามหรือเลือกบริการที่ต้องการสอบถามได้เลยครับ',
  }
];

// คำตอบเริ่มต้นกรณีที่ไม่พบคำตอบที่ตรงกับ Keyword (Fallback Response)
const defaultResponse = 'ขออภัยครับ ระบบไม่พบข้อมูลที่ตรงกับคำถามของคุณ กรุณาติดต่อเจ้าหน้าที่ผ่าน HOTLINE: 02-XXX-XXXX หรือเลือกเมนูบริการหน้าหลักครับ';

/**
 * ฟังก์ชันประมวลผลการตอบกลับอัตโนมัติ (Rule-Based Matcher)
 * @param {string} userMessage - ข้อความที่ผู้ใช้พิมพ์เข้ามา
 * @returns {object} ผลลัพธ์คำตอบและรหัสกฎที่จับคู่ได้
 */
export function getAutoResponse(userMessage) {
  if (!userMessage || typeof userMessage !== 'string') {
    return { status: 'error', message: defaultResponse };
  }

  const cleanMessage = userMessage.toLowerCase().trim();

  // ตรวจหา Match จากคลัง Keywords
  for (const rule of responseRules) {
    const isMatched = rule.keywords.some(keyword => cleanMessage.includes(keyword.toLowerCase()));
    if (isMatched) {
      return {
        status: 'success',
        ruleId: rule.id,
        message: rule.response
      };
    }
  }

  return {
    status: 'fallback',
    ruleId: 'DEFAULT',
    message: defaultResponse
  };
}