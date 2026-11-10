import { describe, expect, it } from 'vitest';

import { buildUpdatePayload } from '../utils/user-payload';
import { makeUser } from './fixtures';

describe('buildUpdatePayload', () => {
  const original = makeUser();
  const unchanged = {
    name: original.name,
    email: original.email,
    password: '',
    status: original.status,
    regionCodes: ['GB', 'BR'],
  };

  it('não envia nada quando nada mudou (ordem das regiões é irrelevante)', () => {
    expect(buildUpdatePayload(original, unchanged)).toEqual({});
  });

  it('envia apenas os campos alterados', () => {
    expect(
      buildUpdatePayload(original, { ...unchanged, status: 'INACTIVE', regionCodes: ['US'] }),
    ).toEqual({ status: 'INACTIVE', regionCodes: ['US'] });
  });

  it('envia a senha somente quando preenchida', () => {
    expect(buildUpdatePayload(original, { ...unchanged, password: 'nova-senha' })).toEqual({
      password: 'nova-senha',
    });
  });
});
