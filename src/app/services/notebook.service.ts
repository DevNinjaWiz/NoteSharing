import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notebook } from '../store';

@Injectable({ providedIn: 'root' })
export class NotebookService {
  readonly apiUrl = 'http://localhost:3000/api/notebooks';

  constructor(private readonly http: HttpClient) {}

  getNotebooks(): Observable<Notebook[]> {
    return this.http.get<Notebook[]>(this.apiUrl);
  }
}
