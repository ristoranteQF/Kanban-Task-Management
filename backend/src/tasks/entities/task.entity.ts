import { Entity, PrimaryGeneratedColumn, Column as Col, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Column } from '../../boards/entities/column.entity';
import { Subtask } from '../../subtasks/entities/subtask.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Col()
  title: string;

  @Col({ type: 'text', nullable: true })
  description: string;

  @Col({ default: 0 })
  order: number;

  @ManyToOne(() => Column, (column) => column.tasks, { onDelete: 'CASCADE' })
  column: Column;

  @Col()
  columnId: string;

  @OneToMany(() => Subtask, (subtask) => subtask.task, { cascade: true })
  subtasks: Subtask[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}