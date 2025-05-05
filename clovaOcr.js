const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_URL = process.env.CLOVA_OCR_API_URL;
const SECRET_KEY = process.env.CLOVA_OCR_SECRET_KEY;
const API_KEY = process.env.CLOVA_OCR_API_KEY;

function getBase64(filePath) {
  return fs.readFileSync(filePath, { encoding: 'base64' });
}

async function analyzeWithClovaOcr(filePath) {
  const ext = path.extname(filePath).replace('.', '').toLowerCase();
  const base64 = getBase64(filePath);
  const now = Date.now();
  const body = {
    images: [
      {
        format: ext,
        name: path.basename(filePath),
        data: base64,
      },
    ],
    requestId: `ocr-${now}`,
    version: 'V2',
    timestamp: now,
  };

  try {
    console.log('=== 요청 바디 ===');
    console.log(JSON.stringify(body, null, 2));
    const response = await axios.post(API_URL, body, {
      headers: {
        'X-OCR-SECRET': SECRET_KEY,
        'X-NCP-APIGW-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    console.error('=== 응답 에러 ===');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    throw error;
  }
}

module.exports = { analyzeWithClovaOcr };
