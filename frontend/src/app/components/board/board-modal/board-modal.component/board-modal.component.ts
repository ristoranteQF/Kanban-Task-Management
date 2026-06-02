import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../../../../models/board.model';
import { BoardService } from '../../../../services/board.service'; 

@Component({
  selector: 'app-board-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './board-modal.component.html',
  styleUrls: ['./board-modal.component.scss']
})
export class BoardModalComponent implements OnInit {
  @Input() board?: Board;
  @Input() isEditMode = false;
  @Output() close = new EventEmitter<void>();
  @Output() boardCreated = new EventEmitter<void>();

  boardForm!: FormGroup;
  isLoading = false;

  availableColors = [
    '#49C4E5',
    '#8471F2',
    '#67E2AE',
    '#EA5555',
    '#FFA500',
    '#FF69B4'
  ];

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.boardForm = this.fb.group({
      name: [this.board?.name || '', Validators.required],
      columns: this.fb.array([])
    });

    if (this.isEditMode && this.board) {
      this.board.columns.forEach(col => {
        this.columns.push(this.createColumn(col.name, col.color, col.id));
      });
    } else {
      // Add default columns for new board
      this.columns.push(this.createColumn('Todo', this.availableColors[0]));
      this.columns.push(this.createColumn('Doing', this.availableColors[1]));
    }
  }

  get columns(): FormArray {
    return this.boardForm.get('columns') as FormArray;
  }

  createColumn(name: string = '', color: string = this.availableColors[0], id?: string): FormGroup {
    return this.fb.group({
      id: [id || null],
      name: [name, Validators.required],
      color: [color, Validators.required]
    });
  }

  addColumn(): void {
    const colorIndex = this.columns.length % this.availableColors.length;
    this.columns.push(this.createColumn('', this.availableColors[colorIndex]));
  }

  removeColumn(index: number): void {
    this.columns.removeAt(index);
  }

  onSubmit(): void {
    if (this.boardForm.valid) {
      this.isLoading = true;
      
      if (this.isEditMode && this.board) {
        const updateData: UpdateBoardRequest = this.boardForm.value;
        this.boardService.updateBoard(this.board.id, updateData).subscribe({
          next: () => {
            this.isLoading = false;
            this.boardCreated.emit();
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error updating board:', error);
          }
        });
      } else {
        const createData: CreateBoardRequest = {
          name: this.boardForm.value.name,
          columns: this.boardForm.value.columns.map((col: any) => ({
            name: col.name,
            color: col.color
          }))
        };
        
        this.boardService.createBoard(createData).subscribe({
          next: () => {
            this.isLoading = false;
            this.boardCreated.emit();
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error creating board:', error);
          }
        });
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }
}