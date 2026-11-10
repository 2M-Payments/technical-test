export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface SessionResponse {
  user: AuthUser;
  /** ISO 8601 */
  expiresAt: string | null;
}
