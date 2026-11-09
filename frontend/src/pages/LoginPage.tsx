import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../services/api';

export function LoginPage() {
  const { status, sessionExpired, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authenticated') {
    const from = (location.state as { from?: string } | null)?.from ?? '/users';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível entrar.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <aside className="login-page__aside">
        <h1>Gestão de usuários por região</h1>
        <p>
          Cadastre, filtre e organize usuários presentes em uma ou mais regiões. A sessão expira
          após 30 minutos de inatividade.
        </p>
      </aside>

      <div className="login-page__form">
        <form className="card stack" onSubmit={handleSubmit} aria-label="Login">
          <h2>Entrar</h2>
          {sessionExpired && (
            <Alert tone="info">Sua sessão expirou por inatividade. Entre novamente.</Alert>
          )}
          {error && <Alert>{error}</Alert>}
          <TextField
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" loading={submitting || status === 'loading'}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
