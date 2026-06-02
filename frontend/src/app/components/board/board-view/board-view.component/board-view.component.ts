import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board, Task, Column } from '../../../../models/board.model';
import { TaskCardComponent } from '../../task-card/task-card.component/task-card.component';
import { BoardModalComponent } from '../../board-modal/board-modal.component/board-modal.component';
import { TaskService } from '../../../../services/task.service';
import { BoardService } from '../../../../services/board.service';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, TaskCardComponent, BoardModalComponent],
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss']
})
export class BoardViewComponent {
  @Input() board!: Board;
  showEditBoardModal = false;

  @Output() boardRefreshRequested = new EventEmitter<void>();

  constructor(
    private taskService: TaskService,
    private boardService: BoardService
  ) {}


  getColumnIds(): string[] {
    return this.board.columns.map(col => `column-${col.id}`);
  }

  getCompletedSubtasksCount(task: Task): number {
    return task.subtasks.filter(sub => sub.isCompleted).length;
  }

  openEditBoardModal(): void {
    this.showEditBoardModal = true;
  }

  closeEditBoardModal(): void {
    this.showEditBoardModal = false;
  }

  onBoardUpdated(): void {
    this.showEditBoardModal = false;
    this.refreshBoard();
  }

  // refreshBoard(): void {
  //   this.boardService.getBoard(this.board.id).subscribe();
  // }


  refreshBoard(): void {
    this.boardRefreshRequested.emit();
  }
}