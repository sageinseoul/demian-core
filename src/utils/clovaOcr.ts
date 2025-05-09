import axios from 'axios';

interface ClovaOcrResponse {
  version: string;
  requestId: string;
  timestamp: number;
  images: Array<{
    uid: string;
    name: string;
    inferResult: string;
    message: string;
    fields: Array<{
      valueType: string;
      boundingPoly: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
      inferText: string;
      inferConfidence: number;
    }>;
  }>;
}

export const analyzeTaxDocument = async (file: File): Promise<ClovaOcrResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post<ClovaOcrResponse>(
      'https://naveropenapi.apigw.ntruss.com/vision-ocr/v1/recognize',
      formData,
      {
        headers: {
          'X-OCR-SECRET': 'ncp_iam_BPKMKRZpiZ2PW0LejlDUZkCWcKDlIW7CPj',
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('OCR 분석 중 오류 발생:', error);
    throw error;
  }
}; 