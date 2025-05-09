const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const API_URL = process.env.CLOVA_OCR_API_URL;
const ACCESS_KEY = process.env.CLOVA_OCR_ACCESS_KEY;
const SECRET_KEY = process.env.CLOVA_OCR_SECRET_KEY;

function getBase64FromFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
}

async function analyzeWithClovaOcr(filePath) {
  const base64Image = getBase64FromFile(filePath);
  const now = Date.now().toString();
  const body = {
    version: "V2",
    requestId: `req_${now}`,
    timestamp: now,
    lang: "ko",
    images: [
      {
        format: "png",
        name: "sample",
        data: base64Image
      }
    ],
    enableTableDetection: false
  };

  try {
    const response = await axios.post(API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-OCR-SECRET': SECRET_KEY,
        'X-NCP-APIGW-API-KEY': ACCESS_KEY,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    console.error('CLOVA OCR API 호출 오류:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { analyzeWithClovaOcr };
