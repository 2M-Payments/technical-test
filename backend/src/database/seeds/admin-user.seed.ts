import bcrypt from 'bcryptjs';
import { In, type DataSource } from 'typeorm';
import { z } from 'zod';

import { Region } from '../../entities/region.entity';
import { UserStatus } from '../../entities/user-status.enum';
import { User } from '../../entities/user.entity';

const adminSchema = z.object({
  ADMIN_NAME: z.string().min(3).default('Administrador'),
  ADMIN_EMAIL: z.string().trim().toLowerCase().email().default('admin@crud.dev'),
  ADMIN_PASSWORD: z.string().min(8).default('Admin@123'),
});

/** Cria (de forma idempotente) o usuário usado para o primeiro login. */
export async function seedAdminUser(dataSource: DataSource): Promise<void> {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = adminSchema.parse(process.env);
  const usersRepository = dataSource.getRepository(User);

  if (await usersRepository.existsBy({ email: ADMIN_EMAIL })) {
    console.info(`Usuário ${ADMIN_EMAIL} já existe, nada a fazer.`);
    return;
  }

  const regions = await dataSource.getRepository(Region).findBy({ code: In(['BR', 'GB']) });

  await usersRepository.save(
    usersRepository.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      status: UserStatus.ACTIVE,
      regions,
    }),
  );

  console.info(`Usuário administrador criado: ${ADMIN_EMAIL}`);
}
