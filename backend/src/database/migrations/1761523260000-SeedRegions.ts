import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Regiões são dados de referência, por isso são inseridas via migration. */
const REGIONS: ReadonlyArray<readonly [code: string, name: string]> = [
  ['BR', 'Brasil'],
  ['GB', 'Reino Unido'],
  ['US', 'Estados Unidos'],
  ['PT', 'Portugal'],
  ['AR', 'Argentina'],
  ['CA', 'Canadá'],
  ['DE', 'Alemanha'],
  ['ES', 'Espanha'],
  ['FR', 'França'],
  ['JP', 'Japão'],
];

export class SeedRegions1761523260000 implements MigrationInterface {
  name = 'SeedRegions1761523260000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const placeholders = REGIONS.map(() => '(?, ?)').join(', ');
    await queryRunner.query(
      `INSERT INTO \`regions\` (\`code\`, \`name\`) VALUES ${placeholders}`,
      REGIONS.flat(),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const codes = REGIONS.map(([code]) => code);
    await queryRunner.query(
      `DELETE FROM \`regions\` WHERE \`code\` IN (${codes.map(() => '?').join(', ')})`,
      codes,
    );
  }
}
