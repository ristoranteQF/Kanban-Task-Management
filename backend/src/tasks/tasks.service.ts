import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Column } from '../boards/entities/column.entity';
import { Subtask } from '../subtasks/entities/subtask.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Column)
    private columnRepository: Repository<Column>,
    @InjectRepository(Subtask)
    private subtaskRepository: Repository<Subtask>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const column = await this.columnRepository.findOne({
      where: { id: createTaskDto.columnId },
      relations: ['board'],
    });

    if (!column || column.board.userId !== user.id) {
      throw new NotFoundException('Column not found');
    }

    const tasksCount = await this.taskRepository.count({ where: { columnId: column.id } });

    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      columnId: column.id,
      order: tasksCount,
    });

    const savedTask = await this.taskRepository.save(task);

    const subtasks = createTaskDto.subtasks.map((sub, index) =>
      this.subtaskRepository.create({
        title: sub.title,
        taskId: savedTask.id,
        order: index,
      })
    );

    await this.subtaskRepository.save(subtasks);

    return this.findOne(savedTask.id, user);
  }

  async findOne(id: string, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column', 'column.board', 'subtasks'],
      order: {
        subtasks: {
          order: 'ASC',
        },
      },
    });

    if (!task || task.column.board.userId !== user.id) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column', 'column.board', 'subtasks'],
    });

    if (!task || task.column.board.userId !== user.id) {
      throw new NotFoundException('Task not found');
    }

    const newColumn = await this.columnRepository.findOne({
      where: { id: updateTaskDto.columnId },
      relations: ['board'],
    });

    if (!newColumn || newColumn.board.userId !== user.id) {
      throw new NotFoundException('Column not found');
    }

    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.columnId = updateTaskDto.columnId;

    await this.taskRepository.save(task);

    // Handle subtasks
    const existingSubtaskIds = updateTaskDto.subtasks
      .filter(sub => sub.id)
      .map(sub => sub.id);

    const subtasksToDelete = task.subtasks.filter(
      sub => !existingSubtaskIds.includes(sub.id)
    );
    if (subtasksToDelete.length > 0) {
      await this.subtaskRepository.remove(subtasksToDelete);
    }

    for (let i = 0; i < updateTaskDto.subtasks.length; i++) {
      const subDto = updateTaskDto.subtasks[i];
      if (subDto.id) {
        await this.subtaskRepository.update(subDto.id, {
          title: subDto.title,
          order: i,
        });
      } else {
        const newSubtask = this.subtaskRepository.create({
          title: subDto.title,
          order: i,
          taskId: task.id,
        });
        await this.subtaskRepository.save(newSubtask);
      }
    }

    return this.findOne(id, user);
  }

  async move(id: string, moveTaskDto: MoveTaskDto, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column', 'column.board'],
    });

    if (!task || task.column.board.userId !== user.id) {
      throw new NotFoundException('Task not found');
    }

    const newColumn = await this.columnRepository.findOne({
      where: { id: moveTaskDto.columnId },
      relations: ['board'],
    });

    if (!newColumn || newColumn.board.userId !== user.id) {
      throw new NotFoundException('Column not found');
    }

    task.columnId = newColumn.id;
    await this.taskRepository.save(task);

    return this.findOne(id, user);
  }

  async remove(id: string, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['column', 'column.board'],
    });

    if (!task || task.column.board.userId !== user.id) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}