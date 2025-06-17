import axios from 'axios';
import { getAuthToken, clearAuthData } from './services/authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      
      clearAuthData();
      
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    // Tratamento genérico de erros
    if (error.response) {
      console.error('Erro na resposta:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('Sem resposta do servidor:', error.request);
    } else {
      console.error('Erro ao configurar requisição:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;