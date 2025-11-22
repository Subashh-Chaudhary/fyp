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
import { Reports } from '../reports/entities/report.entity';
import { Experts } from '../expert/entities/expert.entity';

@Entity('feedbacks')
@Index(['report'])
@Index(['expert'])
export class Feedbacks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Reports, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'report_id' })
  report: Reports;

  @ManyToOne(() => Experts, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'expert_id' })
  expert: Experts;

  @Column({ type: 'text' })
  feedback_text: string;

  @Column({ type: 'timestamp with time zone', default: () => 'now()' })
  varified_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
