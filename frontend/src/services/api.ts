import axios from 'axios';
import type { 
  ReleaseNote, 
  BeautifyRequest, 
  BeautifyResponse, 
  ApiResponse 
} from '../types';

// Get API URL from environment variable
// IMPORTANT: The URL should end with /api (no trailing slash needed)
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  console.log('API Base URL from env:', envUrl);
  
  // If no env URL, use localhost
  if (!envUrl) {
    console.warn('VITE_API_URL not set, using localhost');
    return 'http://localhost:8080/api';
  }
  
  // Ensure URL ends with /api (add it if missing)
  if (!envUrl.endsWith('/api')) {
    return envUrl + '/api';
  }
  
  return envUrl;
};

const API_BASE_URL = getApiBaseUrl();
console.log('Final API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + (config.url || ''));
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received from:', (response.config?.baseURL || '') + (response.config?.url || ''));
    return response;
  },
  (error) => {
    console.error('Response error:', error.message);
    console.error('Full URL attempted:', error.config?.url);
    console.error('Base URL:', error.config?.baseURL);
    return Promise.reject(error);
  }
);

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
