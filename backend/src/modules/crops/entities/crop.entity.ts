import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';

@Entity('crops')
@Index(['user'])
@Index(['disease_id'])
export class Crops {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE', eager: false, nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ length: 512 })
  image_url: string;

  @Column('uuid', { nullable: true })
  disease_id: string | null;

  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  scanned_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
