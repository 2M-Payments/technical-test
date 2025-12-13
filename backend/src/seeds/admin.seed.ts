import { AppDataSource } from '../config/datasource';
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(User);

  const email = 'admin@admin.com';

  const exists = await repo.findOne({ where: { email } });

  if (exists) {
    console.log('⏭ Admin já existe (por convenção de email)');
    await AppDataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = repo.create({
    phone: '0000000000',
    
    email: email,
    password: passwordHash,
    name: 'Administrador',
    company: 'Sistema',
  });

  await repo.save(admin);

  console.log('✔ Usuário admin criado');
  console.log('📧 email:', email);
  console.log('🔑 senha: admin123');

  await AppDataSource.destroy();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro ao criar admin', err);
    process.exit(1);
  });
