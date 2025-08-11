import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReorderExpertsTable1700000000000 implements MigrationInterface {
  name = 'ReorderExpertsTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Create a new table with the correct column order
    await queryRunner.query(`
      CREATE TABLE "experts_new" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255),
        "phone" character varying(20),
        "address" text,
        "avatar_url" character varying(512),
        "qualification" text,
        "qualification_docs" character varying(512),
        "is_verified" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "verification_token" character varying(255),
        "verification_token_expires_at" TIMESTAMP,
        "password_reset_token" character varying(255),
        "reset_token_expires" TIMESTAMP,
        "refresh_token" character varying(255),
        "refresh_token_expires_at" TIMESTAMP,
        "last_login_at" TIMESTAMP,
        "auth_provider" character varying(50),
        "provider_id" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_experts_new_email" UNIQUE ("email"),
        CONSTRAINT "PK_experts_new" PRIMARY KEY ("id")
      )
    `);

    // Step 2: Copy data from the old table to the new table
    await queryRunner.query(`
      INSERT INTO "experts_new" (
        "id", "name", "email", "password", "phone", "address", "avatar_url",
        "qualification", "qualification_docs", "is_verified", "is_active",
        "verification_token", "verification_token_expires_at", "password_reset_token",
        "reset_token_expires", "refresh_token", "refresh_token_expires_at",
        "last_login_at", "auth_provider", "provider_id", "created_at", "updated_at"
      )
      SELECT
        "id", "name", "email", "password", "phone", "address", "avatar_url",
        "qualification", "qualification_docs", "is_verified", "is_active",
        "verification_token", "verification_token_expires_at", "password_reset_token",
        "reset_token_expires", "refresh_token", "refresh_token_expires_at",
        "last_login_at", "auth_provider", "provider_id", "created_at", "updated_at"
      FROM "experts"
    `);

    // Step 3: Drop the old table with CASCADE to handle foreign key constraints
    await queryRunner.query(`DROP TABLE "experts" CASCADE`);

    // Step 4: Rename the new table to the original name
    await queryRunner.query(`ALTER TABLE "experts_new" RENAME TO "experts"`);

    // Step 5: Recreate indexes and constraints
    await queryRunner.query(
      `CREATE INDEX "IDX_experts_email" ON "experts" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_experts_is_verified" ON "experts" ("is_verified")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_experts_is_active" ON "experts" ("is_active")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: Create the old table structure and restore data
    await queryRunner.query(`
      CREATE TABLE "experts_old" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "is_verified" boolean NOT NULL DEFAULT false,
        "reset_token_expires" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255),
        "phone" character varying(20),
        "address" text,
        "avatar_url" character varying(512),
        "qualification" text,
        "qualification_docs" character varying(512),
        "is_active" boolean NOT NULL DEFAULT true,
        "verification_token" character varying(255),
        "verification_token_expires_at" TIMESTAMP,
        "password_reset_token" character varying(255),
        "refresh_token" character varying(255),
        "refresh_token_expires_at" TIMESTAMP,
        "last_login_at" TIMESTAMP,
        "auth_provider" character varying(50),
        "provider_id" character varying(255),
        CONSTRAINT "UQ_experts_old_email" UNIQUE ("email"),
        CONSTRAINT "PK_experts_old" PRIMARY KEY ("id")
      )
    `);

    // Copy data back
    await queryRunner.query(`
      INSERT INTO "experts_old" (
        "id", "is_verified", "reset_token_expires", "created_at", "updated_at",
        "name", "email", "password", "phone", "address", "avatar_url",
        "qualification", "qualification_docs", "is_active", "verification_token",
        "verification_token_expires_at", "password_reset_token", "refresh_token",
        "refresh_token_expires_at", "last_login_at", "auth_provider", "provider_id"
      )
      SELECT
        "id", "is_verified", "reset_token_expires", "created_at", "updated_at",
        "name", "email", "password", "phone", "address", "avatar_url",
        "qualification", "qualification_docs", "is_active", "verification_token",
        "verification_token_expires_at", "password_reset_token", "refresh_token",
        "refresh_token_expires_at", "last_login_at", "auth_provider", "provider_id"
      FROM "experts"
    `);

    // Drop new table and rename old table back
    await queryRunner.query(`DROP TABLE "experts"`);
    await queryRunner.query(`ALTER TABLE "experts_old" RENAME TO "experts"`);

    // Recreate indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_experts_email" ON "experts" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_experts_is_verified" ON "experts" ("is_verified")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_experts_is_active" ON "experts" ("is_active")`,
    );
  }
}
