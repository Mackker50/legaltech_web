import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

// ฟังก์ชันอ่านข้อมูลจากไฟล์ JSON
export async function readData(fileName) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ถ้ายังไม่มีไฟล์ ให้ส่งคืน Array ว่าง
    return [];
  }
}

// ฟังก์ชันเขียนข้อมูลลงไฟล์ JSON
export async function writeData(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}