import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Board, Task, CreateTaskRequest, UpdateTaskRequest } from '../../../../models/board.model';
import { TaskService } from '../../../../services/task.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnInit {
  @Input() board!: Board;
  @Input() task?: Task;
  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  taskForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      title: [this.task?.title || '', Validators.required],
      description: [this.task?.description || ''],
      columnId: [this.task?.columnId || this.board.columns[0]?.id, Validators.required],
      subtasks: this.fb.array([])
    });

    if (this.isEditMode && this.task) {
      this.task.subtasks.forEach(sub => {
        this.subtasks.push(this.createSubtask(sub.title, sub.id));
      });
    } else {
      // Add two empty subtasks by default
      this.subtasks.push(this.createSubtask());
      this.subtasks.push(this.createSubtask());
    }
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  createSubtask(title: string = '', id?: string): FormGroup {
    return this.fb.group({
      id: [id || null],
      title: [title, Validators.required]
    });
  }

  addSubtask(): void {
    this.subtasks.push(this.createSubtask());
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      
      if (this.isEditMode && this.task) {
        const updateData: UpdateTaskRequest = {
          ...this.taskForm.value,
          subtasks: this.taskForm.value.subtasks.filter((sub: any) => sub.title.trim())
        };
        
        this.taskService.updateTask(this.task.id, updateData).subscribe({
          next: () => {
            this.isLoading = false;
            this.taskCreated.emit();
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error updating task:', error);
          }
        });
      } else {
        const createData: CreateTaskRequest = {
          ...this.taskForm.value,
          subtasks: this.taskForm.value.subtasks
            .filter((sub: any) => sub.title.trim())
            .map((sub: any) => ({ title: sub.title }))
        };
        
        this.taskService.createTask(createData).subscribe({
          next: () => {
            this.isLoading = false;
            this.taskCreated.emit();
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error creating task:', error);
          }
        });
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }
}