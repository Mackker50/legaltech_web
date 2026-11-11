import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

// ดึงข้อมูลผู้ใช้ทั้งหมดจาก JSON
export function getUsers() {
  try {
    if (!fs.existsSync(filePath)) {
      // ถ้ายังไม่มีไฟล์ ให้สร้างโฟลเดอร์และไฟล์ว่างขึ้นมา
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify([]), 'utf8');
      return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData || '[]');
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return [];
  }
}

// บันทึกผู้ใช้ใหม่ลง JSON
export function saveUser(newUser) {
  try {
    const users = getUsers();
    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to JSON file:', error);
    return false;
  }
}