import axios from 'axios';

export const SESSION_EXPIRES_HEADER = 'x-session-expires-at';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});

type Listener<T = void> = (payload: T) => void;

const unauthorizedListeners = new Set<Listener>();
const sessionRenewedListeners = new Set<Listener<string>>();

/** Notificado quando a API responde 401 (sessão expirada ou inexistente). */
export function onUnauthorized(listener: Listener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

/** Notificado a cada resposta que renova a sessão, com a nova data de expiração. */
export function onSessionRenewed(listener: Listener<string>): () => void {
  sessionRenewedListeners.add(listener);
  return () => sessionRenewedListeners.delete(listener);
}

api.interceptors.response.use(
  (response) => {
    const expiresAt = response.headers[SESSION_EXPIRES_HEADER] as string | undefined;
    if (expiresAt) sessionRenewedListeners.forEach((listener) => listener(expiresAt));
    return response;
  },
  (error: unknown) => {
    const isLoginRequest = axios.isAxiosError(error) && error.config?.url?.includes('/auth/login');
    if (axios.isAxiosError(error) && error.response?.status === 401 && !isLoginRequest) {
      unauthorizedListeners.forEach((listener) => listener());
    }
    return Promise.reject(error);
  },
);

interface ApiErrorBody {
  message?: string;
  issues?: Array<{ path: string; message: string }>;
  details?: { emails?: string[]; regionCodes?: string[] };
}

const getErrorBody = (error: unknown): ApiErrorBody | undefined =>
  axios.isAxiosError<ApiErrorBody>(error) ? error.response?.data : undefined;

/** Mensagem amigável para exibir ao usuário a partir de um erro da API. */
export function getErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
  if (axios.isAxiosError(error) && !error.response) {
    return 'Não foi possível conectar à API.';
  }

  const body = getErrorBody(error);
  if (!body?.message) return fallback;

  const extra = body.details?.emails ?? body.details?.regionCodes;
  return extra?.length ? `${body.message}: ${extra.join(', ')}` : body.message;
}

/** Erros de validação do Zod indexados pelo caminho do campo (ex.: "email", "users.1.email"). */
export function getFieldErrors(error: unknown): Record<string, string> {
  const issues = getErrorBody(error)?.issues ?? [];
  return issues.reduce<Record<string, string>>((acc, issue) => {
    acc[issue.path] ??= issue.message;
    return acc;
  }, {});
}
