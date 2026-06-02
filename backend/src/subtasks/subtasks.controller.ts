import { Controller, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SubtasksService } from './subtasks.service';
import { ToggleSubtaskDto } from './dto/toggle-subtask.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subtasks')
@UseGuards(JwtAuthGuard)
export class SubtasksController {
  constructor(private readonly subtasksService: SubtasksService) {}

  @Patch(':id/toggle')
  toggle(@Param('id') id: string, @Body() toggleSubtaskDto: ToggleSubtaskDto, @Request() req) {
    return this.subtasksService.toggle(id, toggleSubtaskDto, req.user);
  }
}