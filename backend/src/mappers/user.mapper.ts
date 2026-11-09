import type { UserStatus } from '../entities/user-status.enum';
import type { User } from '../entities/user.entity';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  regions: Array<{ code: string; name: string }>;
  createdAt: Date;
  updatedAt: Date;
}

/** Contrato público do usuário: nunca expõe o hash de senha. */
export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    regions: (user.regions ?? [])
      .map(({ code, name }) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
