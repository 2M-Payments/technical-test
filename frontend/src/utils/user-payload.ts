import type { UserFormValues } from '../components/users/UserForm';
import type { UpdateUserPayload, User } from '../types/user';

/** Envia apenas o que mudou (PATCH), e a senha só quando preenchida. */
export function buildUpdatePayload(original: User, values: UserFormValues): UpdateUserPayload {
  const payload: UpdateUserPayload = {};
  if (values.name !== original.name) payload.name = values.name;
  if (values.email !== original.email) payload.email = values.email;
  if (values.status !== original.status) payload.status = values.status;
  if (values.password) payload.password = values.password;

  const originalCodes = original.regions.map((r) => r.code).sort();
  const newCodes = [...values.regionCodes].sort();
  if (originalCodes.join() !== newCodes.join()) payload.regionCodes = values.regionCodes;

  return payload;
}
