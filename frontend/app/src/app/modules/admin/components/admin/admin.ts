import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <!-- Top Toolbar -->
    <mat-toolbar color="warn">
      <mat-icon>admin_panel_settings</mat-icon>
      <span style="margin-left:8px; font-weight:600;">Admin Panel</span>
      <span style="flex:1"></span>
      <button mat-button (click)="goToDashboard()">
        <mat-icon>dashboard</mat-icon> Dashboard
      </button>
      <button mat-icon-button (click)="logout()" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div style="padding:24px; max-width:1200px; margin:0 auto;">
      <mat-card>

        <!-- Card Header with Add User button -->
        <mat-card-header style="display:flex; justify-content:space-between; align-items:center; padding-bottom:16px;">
          <div>
            <mat-card-title>User Management</mat-card-title>
            <mat-card-subtitle>Total: {{ users.length }} users</mat-card-subtitle>
          </div>
          <button mat-raised-button color="primary" (click)="toggleAddForm()">
            <mat-icon>{{ showAddForm ? 'close' : 'person_add' }}</mat-icon>
            {{ showAddForm ? 'Cancel' : 'Add User' }}
          </button>
        </mat-card-header>

        <mat-card-content>

          <!-- Add User Form -->
          <div *ngIf="showAddForm"
            style="padding:20px; background:#f8fafc; border-radius:8px;
                   margin-bottom:20px; border:1px solid #e2e8f0;">
            <h3 style="margin:0 0 16px; color:#1e293b; font-size:16px;">
              Add New User
            </h3>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px;">

              <mat-form-field appearance="outline">
                <mat-label>User ID</mat-label>
                <input matInput [(ngModel)]="newUser.userId" placeholder="e.g. user03">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput [(ngModel)]="newUser.name" placeholder="e.g. Alice">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="newUser.email"
                  placeholder="e.g. alice@test.com" type="email">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Password</mat-label>
                <input matInput [(ngModel)]="newUser.password"
                  placeholder="Min 6 chars" type="password">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Role</mat-label>
                <mat-select [(ngModel)]="newUser.role">
                  <mat-option value="user">General User</mat-option>
                  <mat-option value="admin">Admin</mat-option>
                </mat-select>
              </mat-form-field>

            </div>
            <div style="display:flex; gap:12px; margin-top:8px;">
              <button mat-raised-button color="primary"
                (click)="addUser()" [disabled]="isAdding">
                <mat-icon>save</mat-icon>
                {{ isAdding ? 'Saving...' : 'Save User' }}
              </button>
              <button mat-button (click)="toggleAddForm()">
                Cancel
              </button>
            </div>
          </div>

          <!-- Loading Spinner -->
          <div *ngIf="isLoading"
            style="display:flex; justify-content:center; padding:40px;">
            <mat-progress-spinner mode="indeterminate" diameter="48">
            </mat-progress-spinner>
          </div>

          <!-- Users Table -->
          <table mat-table [dataSource]="users"
            *ngIf="!isLoading && users.length > 0" style="width:100%">

            <ng-container matColumnDef="userId">
              <th mat-header-cell *matHeaderCellDef>User ID</th>
              <td mat-cell *matCellDef="let user">
                <strong>{{ user.userId }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let user">{{ user.name }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{ user.email }}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip
                  [color]="user.role === 'admin' ? 'warn' : 'primary'"
                  selected>
                  {{ user.role }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let user">
                <mat-chip color="accent" selected>
                  {{ user.isActive !== false ? 'Active' : 'Inactive' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button color="warn"
                  (click)="deleteUser(user)"
                  [disabled]="user.role === 'admin'"
                  title="{{ user.role === 'admin' ? 'Cannot delete admin' : 'Delete user' }}">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <!-- No users message -->
          <p *ngIf="!isLoading && users.length === 0"
            style="text-align:center; padding:40px; color:#64748b;">
            No users found. Add one above!
          </p>

        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mat-column-actions {
      width: 80px;
      text-align: center;
    }
    tr.mat-row:hover {
      background: #f8fafc;
    }
  `]
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  isAdding = false;
  showAddForm = false;
  displayedColumns = ['userId', 'name', 'email', 'role', 'status', 'actions'];

  // New user form model
  newUser = {
    userId: '',
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.loadUsers(), 0);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    // Reset form when closing
    if (!this.showAddForm) {
      this.newUser = { userId: '', name: '', email: '', password: '', role: 'user' };
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  addUser(): void {
    // Validate all fields
    if (!this.newUser.userId || !this.newUser.name ||
        !this.newUser.email || !this.newUser.password) {
      this.snackBar.open('Please fill all fields', 'Close', { duration: 2000 });
      return;
    }

    if (this.newUser.password.length < 6) {
      this.snackBar.open('Password must be at least 6 characters', 'Close', { duration: 2000 });
      return;
    }

    this.isAdding = true;

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.isAdding = false;
        this.showAddForm = false;
        // Reset form
        this.newUser = { userId: '', name: '', email: '', password: '', role: 'user' };
        this.snackBar.open('User created successfully!', 'Close', { duration: 2000 });
        // Reload users list
        this.loadUsers();
      },
      error: (err) => {
        this.isAdding = false;
        this.snackBar.open(
          err.error?.message || 'Failed to create user',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService.deleteUser(user._id!).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== user._id);
          this.cdr.detectChanges();
          this.snackBar.open(`${user.name} deleted`, 'Close', { duration: 2000 });
        },
        error: () => {
          this.snackBar.open('Delete failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}