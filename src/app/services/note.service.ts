import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../store';

@Injectable({ providedIn: 'root' })
export class NoteService {
  readonly apiUrl = 'http://localhost:3000/api/notes'; // Adjust this to your backend API URL

  constructor(private readonly http: HttpClient) {}

  notesUrl(notebookId?: string | null): string {
    if (!notebookId) {
      return this.apiUrl;
    }
    const url = new URL(this.apiUrl);
    url.searchParams.set('notebookId', notebookId);
    return url.toString();
  }

  getNotes(notebookId?: string | null): Observable<Note[]> {
    return this.http.get<Note[]>(this.notesUrl(notebookId));
  }

  addNote(note: Partial<Note>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/${id}`, note);
  }

  toggleFavorite(id: string, isFavorite: boolean): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/favorite`, {
      isFavorite,
    });
  }

  deleteNote(id: string): Observable<Note> {
    return this.http.delete<Note>(`${this.apiUrl}/${id}`);
  }

  restoreNote(id: string): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}/restore`, {});
  }

  permanentlyDeleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/permanent`);
  }
}
