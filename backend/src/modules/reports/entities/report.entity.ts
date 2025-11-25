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
import { Crops } from '../../crops/entities/crop.entity';
import { Diseases } from '../../diseases/entities/disease.entity';
import { Solutions } from '../../solutions/entities/solution.entity';

@Entity('reports')
@Index(['user'])
@Index(['crop'])
@Index(['disease'])
@Index(['solution'])
export class Reports {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: Users | null;

  @ManyToOne(() => Crops, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'crop_id' })
  crop: Crops;

  @ManyToOne(() => Diseases, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'disease_id' })
  disease: Diseases;

  @ManyToOne(() => Solutions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'solution_id' })
  solution: Solutions | null;

  @Column('uuid', { nullable: true })
  feedback_id: string | null;

  @Column({ type: 'text', nullable: true })
  report_url: string | null;

  @Column({ type: 'boolean', default: false })
  is_varified: boolean;

  @Column({ type: 'float', nullable: true })
  confidence: number | null;

  @Column({ type: 'text', nullable: true })
  severity: string | null;

  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  generated_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
