import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Board, CreateBoardRequest, UpdateBoardRequest } from '../models/board.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private boardsSubject = new BehaviorSubject<Board[]>([]);
  public boards$ = this.boardsSubject.asObservable();

  private currentBoardSubject = new BehaviorSubject<Board | null>(null);
  public currentBoard$ = this.currentBoardSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${environment.apiUrl}/boards`)
      .pipe(
        tap(boards => {
          this.boardsSubject.next(boards);
          if (boards.length > 0 && !this.currentBoardSubject.value) {
            this.setCurrentBoard(boards[0].id);
          }
        })
      );
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${environment.apiUrl}/boards/${id}`)
      .pipe(
        tap(board => this.currentBoardSubject.next(board))
      );
  }

  setCurrentBoard(boardId: string): void {
    this.getBoard(boardId).subscribe();
  }

  createBoard(data: CreateBoardRequest): Observable<Board> {
    return this.http.post<Board>(`${environment.apiUrl}/boards`, data)
      .pipe(
        tap(board => {
          const boards = [...this.boardsSubject.value, board];
          this.boardsSubject.next(boards);
          this.currentBoardSubject.next(board);
        })
      );
  }

  updateBoard(id: string, data: UpdateBoardRequest): Observable<Board> {
    return this.http.patch<Board>(`${environment.apiUrl}/boards/${id}`, data)
      .pipe(
        tap(updatedBoard => {
          const boards = this.boardsSubject.value.map(b => 
            b.id === id ? updatedBoard : b
          );
          this.boardsSubject.next(boards);
          if (this.currentBoardSubject.value?.id === id) {
            this.currentBoardSubject.next(updatedBoard);
          }
        })
      );
  }

  deleteBoard(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/boards/${id}`)
      .pipe(
        tap(() => {
          const boards = this.boardsSubject.value.filter(b => b.id !== id);
          this.boardsSubject.next(boards);
          if (this.currentBoardSubject.value?.id === id) {
            this.currentBoardSubject.next(boards.length > 0 ? boards[0] : null);
          }
        })
      );
  }

  get currentBoard(): Board | null {
    return this.currentBoardSubject.value;
  }

  get boards(): Board[] {
    return this.boardsSubject.value;
  }
}