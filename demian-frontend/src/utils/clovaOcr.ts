import axios from 'axios';

interface ClovaOCRResponse {
  version: string;
  requestId: string;
  timestamp: number;
  images: Array<{
    fields: Array<{
      name: string;
      inferText: string;
      confidence: number;
      boundingBox: {
        vertices: Array<{x: number; y: number}>;
      };
    }>;
  }>;
}

export const analyzeTaxDocument = async (file: File): Promise<ClovaOCRResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<ClovaOCRResponse>(
      import.meta.env.VITE_CLOVA_OCR_API_URL,
      formData,
      {
        headers: {
          'X-OCR-SECRET': import.meta.env.VITE_CLOVA_OCR_SECRET_KEY,
          'X-NCP-APIGW-API-KEY': import.meta.env.VITE_CLOVA_OCR_ACCESS_KEY,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('CLOVA OCR API 호출 중 오류 발생:', error);
    throw error;
  }
}; 