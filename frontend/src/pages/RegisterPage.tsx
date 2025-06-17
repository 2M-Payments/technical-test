import Input from '../components/input';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './registerPage.css'; 

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userName, setUser] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

 
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await register(email, password, userName);
      navigate('/products');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="register-container">
      <h1>Criar Conta</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
          required
        />
          <Input
          label="Usuário"
          type="text"
          value={userName}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Digite seu email"
          required
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
        />
        <Input
          label="Confirmação de senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme sua senha"
          required
        />
        {passwordError && (
          <p style={{ color: 'red', fontSize: '14px', marginTop: '-15px' }}>
            {passwordError}
          </p>
        )}
        <button 
          type="submit" 
          disabled={passwordError !== '' || !email || !password || !confirmPassword}
        >
          Registrar
        </button>
      </form>
    </div>
  );
};
