import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Diseases } from '../../diseases/entities/disease.entity';

@Entity('solutions')
export class Solutions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Diseases, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'disease_id' })
  disease: Diseases;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
