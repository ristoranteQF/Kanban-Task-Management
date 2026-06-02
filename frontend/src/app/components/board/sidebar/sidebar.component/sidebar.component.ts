import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Board } from '../../../../models/board.model';  
import { BoardService } from '../../../../services/board.service';
import { AuthService } from '../../../../services/auth.service';
import { BoardModalComponent } from '../../board-modal/board-modal.component/board-modal.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, BoardModalComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() boards: Board[] = [];
  @Input() currentBoard: Board | null = null;
  @Output() toggleSidebar = new EventEmitter<void>();

  showBoardModal = false;
  isDarkMode = false;

  constructor(
    private boardService: BoardService,
    private authService: AuthService
  ) {}

  selectBoard(board: Board): void {
    this.boardService.setCurrentBoard(board.id);
  }

  openCreateBoardModal(): void {
    this.showBoardModal = true;
  }

  closeBoardModal(): void {
    this.showBoardModal = false;
  }

  onBoardCreated(): void {
    this.showBoardModal = false;
    this.boardService.loadBoards().subscribe();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  logout(): void {
    this.authService.logout();
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}