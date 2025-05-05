const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const API_URL = process.env.CLOVA_OCR_API_URL;
const ACCESS_KEY = process.env.CLOVA_OCR_ACCESS_KEY;
const SECRET_KEY = process.env.CLOVA_OCR_SECRET_KEY;

async function analyzeWithClovaOcr(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
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