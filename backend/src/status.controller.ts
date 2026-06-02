// status.controller.ts
import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status') // Endpoint is now /status
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  getServerStatus(): { status: string, timestamp: number } {
    return this.statusService.getStatus();
  }
}