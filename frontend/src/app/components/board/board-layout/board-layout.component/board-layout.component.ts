// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { BoardService } from '../../../../services/board.service';
// import { AuthService } from '../../../../services/auth.service';
// import { SidebarComponent } from '../../sidebar/sidebar.component/sidebar.component';
// import { HeaderComponent } from '../../header/header.component/header.component';
// import { BoardViewComponent } from '../../board-view/board-view.component/board-view.component';
// import { Board } from '../../../../models/board.model';

// @Component({
//   selector: 'app-board-layout',
//   standalone: true,
//   imports: [CommonModule, SidebarComponent, HeaderComponent, BoardViewComponent],
//   templateUrl: './board-layout.component.html',
//   styleUrls: ['./board-layout.component.scss']
// })
// export class BoardLayoutComponent implements OnInit {
//   isSidebarOpen = true;
//   currentBoard: Board | null = null;

//   constructor(
//     public boardService: BoardService,
//     private authService: AuthService
//   ) {}

//   ngOnInit(): void {
//     this.boardService.loadBoards().subscribe();
//     this.boardService.currentBoard$.subscribe(board => {
//       this.currentBoard = board;
//     });
//   }

//   toggleSidebar(): void {
//     this.isSidebarOpen = !this.isSidebarOpen;
//   }
// }



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../../../services/board.service';
import { AuthService } from '../../../../services/auth.service';
import { SidebarComponent } from '../../sidebar/sidebar.component/sidebar.component';
import { HeaderComponent } from '../../header/header.component/header.component';
import { BoardViewComponent } from '../../board-view/board-view.component/board-view.component';
import { Board } from '../../../../models/board.model';

@Component({
  selector: 'app-board-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, BoardViewComponent],
  templateUrl: './board-layout.component.html',
  styleUrls: ['./board-layout.component.scss']
})
export class BoardLayoutComponent implements OnInit {
  isSidebarOpen = true;
  currentBoard: Board | null = null;

  constructor(
    public boardService: BoardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.boardService.loadBoards().subscribe();
    
    // This subscription handles Sidebar clicks
    this.boardService.currentBoard$.subscribe(board => {
      this.currentBoard = board;
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // 4. ADD THIS FUNCTION: This does the actual work
  refreshCurrentBoard(): void {
    if (this.currentBoard) {
      // Fetch the fresh board data from the API
      this.boardService.getBoard(this.currentBoard.id).subscribe(updatedBoard => {
        // FORCE the update. This new object will flow down to <app-board-view>
        this.currentBoard = updatedBoard;
      });
    }
  }
  
  // Optional: If you implemented board deletion earlier
  onBoardDeleted(): void {
    this.boardService.loadBoards().subscribe(boards => {
       // Logic to select the first board or clear selection
    });
  }
}