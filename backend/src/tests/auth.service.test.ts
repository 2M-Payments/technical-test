

jest.mock('bcrypt');
jest.mock('../../utils/jwt.util');

describe('AuthService', () => {

    describe('login', () => {
        it('deve fazer login com credenciais válidas', async () => {
        });

        it('deve lançar erro se usuário não existir', async () => {
        });

        it('deve lançar erro se senha estiver incorreta', async () => {
        });
    });

    describe('verifyToken', () => {
        it('deve verificar token válido', async () => {
        });

        it('deve lançar erro se token for inválido', async () => {
        });
    });

});