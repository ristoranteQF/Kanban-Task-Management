import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { User } from './auth/entities/user.entity';
import { Board } from './boards/entities/board.entity';
import { Column as BoardColumn } from './boards/entities/column.entity';
import { Task } from './tasks/entities/task.entity';
import { Subtask } from './subtasks/entities/subtask.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'kanban_db',
      entities: [User, Board, BoardColumn, Task, Subtask],
      synchronize: true, // Set to false in production,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }),
    AuthModule,
    BoardsModule,
    TasksModule,
    SubtasksModule,
  ],
})
export class AppModule {}