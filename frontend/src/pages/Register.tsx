import { useAuth } from '../hooks/useAuth';
import { AuthForm } from '../components/AuthForm';
import { registerSchema } from '../schemas/auth.schema';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const initialValues = { name: '', email: '', password: '' };
  const { signUp } = useAuth();

  const handleSubmit = async (values: typeof initialValues) => {
    await signUp(values);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center bg-[#00A7E7] text-white px-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Bem-vindo ao Controle Financeiro</h1>
          <p className="text-lg">Cadastre-se e comece agora mesmo!</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-gray-100 px-6 py-12">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#00A7E7]">
            Criar nova conta
          </h2>

          <AuthForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={toFormikValidationSchema(registerSchema)}
            fields={[
              { label: 'Nome', name: 'name' },
              { label: 'Email', name: 'email' },
              { label: 'Senha', name: 'password', type: 'password' },
            ]}
            submitText="Cadastrar"
          />

          <p className="text-sm text-center mt-6 text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/" className="text-[#00A7E7] font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
