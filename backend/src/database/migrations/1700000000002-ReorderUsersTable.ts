import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReorderUsersTable1700000000002 implements MigrationInterface {
  name = 'ReorderUsersTable1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Create a new table with the correct column order
    await queryRunner.query(`
      CREATE TABLE "users_new" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255),
        "phone" character varying(20),
        "address" text,
        "avatar_url" character varying(512),
        "is_verified" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "verification_token" character varying(64),
        "verification_expires_at" TIMESTAMP WITH TIME ZONE,
        "password_reset_token" character varying(64),
        "reset_token_expires_at" TIMESTAMP WITH TIME ZONE,
        "refresh_token" character varying(64),
        "refresh_token_expires_at" TIMESTAMP WITH TIME ZONE,
        "last_login_at" TIMESTAMP WITH TIME ZONE,
        "auth_provider" character varying(50),
        "provider_id" character varying(255),
        "is_admin" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_new_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_new" PRIMARY KEY ("id")
      )
    `);

    // Step 2: Copy data from the old table to the new table
    await queryRunner.query(`
      INSERT INTO "users_new" (
        "id", "name", "email", "password", "phone", "address", "avatar_url",
        "is_verified", "is_active", "verification_token", "verification_expires_at",
        "password_reset_token", "reset_token_expires_at", "refresh_token",
        "refresh_token_expires_at", "last_login_at", "auth_provider", "provider_id",
        "is_admin", "created_at", "updated_at"
      )
      SELECT
        "id", "name", "email", "password", "phone", "address", "avatar_url",
        "is_verified", "is_active", "verification_token", "verification_expires_at",
        "password_reset_token", "reset_token_expires_at", "refresh_token",
        "refresh_token_expires_at", "last_login_at", "auth_provider", "provider_id",
        "is_admin", "created_at", "updated_at"
      FROM "users"
    `);

    // Step 3: Drop the old table with CASCADE to handle foreign key constraints
    await queryRunner.query(`DROP TABLE "users" CASCADE`);

    // Step 4: Rename the new table to the original name
    await queryRunner.query(`ALTER TABLE "users_new" RENAME TO "users"`);

    // Step 5: Recreate indexes and constraints
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_verification_token" ON "users" ("verification_token") WHERE "verification_token" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_password_reset_token" ON "users" ("password_reset_token") WHERE "password_reset_token" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_refresh_token" ON "users" ("refresh_token") WHERE "refresh_token" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_auth_provider_provider_id" ON "users" ("auth_provider", "provider_id") WHERE "auth_provider" IS NOT NULL AND "provider_id" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert: Create the old table structure and restore data
    await queryRunner.query(`
      CREATE TABLE "users_old" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "is_verified" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "verification_token" character varying(64),
        "verification_expires_at" TIMESTAMP WITH TIME ZONE,
        "password_reset_token" character varying(64),
        "reset_token_expires_at" TIMESTAMP WITH TIME ZONE,
        "refresh_token" character varying(64),
        "refresh_token_expires_at" TIMESTAMP WITH TIME ZONE,
        "last_login_at" TIMESTAMP WITH TIME ZONE,
        "auth_provider" character varying(50),
        "provider_id" character varying(255),
        "is_admin" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255),
        "phone" character varying(20),
        "address" text,
        "avatar_url" character varying(512),
        CONSTRAINT "UQ_users_old_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_old" PRIMARY KEY ("id")
      )
    `);

    // Copy data back
    await queryRunner.query(`
      INSERT INTO "users_old" (
        "id", "is_verified", "is_active", "verification_token", "verification_expires_at",
        "password_reset_token", "reset_token_expires_at", "refresh_token",
        "refresh_token_expires_at", "last_login_at", "auth_provider", "provider_id",
        "is_admin", "created_at", "updated_at", "name", "email", "password", "phone",
        "address", "avatar_url"
      )
      SELECT
        "id", "is_verified", "is_active", "verification_token", "verification_expires_at",
        "password_reset_token", "reset_token_expires_at", "refresh_token",
        "refresh_token_expires_at", "last_login_at", "auth_provider", "provider_id",
        "is_admin", "created_at", "updated_at", "name", "email", "password", "phone",
        "address", "avatar_url"
      FROM "users"
    `);

    // Drop new table and rename old table back
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`ALTER TABLE "users_old" RENAME TO "users"`);

    // Recreate indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_verification_token" ON "users" ("verification_token") WHERE "verification_token" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_password_reset_token" ON "users" ("password_reset_token") WHERE "password_reset_token" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_refresh_token" ON "users" ("refresh_token") WHERE "refresh_token" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_auth_provider_provider_id" ON "users" ("auth_provider", "provider_id") WHERE "auth_provider" IS NOT NULL AND "provider_id" IS NOT NULL`,
    );
  }
}
