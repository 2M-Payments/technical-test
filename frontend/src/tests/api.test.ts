import { describe, expect, it } from 'vitest';

import { getErrorMessage, getFieldErrors } from '../services/api';

const apiError = (status: number, data: unknown) => ({
  isAxiosError: true,
  response: { status, data },
});

describe('helpers de erro da API', () => {
  it('usa a mensagem enviada pela API', () => {
    expect(getErrorMessage(apiError(404, { message: 'Usuário não encontrado' }))).toBe(
      'Usuário não encontrado',
    );
  });

  it('inclui os e-mails em conflito na mensagem', () => {
    const error = apiError(409, {
      message: 'Alguns e-mails já estão cadastrados',
      details: { emails: ['a@a.com', 'b@b.com'] },
    });

    expect(getErrorMessage(error)).toBe('Alguns e-mails já estão cadastrados: a@a.com, b@b.com');
  });

  it('informa falha de conexão quando não há resposta', () => {
    expect(getErrorMessage({ isAxiosError: true })).toBe('Não foi possível conectar à API.');
  });

  it('usa o fallback para erros desconhecidos', () => {
    expect(getErrorMessage(new Error('x'), 'Falhou')).toBe('Falhou');
  });

  it('indexa os erros de validação pelo caminho do campo', () => {
    const error = apiError(400, {
      message: 'Dados inválidos',
      issues: [
        { path: 'users.1.email', message: 'E-mail inválido' },
        { path: 'users.1.email', message: 'Outro erro' },
        { path: 'name', message: 'Muito curto' },
      ],
    });

    expect(getFieldErrors(error)).toEqual({
      'users.1.email': 'E-mail inválido',
      name: 'Muito curto',
    });
  });
});
