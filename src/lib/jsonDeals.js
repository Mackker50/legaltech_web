import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'deals.json');

export function getDeals() {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData || '[]');
  } catch (error) {
    console.error('Error reading deals.json:', error);
    return [];
  }
}

export function saveOrUpdateDeal(newDeal) {
  try {
    const deals = getDeals();
    const index = deals.findIndex(d => d.dealId === newDeal.dealId);
    
    if (index !== -1) {
      deals[index] = { ...deals[index], ...newDeal };
    } else {
      deals.push(newDeal);
    }

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(deals, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing deals.json:', error);
    return false;
  }
}