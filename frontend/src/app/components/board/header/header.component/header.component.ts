import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board } from '../../../../models/board.model';
import { TaskModalComponent } from '../../task-modal/task-modal.component/task-modal.component';
import { BoardModalComponent } from '../../board-modal/board-modal.component/board-modal.component';
import { BoardService } from '../../../../services/board.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TaskModalComponent, BoardModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() currentBoard: Board | null = null;
  @Input() isSidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  showTaskModal = false;
  showBoardMenu = false;
  showEditBoardModal = false;
  showDeleteConfirm = false;

  constructor(
    private boardService: BoardService,
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  openAddTaskModal(): void {
    if (this.currentBoard && this.currentBoard.columns.length > 0) {
      this.showTaskModal = true;
    }
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
  }

  onTaskCreated(): void {
    this.showTaskModal = false;
    if (this.currentBoard) {
      this.boardService.getBoard(this.currentBoard.id).subscribe();
    }
  }

  toggleBoardMenu(): void {
    this.showBoardMenu = !this.showBoardMenu;
  }

  editBoard(): void {
    this.showEditBoardModal = true;
    this.showBoardMenu = false;
  }

  deleteBoard(): void {
    this.showDeleteConfirm = true;
    this.showBoardMenu = false;
  }

  confirmDelete(): void {
    if (this.currentBoard) {
      this.boardService.deleteBoard(this.currentBoard.id).subscribe(() => {
        this.showDeleteConfirm = false;
      });
    }
  }

  closeBoardModal(): void {
    this.showEditBoardModal = false;
  }

  onBoardUpdated(): void {
    this.showEditBoardModal = false;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}