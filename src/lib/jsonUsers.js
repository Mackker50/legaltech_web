import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'data/users.json');

// ค่าเริ่มต้นกรณีที่ยังไม่มีไฟล์
const defaultUsers = [
  {
    id: 'usr-001',
    name: 'สมใจ ใจดี',
    email: 'somchai@example.com',
    role: 'ผู้ส่งออกสินค้าเกษตร (Exporter)',
    avatar: '',
    isLoggedIn: false
  }
];

export function getUsers() {
  try {
    if (!fs.existsSync(filePath)) {
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(defaultUsers, null, 2), 'utf8');
      return defaultUsers;
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData || '[]');
  } catch (error) {
    console.error('Error reading users.json:', error);
    return defaultUsers;
  }
}

export function getActiveUser() {
  const users = getUsers();
  return users.find(u => u.isLoggedIn) || null;
}

export function saveOrUpdateUser(userData) {
  try {
    const users = getUsers();
    const index = users.findIndex(u => u.email === userData.email || u.id === userData.id);

    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
    } else {
      users.push({
        id: userData.id || 'usr-' + Date.now(),
        avatar: '',
        ...userData
      });
    }

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
    return userData;
  } catch (error) {
    console.error('Error writing users.json:', error);
    return null;
  }
}