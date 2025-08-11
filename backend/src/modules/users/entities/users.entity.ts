import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 512, nullable: true })
  avatar_url: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({ length: 255, nullable: true })
  verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  verification_expires_at: Date;

  @Column({ length: 255, nullable: true })
  password_reset_token: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires: Date;

  @Column({ length: 255, nullable: true })
  refresh_token: string;

  @Column({ type: 'timestamp', nullable: true })
  refresh_token_expires_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @Column({ length: 50, nullable: true })
  auth_provider: string;

  @Column({ length: 255, nullable: true })
  provider_id: string;

  @Column({ default: false })
  is_admin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
