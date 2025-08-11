import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTokenFields1700000000001 implements MigrationInterface {
  name = 'UpdateTokenFields1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update Users table - only alter columns that exist
    try {
      await queryRunner.query(`
        ALTER TABLE "users"
        ALTER COLUMN "verification_token" TYPE VARCHAR(64),
        ALTER COLUMN "verification_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "password_reset_token" TYPE VARCHAR(64),
        ALTER COLUMN "reset_token_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "refresh_token" TYPE VARCHAR(64),
        ALTER COLUMN "refresh_token_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "last_login_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE;
      `);
    } catch (error) {
      console.log(
        'Users table columns already updated or table structure different:',
        error instanceof Error ? error.message : String(error),
      );
    }

    // Update Experts table
    await queryRunner.query(`
      ALTER TABLE "experts"
      ALTER COLUMN "verification_token" TYPE VARCHAR(64),
      ALTER COLUMN "verification_token_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
      ALTER COLUMN "password_reset_token" TYPE VARCHAR(64),
      ALTER COLUMN "reset_token_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
      ALTER COLUMN "refresh_token" TYPE VARCHAR(64),
      ALTER COLUMN "refresh_token_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
      ALTER COLUMN "last_login_at" TYPE TIMESTAMP WITH TIME ZONE,
      ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE,
      ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE;
    `);

    // Add indexes for Users table
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_verification_token"
      ON "users" ("verification_token")
      WHERE "verification_token" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_password_reset_token"
      ON "users" ("password_reset_token")
      WHERE "password_reset_token" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_refresh_token"
      ON "users" ("refresh_token")
      WHERE "refresh_token" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_auth_provider_provider_id"
      ON "users" ("auth_provider", "provider_id")
      WHERE "auth_provider" IS NOT NULL AND "provider_id" IS NOT NULL;
    `);

    // Add indexes for Experts table
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_experts_verification_token"
      ON "experts" ("verification_token")
      WHERE "verification_token" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_experts_password_reset_token"
      ON "experts" ("password_reset_token")
      WHERE "password_reset_token" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_experts_refresh_token"
      ON "experts" ("refresh_token")
      WHERE "refresh_token" IS NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_experts_auth_provider_provider_id"
      ON "experts" ("auth_provider", "provider_id")
      WHERE "auth_provider" IS NOT NULL AND "provider_id" IS NOT NULL;
    `);

    // Add comments to Users table
    await queryRunner.query(`
      COMMENT ON COLUMN "users"."verification_token" IS 'Secure verification token for email verification';
      COMMENT ON COLUMN "users"."verification_expires_at" IS 'Expiration time for verification token';
      COMMENT ON COLUMN "users"."password_reset_token" IS 'Secure password reset token';
      COMMENT ON COLUMN "users"."reset_token_expires_at" IS 'Expiration time for password reset token';
      COMMENT ON COLUMN "users"."refresh_token" IS 'Secure refresh token for JWT refresh';
      COMMENT ON COLUMN "users"."refresh_token_expires_at" IS 'Expiration time for refresh token';
      COMMENT ON COLUMN "users"."last_login_at" IS 'Last successful login timestamp';
      COMMENT ON COLUMN "users"."auth_provider" IS 'Authentication provider (google, facebook, etc.)';
      COMMENT ON COLUMN "users"."provider_id" IS 'Provider-specific user ID';
      COMMENT ON COLUMN "users"."created_at" IS 'User creation timestamp';
      COMMENT ON COLUMN "users"."updated_at" IS 'Last update timestamp';
    `);

    // Add comments to Experts table
    await queryRunner.query(`
      COMMENT ON COLUMN "experts"."verification_token" IS 'Secure verification token for email verification';
      COMMENT ON COLUMN "experts"."verification_token_expires_at" IS 'Expiration time for verification token';
      COMMENT ON COLUMN "experts"."password_reset_token" IS 'Secure password reset token';
      COMMENT ON COLUMN "experts"."reset_token_expires_at" IS 'Expiration time for password reset token';
      COMMENT ON COLUMN "experts"."refresh_token" IS 'Secure refresh token for JWT refresh';
      COMMENT ON COLUMN "experts"."refresh_token_expires_at" IS 'Expiration time for refresh token';
      COMMENT ON COLUMN "experts"."last_login_at" IS 'Last successful login timestamp';
      COMMENT ON COLUMN "experts"."auth_provider" IS 'Authentication provider (google, facebook, etc.)';
      COMMENT ON COLUMN "experts"."provider_id" IS 'Provider-specific user ID';
      COMMENT ON COLUMN "experts"."created_at" IS 'Expert creation timestamp';
      COMMENT ON COLUMN "experts"."updated_at" IS 'Last update timestamp';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes for Users table
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_users_verification_token";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_users_password_reset_token";`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_refresh_token";`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_users_auth_provider_provider_id";`,
    );

    // Remove indexes for Experts table
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_experts_verification_token";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_experts_password_reset_token";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_experts_refresh_token";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_experts_auth_provider_provider_id";`,
    );

    // Revert Users table column types
    try {
      await queryRunner.query(`
        ALTER TABLE "users"
        ALTER COLUMN "verification_token" TYPE VARCHAR(255),
        ALTER COLUMN "verification_expires_at" TYPE TIMESTAMP,
        ALTER COLUMN "password_reset_token" TYPE VARCHAR(255),
        ALTER COLUMN "reset_token_expires_at" TYPE TIMESTAMP,
        ALTER COLUMN "refresh_token" TYPE VARCHAR(255),
        ALTER COLUMN "refresh_token_expires_at" TYPE TIMESTAMP,
        ALTER COLUMN "last_login_at" TYPE TIMESTAMP,
        ALTER COLUMN "created_at" TYPE TIMESTAMP,
        ALTER COLUMN "updated_at" TYPE TIMESTAMP;
      `);
    } catch (error) {
      console.log(
        'Users table columns already reverted or table structure different:',
        error instanceof Error ? error.message : String(error),
      );
    }

    // Revert Experts table column types
    await queryRunner.query(`
      ALTER TABLE "experts"
      ALTER COLUMN "verification_token" TYPE VARCHAR(255),
      ALTER COLUMN "verification_token_expires_at" TYPE TIMESTAMP,
      ALTER COLUMN "password_reset_token" TYPE VARCHAR(255),
              ALTER COLUMN "reset_token_expires_at" TYPE TIMESTAMP,
      ALTER COLUMN "refresh_token" TYPE VARCHAR(255),
      ALTER COLUMN "refresh_token_expires_at" TYPE TIMESTAMP,
      ALTER COLUMN "last_login_at" TYPE TIMESTAMP,
      ALTER COLUMN "created_at" TYPE TIMESTAMP,
      ALTER COLUMN "updated_at" TYPE TIMESTAMP;
    `);
  }
}
