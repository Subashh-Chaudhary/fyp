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

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ length: 512, nullable: true })
  profile_image: string;

  @Column({ name: 'socialProvider', length: 50, nullable: true })
  social_provider: string;

  @Column({ name: 'socialId', length: 255, nullable: true })
  social_id: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ length: 255, nullable: true })
  verification_token: string;

  @Column({ name: 'password_reset_toke', length: 255, nullable: true })
  password_reset_token: string;

  @Column({ nullable: true })
  reset_token_expires: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
