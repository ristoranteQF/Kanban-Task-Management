import { IsNotEmpty, IsUUID } from 'class-validator';

export class MoveTaskDto {
  @IsUUID()
  @IsNotEmpty()
  columnId: string;
}