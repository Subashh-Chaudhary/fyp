import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  publish_date: Date | null;

  @Column({ type: 'text', nullable: true })
  category: string | null;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  url: string | null;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ name: 'last_updated', type: 'timestamp with time zone' })
  last_updated: Date;
}
