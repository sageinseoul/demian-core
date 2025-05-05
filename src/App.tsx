import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { analyzeTaxDocument } from './utils/clovaOcr';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const ocrResult = await analyzeTaxDocument(file);
      setResult(ocrResult);
    } catch (error) {
      console.error('OCR 분석 중 오류 발생:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          OCR 변환기
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button variant="contained" component="span">
              이미지 선택
            </Button>
          </label>
          {file && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              선택된 파일: {file.name}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyze}
          disabled={!file || loading}
          sx={{ mt: 2 }}
        >
          {loading ? '분석 중...' : '분석 시작'}
        </Button>

        {result && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              분석 결과:
            </Typography>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default App; 