import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

export interface ProjectRecord {
  id: number;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  // Hardcoded URL — no environment file needed
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<{ users: User[]; total: number }> {
    return this.http.get<{ users: User[]; total: number }>(this.apiUrl);
  }

  getMyProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`);
  }

  getRecords(): Observable<{ records: ProjectRecord[]; total: number }> {
    return this.http.get<{ records: ProjectRecord[]; total: number }>(`${this.apiUrl}/records`);
  }

  createUser(userData: Partial<User> & { password: string }): Observable<any> {
    return this.http.post(this.apiUrl, userData);
  }

  updateUser(id: string, userData: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}