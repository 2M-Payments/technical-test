import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { UserForm } from '../components/users/UserForm';
import { regionsFixture } from './fixtures';

const renderForm = (props: Partial<Parameters<typeof UserForm>[0]> = {}) => {
  const onSubmit = vi.fn();
  render(
    <UserForm mode="create" regions={regionsFixture} onSubmit={onSubmit} onCancel={vi.fn()} {...props} />,
  );
  return { onSubmit };
};

describe('<UserForm />', () => {
  it('valida os campos obrigatórios antes de enviar', async () => {
    const { onSubmit } = renderForm();

    await userEvent.click(screen.getByRole('button', { name: 'Criar usuário' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Nome deve ter ao menos 3 caracteres')).toBeInTheDocument();
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
    expect(screen.getByText('Senha deve ter ao menos 8 caracteres')).toBeInTheDocument();
    expect(screen.getByText('Selecione ao menos uma região')).toBeInTheDocument();
  });

  it('envia um usuário com múltiplas regiões', async () => {
    const { onSubmit } = renderForm();

    await userEvent.type(screen.getByLabelText('Nome'), 'Maria Silva');
    await userEvent.type(screen.getByLabelText('E-mail'), 'maria@email.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'senha-segura');
    await userEvent.click(screen.getByLabelText('Brasil'));
    await userEvent.click(screen.getByLabelText('Reino Unido'));
    await userEvent.click(screen.getByRole('button', { name: 'Criar usuário' }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Maria Silva',
      email: 'maria@email.com',
      password: 'senha-segura',
      status: 'ACTIVE',
      regionCodes: ['BR', 'GB'],
    });
  });

  it('na edição, a senha é opcional', async () => {
    const { onSubmit } = renderForm({
      mode: 'edit',
      initialValues: { name: 'Maria', email: 'maria@email.com', status: 'ACTIVE', regionCodes: ['BR'] },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ password: '' }));
  });

  it('exibe erros de campo vindos da API', () => {
    renderForm({ serverErrors: { email: 'E-mail já cadastrado' } });

    expect(screen.getByText('E-mail já cadastrado')).toBeInTheDocument();
  });
});
