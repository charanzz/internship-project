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
  description?: string;
  accessLevel?: string;
}

export interface RecordsResponse {
  records: ProjectRecord[];
  total: number;
  accessLevel: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<{ users: User[]; total: number }> {
    return this.http.get<{ users: User[]; total: number }>(this.apiUrl);
  }

  getMyProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/me`);
  }

  getRecords(): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(`${this.apiUrl}/records`);
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