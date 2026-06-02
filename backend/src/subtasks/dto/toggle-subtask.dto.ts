import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleSubtaskDto {
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;
}