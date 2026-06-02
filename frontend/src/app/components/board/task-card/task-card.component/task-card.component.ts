import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../models/board.model';
import { TaskDetailModalComponent } from '../../task-detail-modal/task-detail-modal.component/task-detail-modal.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, TaskDetailModalComponent],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() completedCount = 0;
  @Input() totalCount = 0;
  @Output() taskUpdated = new EventEmitter<void>();

  showDetailModal = false;

  openDetailModal(): void {
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
  }

  onTaskUpdated(): void {
    this.showDetailModal = false;
    this.taskUpdated.emit();
  }

  
}