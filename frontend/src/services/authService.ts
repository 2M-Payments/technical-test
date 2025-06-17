
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type User = {
  email: string;
  token: string;
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/userAuth`, { email, password });
  return response.data;
};

export const storeUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem('user');
};

export const registerUser = async (email: string, password: string, userName: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/user`, { email, password, userName });
  return response.data;
}