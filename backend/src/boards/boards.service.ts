import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { Column } from './entities/column.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(Column)
    private columnRepository: Repository<Column>,
  ) {}

  async create(createBoardDto: CreateBoardDto, user: User) {
    const board = this.boardRepository.create({
      name: createBoardDto.name,
      userId: user.id,
    });

    const savedBoard = await this.boardRepository.save(board);

    const columns = createBoardDto.columns.map((col, index) => 
      this.columnRepository.create({
        name: col.name,
        color: col.color,
        order: index,
        boardId: savedBoard.id,
      })
    );

    await this.columnRepository.save(columns);

    return this.findOne(savedBoard.id, user);
  }

  async findAll(user: User) {
    return this.boardRepository.find({
      where: { userId: user.id },
      relations: ['columns', 'columns.tasks', 'columns.tasks.subtasks'],
      order: {
        createdAt: 'ASC',
        columns: {
          order: 'ASC',
          tasks: {
            order: 'ASC',
          },
        },
      },
    });
  }

  async findOne(id: string, user: User) {
    const board = await this.boardRepository.findOne({
      where: { id, userId: user.id },
      relations: ['columns', 'columns.tasks', 'columns.tasks.subtasks'],
      order: {
        columns: {
          order: 'ASC',
          tasks: {
            order: 'ASC',
            subtasks: {
              order: 'ASC',
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, user: User) {
    const board = await this.boardRepository.findOne({
      where: { id, userId: user.id },
      relations: ['columns'],
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    board.name = updateBoardDto.name;
    await this.boardRepository.save(board);

    // Handle columns
    const existingColumnIds = updateBoardDto.columns
      .filter(col => col.id)
      .map(col => col.id);

    // Delete columns that are not in the update
    const columnsToDelete = board.columns.filter(
      col => !existingColumnIds.includes(col.id)
    );
    if (columnsToDelete.length > 0) {
      await this.columnRepository.remove(columnsToDelete);
    }

    // Update or create columns
    for (let i = 0; i < updateBoardDto.columns.length; i++) {
      const colDto = updateBoardDto.columns[i];
      if (colDto.id) {
        // Update existing column
        await this.columnRepository.update(colDto.id, {
          name: colDto.name,
          color: colDto.color,
          order: i,
        });
      } else {
        // Create new column
        const newColumn = this.columnRepository.create({
          name: colDto.name,
          color: colDto.color,
          order: i,
          boardId: board.id,
        });
        await this.columnRepository.save(newColumn);
      }
    }

    return this.findOne(id, user);
  }

  async remove(id: string, user: User) {
    const board = await this.boardRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    await this.boardRepository.remove(board);
    return { message: 'Board deleted successfully' };
  }
}