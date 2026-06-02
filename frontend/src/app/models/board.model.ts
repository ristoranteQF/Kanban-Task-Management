export interface Board {
  id: string;
  name: string;
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  order: number;
  tasks: Task[];
  boardId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  order: number;
  columnId: string;
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  order: number;
  taskId: string;
}

export interface CreateBoardRequest {
  name: string;
  columns: CreateColumnRequest[];
}

export interface CreateColumnRequest {
  name: string;
  color: string;
}

export interface UpdateBoardRequest {
  name: string;
  columns: UpdateColumnRequest[];
}

export interface UpdateColumnRequest {
  id?: string;
  name: string;
  color: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  columnId: string;
  subtasks: CreateSubtaskRequest[];
}

export interface CreateSubtaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  columnId: string;
  subtasks: UpdateSubtaskRequest[];
}

export interface UpdateSubtaskRequest {
  id?: string;
  title: string;
}

export interface MoveTaskRequest {
  columnId: string;
}

export interface ToggleSubtaskRequest {
  isCompleted: boolean;
}