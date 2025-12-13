import request from 'supertest';
import { AppDataSource } from '../config/datasource';
import app from '../app';

describe('Fluxo completo: usuário -> login -> criar pedido', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  it('deve criar usuário, autenticar e criar pedido com sessão', async () => {
    // 1. Criar usuário
    await request(app)
      .post('/api/users')
      .send({
        email: 'test@test.com',
        password: '123456',
        name: 'Test User',
        company: 'Test Company',
      })
      .expect(201);

    // 2. Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(200);

    const cookies = loginResponse.headers['set-cookie'];
    expect(cookies).toBeDefined();

    // 3. Criar pedido autenticado
    const orderResponse = await request(app)
      .post('/api/orders')
      .set('Cookie', cookies)
      .send({
        quantity: 500,
        fragrances: [
          { name: 'Lavanda', quantity: 200 },
          { name: 'Cereja', quantity: 300 },
        ],
        customDescription: 'Pedido teste',
      })
      .expect(201);

    expect(orderResponse.body).toHaveProperty('id');
    expect(orderResponse.body.totalQuantity).toBe(500);
  });
});
