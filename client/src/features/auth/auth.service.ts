import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  login(payload: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${environment.apiBase}/auth/login`, payload);
  }
  logout() { localStorage.removeItem('token'); }
}
