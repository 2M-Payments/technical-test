import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserStatus } from './user-status.enum';
import { Region } from './region.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Index('UQ_users_email', { unique: true })
  @Column({ type: 'varchar', length: 180 })
  email: string;

  /** Nunca é carregado por padrão; use `addSelect` quando precisar autenticar. */
  @Column({ name: 'password_hash', type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Index('IDX_users_status')
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  /** Um usuário pode estar em mais de uma região (ex.: Brasil e Reino Unido). */
  @ManyToMany(() => Region, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'user_regions',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'region_id', referencedColumnName: 'id' },
  })
  regions: Region[];

  @Index('IDX_users_created_at')
  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;
}
