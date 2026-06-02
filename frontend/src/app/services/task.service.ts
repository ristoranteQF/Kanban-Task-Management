import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  MoveTaskRequest,
  ToggleSubtaskRequest 
} from '../models/board.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(@Inject(HttpClient) private http: HttpClient) {}

  createTask(data: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${environment.apiUrl}/tasks`, data);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${environment.apiUrl}/tasks/${id}`);
  }

  updateTask(id: string, data: UpdateTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${environment.apiUrl}/tasks/${id}`, data);
  }

  moveTask(id: string, data: MoveTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${environment.apiUrl}/tasks/${id}/move`, data);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/tasks/${id}`);
  }

  toggleSubtask(subtaskId: string, data: ToggleSubtaskRequest): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/subtasks/${subtaskId}/toggle`, data);
  }
}