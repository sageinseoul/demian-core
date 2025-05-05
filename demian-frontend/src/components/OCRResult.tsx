import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// 실제 API 결과 예시를 하드코딩 (실제 연동 시 props로 대체)
const ocrData = {
  version: 'V2',
  requestId: '1234',
  timestamp: 1746413020292,
  images: [
    {
      name: 'sample',
      inferResult: 'SUCCESS',
      message: 'SUCCESS',
      fields: [
        { inferText: '[Income', inferConfidence: 0.9706, boundingPoly: { vertices: [{ x: 59, y: 51 }, { x: 104, y: 51 }, { x: 104, y: 61 }, { x: 59, y: 61 }] } },
        { inferText: 'Tax', inferConfidence: 0.9996, boundingPoly: { vertices: [{ x: 104, y: 51 }, { x: 130, y: 51 }, { x: 130, y: 61 }, { x: 104, y: 61 }] } },
        { inferText: 'withholding', inferConfidence: 0.9973, boundingPoly: { vertices: [{ x: 127, y: 49 }, { x: 201, y: 49 }, { x: 201, y: 64 }, { x: 127, y: 64 }] } },
        { inferText: 'statement', inferConfidence: 0.9981, boundingPoly: { vertices: [{ x: 201, y: 50 }, { x: 260, y: 50 }, { x: 260, y: 61 }, { x: 201, y: 61 }] } },
        { inferText: 'Template]', inferConfidence: 0.9888, boundingPoly: { vertices: [{ x: 260, y: 50 }, { x: 319, y: 50 }, { x: 319, y: 61 }, { x: 260, y: 61 }] } },
        { inferText: '-', inferConfidence: 0.959, boundingPoly: { vertices: [{ x: 323, y: 53 }, { x: 329, y: 53 }, { x: 329, y: 57 }, { x: 323, y: 57 }] } },
        { inferText: 'Amended', inferConfidence: 0.9998, boundingPoly: { vertices: [{ x: 333, y: 50 }, { x: 380, y: 50 }, { x: 380, y: 61 }, { x: 333, y: 61 }] } },
        { inferText: '2025.', inferConfidence: 0.9999, boundingPoly: { vertices: [{ x: 381, y: 50 }, { x: 413, y: 50 }, { x: 413, y: 61 }, { x: 381, y: 61 }] } },
        { inferText: '3.1', inferConfidence: 1.0, boundingPoly: { vertices: [{ x: 411, y: 50 }, { x: 434, y: 50 }, { x: 434, y: 61 }, { x: 411, y: 61 }] } },
      ],
    },
  ],
};

const OCRResult: React.FC = () => {
  const fields = ocrData.images[0].fields;
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        OCR 인식 결과 (샘플)
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>텍스트</TableCell>
              <TableCell>신뢰도</TableCell>
              <TableCell>좌표 (x, y)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, idx) => (
              <TableRow key={idx}>
                <TableCell>{field.inferText}</TableCell>
                <TableCell>{(field.inferConfidence * 100).toFixed(2)}%</TableCell>
                <TableCell>
                  {field.boundingPoly.vertices.map((v: any, i: number) => `(${v.x}, ${v.y})`).join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OCRResult; 