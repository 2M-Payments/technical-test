import { useAuth } from '../hooks/useAuth';
import { AuthForm } from '../components/AuthForm';
import { loginSchema } from '../schemas/auth.schema';
import { Link } from 'react-router-dom';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const LoginPage = () => {

  const initialValues = {email:'', password:''};
  const { signIn } = useAuth(); 

  const handleSubmit = async (values: typeof initialValues) => {
     await signIn(values); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
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
       <p className="text-sm text-center mt-4">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="text-blue-500 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;