import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsVarifiedToReports1700000000005 implements MigrationInterface {
  name = 'AddIsVarifiedToReports1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reports" ADD COLUMN "is_varified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN IF EXISTS "is_varified"`);
  }
}
