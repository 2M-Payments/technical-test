import { useAuth } from '../hooks/useAuth';
import { AuthForm } from '../components/AuthForm';
import { loginSchema } from '../schemas/authSchema';
import { Link } from 'react-router-dom';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const LoginPage = () => {
  const initialValues = { email: '', password: '' };
  const { signIn } = useAuth();

  const handleSubmit = async (values: typeof initialValues) => {
    await signIn(values);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-[#00A7E7] text-white px-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Controle Financeiro</h1>
          <p className="text-lg">Organize sua vida financeira de forma simples.</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 px-6 py-12">
        <div className="bg-white w-full max-w-md rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#00A7E7]">
            Entrar na sua conta
          </h2>

          <AuthForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={toFormikValidationSchema(loginSchema)}
            fields={[
              { label: 'Email', name: 'email' },
              { label: 'Senha', name: 'password', type: 'password' },
            ]}
            submitText="Entrar"
          />

          <p className="text-sm text-center mt-6 text-gray-600">
            Ainda não tem uma conta?{' '}
            <Link to="/cadastro" className="text-[#00A7E7] font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
