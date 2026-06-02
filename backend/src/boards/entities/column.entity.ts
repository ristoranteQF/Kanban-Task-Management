import { Entity, PrimaryGeneratedColumn, Column as Col, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Board } from './board.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('columns')
export class Column {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Col()
  name: string;

  @Col({ default: 0 })
  order: number;

  @Col()
  color: string;

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: 'CASCADE' })
  board: Board;

  @Col()
  boardId: string;

  @OneToMany(() => Task, (task) => task.column, { cascade: true })
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}