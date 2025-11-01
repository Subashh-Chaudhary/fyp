import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCropsTable1700000000003 implements MigrationInterface {
  name = 'CreateCropsTable1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "crops" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "image_url" character varying(512) NOT NULL,
        "disease_id" uuid NOT NULL,
        "scanned_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_crops" PRIMARY KEY ("id"),
        CONSTRAINT "FK_crops_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_crops_disease" FOREIGN KEY ("disease_id") REFERENCES "diseases"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_crops_user_id" ON "crops" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_crops_disease_id" ON "crops" ("disease_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_crops_disease_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_crops_user_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "crops"`);
  }
}