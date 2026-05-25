import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Hardcoded URL — no environment file needed
  private apiUrl = 'http://localhost:5000/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin(): boolean { return this.currentUserSubject.value?.role === 'admin'; }
  getCurrentUser(): User | null { return this.currentUserSubject.value; }
}