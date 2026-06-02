import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSubtaskDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  columnId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSubtaskDto)
  subtasks: UpdateSubtaskDto[];
}