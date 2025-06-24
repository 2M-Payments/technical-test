import api from '../../services/api';
import { login, register } from '../../services/authService';
import {type LoginData,type RegisterData } from '../../types/authTypes';

jest.mock('../../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('Auth Service', () => {
  beforeEach(() => {
    mockedApi.post.mockClear();
  });

  it('deve chamar api.post com os dados corretos para login', async () => {
    const loginData: LoginData = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { data: { token: 'new-fake-token' } };
    mockedApi.post.mockResolvedValue(mockResponse);

    await login(loginData);

    expect(mockedApi.post).toHaveBeenCalledTimes(1);
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', loginData);
  });

  it('deve chamar api.post com os dados corretos para register', async () => {
    const registerData: RegisterData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    mockedApi.post.mockResolvedValue({}); 
    await register(registerData);

    expect(mockedApi.post).toHaveBeenCalledTimes(1);
    expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', registerData);
  });
});