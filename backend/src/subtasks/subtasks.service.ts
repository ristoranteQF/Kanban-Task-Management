import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtask } from './entities/subtask.entity';
import { ToggleSubtaskDto } from './dto/toggle-subtask.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectRepository(Subtask)
    private subtaskRepository: Repository<Subtask>,
  ) {}

  async toggle(id: string, toggleSubtaskDto: ToggleSubtaskDto, user: User) {
    const subtask = await this.subtaskRepository.findOne({
      where: { id },
      relations: ['task', 'task.column', 'task.column.board'],
    });

    if (!subtask || subtask.task.column.board.userId !== user.id) {
      throw new NotFoundException('Subtask not found');
    }

    subtask.isCompleted = toggleSubtaskDto.isCompleted;
    return this.subtaskRepository.save(subtask);
  }
}