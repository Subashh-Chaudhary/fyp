import { MigrationInterface, QueryRunner } from 'typeorm';

export class RelaxCropsNulls1700000000004 implements MigrationInterface {
  name = 'RelaxCropsNulls1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crops" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "crops" ALTER COLUMN "disease_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "crops" ALTER COLUMN "disease_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "crops" ALTER COLUMN "user_id" SET NOT NULL`,
    );
  }
}
