import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  getStatus(): { status: string, timestamp: number } {
    return {
      status: 'ok',
      timestamp: Date.now(),
    };
  }
}