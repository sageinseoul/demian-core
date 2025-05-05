const path = require('path');
const fs = require('fs');
const { analyzeWithClovaOcr } = require('./clovaOcr');

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('사용법: node convert.js <파일경로>');
    process.exit(1);
  }

  if (!fs.existsSync(inputPath)) {
    console.error('파일이 존재하지 않습니다:', inputPath);
    process.exit(1);
  }

  try {
    console.log('OCR 분석 시작:', inputPath);
    const ocrResult = await analyzeWithClovaOcr(inputPath);
    const { name, dir } = path.parse(inputPath);
    const outputPath = path.join(dir, `${name}_ocr.json`);
    fs.writeFileSync(outputPath, JSON.stringify(ocrResult, null, 2), 'utf-8');
    console.log('분석 결과가 저장되었습니다:', outputPath);
  } catch (err) {
    console.error('OCR 변환 중 오류:', err.message);
    process.exit(1);
  }
}

main();
