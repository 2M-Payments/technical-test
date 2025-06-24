import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../../components/AuthForm';
import * as Yup from 'yup';

const mockSubmit = jest.fn().mockResolvedValue({});

const fields = [
  { name: 'email', label: 'Email' },
  { name: 'password', label: 'Senha', type: 'password' },
];

const validationSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

describe('AuthForm', () => {
  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders fields and submits form', async () => {
    render(
      <AuthForm
        initialValues={{ email: '', password: '' }}
        onSubmit={mockSubmit}
        validationSchema={validationSchema}
        fields={fields}
        submitText="Entrar"
      />
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: '123456' } });
    
    await fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        { email: 'teste@email.com', password: '123456' },
        expect.any(Object)
      );
    });
  });
});