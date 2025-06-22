import { AuthForm } from '../components/AuthForm';
import { registerSchema } from '../schemas/auth.schema';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const initialValues = { name: '', email: '', password: '' };
  const { signUp } = useAuth();
  
  const handleSubmit = async (values: typeof initialValues) => {
    await signUp(values)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-center mb-6">Cadastro</h1>
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
      </div>
    </div>
  );
};
export default RegisterPage;