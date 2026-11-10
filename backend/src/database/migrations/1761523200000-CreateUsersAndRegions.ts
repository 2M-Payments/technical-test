import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndRegions1761523200000 implements MigrationInterface {
  name = 'CreateUsersAndRegions1761523200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`regions\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`code\` varchar(2) NOT NULL,
        \`name\` varchar(100) NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`UQ_regions_code\` (\`code\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(120) NOT NULL,
        \`email\` varchar(180) NOT NULL,
        \`password_hash\` varchar(255) NOT NULL,
        \`status\` enum('ACTIVE', 'INACTIVE', 'PENDING') NOT NULL DEFAULT 'ACTIVE',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`UQ_users_email\` (\`email\`),
        INDEX \`IDX_users_status\` (\`status\`),
        INDEX \`IDX_users_created_at\` (\`created_at\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`user_regions\` (
        \`user_id\` varchar(36) NOT NULL,
        \`region_id\` int NOT NULL,
        INDEX \`IDX_user_regions_user_id\` (\`user_id\`),
        INDEX \`IDX_user_regions_region_id\` (\`region_id\`),
        PRIMARY KEY (\`user_id\`, \`region_id\`),
        CONSTRAINT \`FK_user_regions_user_id\` FOREIGN KEY (\`user_id\`)
          REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`FK_user_regions_region_id\` FOREIGN KEY (\`region_id\`)
          REFERENCES \`regions\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `user_regions`');
    await queryRunner.query('DROP TABLE `users`');
    await queryRunner.query('DROP TABLE `regions`');
  }
}
