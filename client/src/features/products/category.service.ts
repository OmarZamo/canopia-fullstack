import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Category { id: number; name: string; }

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  list() { return this.http.get<Category[]>(`${environment.apiBase}/categories`); }
}
