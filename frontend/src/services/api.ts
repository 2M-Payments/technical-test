const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) => 
    request<T>(endpoint, { method: 'GET', token }),
  
  post: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data), token }),
  
  put: <T>(endpoint: string, data: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), token }),
  
  patch: <T>(endpoint: string, data?: unknown, token?: string) =>
    request<T>(endpoint, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined, token }),
  
  delete: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, { method: 'DELETE', token }),
};

export default api;
