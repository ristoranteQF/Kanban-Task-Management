import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../models/board.model';
import { TaskService } from '../../../../services/task.service';
import { BoardService } from '../../../../services/board.service';
import { TaskModalComponent } from '../../task-modal/task-modal.component/task-modal.component';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskModalComponent],
  templateUrl: './task-detail-modal.component.html',
  styleUrls: ['./task-detail-modal.component.scss']
})
export class TaskDetailModalComponent {
  @Input() task!: Task;
  @Output() close = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<void>();

  showMenu = false;
  showEditModal = false;
  showDeleteConfirm = false;
  selectedColumnId: string = '';

  constructor(
    private taskService: TaskService,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.selectedColumnId = this.task.columnId;
  }

  get completedSubtasksCount(): number {
    return this.task.subtasks.filter(sub => sub.isCompleted).length;
  }

  get currentBoard() {
    return this.boardService.currentBoard;
  }

  toggleSubtask(subtaskId: string, isCompleted: boolean): void {
    this.taskService.toggleSubtask(subtaskId, { isCompleted }).subscribe(() => {
      const subtask = this.task.subtasks.find(s => s.id === subtaskId);
      if (subtask) {
        subtask.isCompleted = isCompleted;
      }
    });
  }

  // onStatusChange(columnId: string): void {
  //   if (columnId !== this.task.columnId) {
  //     this.taskService.moveTask(this.task.id, { columnId }).subscribe(() => {
  //       this.taskUpdated.emit();
  //     });
  //   }
  // }

  // task-detail-modal.component.ts

onStatusChange(columnId: string): void {
  // Verificăm dacă statusul chiar s-a schimbat
  if (columnId !== this.task.columnId) {
    
    // Apelăm serviciul
    this.taskService.moveTask(this.task.id, { columnId }).subscribe({
      next: (updatedTask: any) => {
        // 1. Actualizăm task-ul local cu cel venit din backend
        // Astfel, modalul știe că task-ul are acum noul status
        this.task = updatedTask;
        
        // 2. Ne asigurăm că dropdown-ul este sincronizat
        this.selectedColumnId = updatedTask.columnId;

        // 3. Emitem evenimentul pentru ca Baza (Board-ul din spate) să mute cardul vizual
        this.taskUpdated.emit();
      },
      error: (err) => {
        console.error('Error moving task:', err);
        // Opțional: Resetează dropdown-ul la valoarea veche în caz de eroare
        this.selectedColumnId = this.task.columnId;
      }
    });
  }
}

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  editTask(): void {
    this.showEditModal = true;
    this.showMenu = false;
  }

  deleteTask(): void {
    this.showDeleteConfirm = true;
    this.showMenu = false;
  }

  confirmDelete(): void {
    this.taskService.deleteTask(this.task.id).subscribe(() => {
      this.showDeleteConfirm = false;
      this.taskUpdated.emit();
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onTaskEdited(): void {
    this.showEditModal = false;
    this.taskUpdated.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}