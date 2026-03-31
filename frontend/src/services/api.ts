import axios from 'axios';
import type { 
  ReleaseNote, 
  BeautifyRequest, 
  BeautifyResponse, 
  ApiResponse 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const beautifyText = async (
  request: BeautifyRequest
): Promise<ApiResponse<BeautifyResponse>> => {
  const response = await api.post<ApiResponse<BeautifyResponse>>('/beautify', request);
  return response.data;
};

export const exportToWord = async (releaseNote: ReleaseNote): Promise<Blob> => {
  const response = await api.post<Blob>('/export/word', releaseNote, {
    responseType: 'blob',
  });
  return response.data;
};

export const getTemplate = async (): Promise<ApiResponse<ReleaseNote>> => {
  const response = await api.get<ApiResponse<ReleaseNote>>('/template');
  return response.data;
};

export const healthCheck = async (): Promise<ApiResponse<string>> => {
  const response = await api.get<ApiResponse<string>>('/health');
  return response.data;
};

export default api;
