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
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatToolbarModule,
    MatChipsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTooltipModule
  ],
  template: `
    <!-- Toolbar -->
    <mat-toolbar color="warn">
      <mat-icon>admin_panel_settings</mat-icon>
      <span style="margin-left:8px; font-weight:600;">Admin Panel</span>
      <span style="flex:1"></span>
      <button mat-button (click)="goToDashboard()">
        <mat-icon>dashboard</mat-icon> Dashboard
      </button>
      <button mat-icon-button (click)="logout()" matTooltip="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div style="padding:24px; max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:20px;">

      <!-- Stats row -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:16px;">
        <div class="stat-card">
          <div class="stat-icon" style="background:#dbeafe;">
            <mat-icon style="color:#2563eb;">group</mat-icon>
          </div>
          <div>
            <div class="stat-value">{{ users.length }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#dcfce7;">
            <mat-icon style="color:#16a34a;">person_check</mat-icon>
          </div>
          <div>
            <div class="stat-value">{{ activeUsers }}</div>
            <div class="stat-label">Active Users</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#fee2e2;">
            <mat-icon style="color:#dc2626;">admin_panel_settings</mat-icon>
          </div>
          <div>
            <div class="stat-value">{{ adminCount }}</div>
            <div class="stat-label">Admins</div>
          </div>
        </div>
      </div>

      <!-- User Management Card -->
      <mat-card style="border-radius:12px;">
        <mat-card-header style="display:flex; justify-content:space-between; align-items:center; padding:16px 16px 0;">
          <mat-card-title>User Management</mat-card-title>
          <button mat-raised-button color="primary" (click)="toggleAddForm()">
            <mat-icon>{{ showAddForm ? 'close' : 'person_add' }}</mat-icon>
            {{ showAddForm ? 'Cancel' : 'Add User' }}
          </button>
        </mat-card-header>

        <mat-card-content style="padding:16px;">

          <!-- Add User Form -->
          <div *ngIf="showAddForm"
            style="padding:20px; background:#f8fafc; border-radius:10px;
                   margin-bottom:20px; border:1px solid #e2e8f0;">
            <h3 style="margin:0 0 16px; color:#1e293b; font-size:16px; font-weight:600;">
              Add New User
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px;">

              <mat-form-field appearance="outline">
                <mat-label>User ID</mat-label>
                <input matInput [(ngModel)]="newUser.userId" placeholder="e.g. user03">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput [(ngModel)]="newUser.name" placeholder="e.g. Alice Smith">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="newUser.email"
                  placeholder="alice@test.com" type="email">
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
              <button mat-stroked-button (click)="toggleAddForm()">Cancel</button>
            </div>
          </div>

          <!-- Loading Spinner -->
          <div *ngIf="isLoading"
            style="display:flex; flex-direction:column; align-items:center; padding:48px; gap:16px;">
            <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
            <p style="color:#64748b; font-size:13px;">Loading users...</p>
          </div>

          <!-- Users Table -->
          <table mat-table [dataSource]="users"
            *ngIf="!isLoading && users.length > 0" style="width:100%">

            <ng-container matColumnDef="userId">
              <th mat-header-cell *matHeaderCellDef>User ID</th>
              <td mat-cell *matCellDef="let user"><strong>{{ user.userId }}</strong></td>
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
                <span [style.background]="user.role === 'admin' ? '#fee2e2' : '#dbeafe'"
                  [style.color]="user.role === 'admin' ? '#991b1b' : '#1e40af'"
                  style="padding:3px 10px; border-radius:20px; font-size:12px; font-weight:500;">
                  {{ user.role }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let user">
                <span [style.background]="user.isActive !== false ? '#dcfce7' : '#f1f5f9'"
                  [style.color]="user.isActive !== false ? '#166534' : '#64748b'"
                  style="padding:3px 10px; border-radius:20px; font-size:12px; font-weight:500;">
                  {{ user.isActive !== false ? 'Active' : 'Inactive' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <!-- Toggle active/inactive -->
                <button mat-icon-button
                  [color]="user.isActive !== false ? 'primary' : 'warn'"
                  (click)="toggleStatus(user)"
                  [disabled]="user.role === 'admin'"
                  [matTooltip]="user.role === 'admin' ? 'Cannot modify admin'
                    : (user.isActive !== false ? 'Deactivate' : 'Activate')">
                  <mat-icon>
                    {{ user.isActive !== false ? 'toggle_on' : 'toggle_off' }}
                  </mat-icon>
                </button>
                <!-- Delete -->
                <button mat-icon-button color="warn"
                  (click)="deleteUser(user)"
                  [disabled]="user.role === 'admin'"
                  [matTooltip]="user.role === 'admin' ? 'Cannot delete admin' : 'Delete user'">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              style="transition:background 0.15s;"
              onmouseenter="this.style.background='#f8fafc'"
              onmouseleave="this.style.background=''">
            </tr>
          </table>

          <!-- Empty state -->
          <div *ngIf="!isLoading && users.length === 0"
            style="text-align:center; padding:48px; color:#64748b;">
            <mat-icon style="font-size:48px; width:48px; height:48px; color:#cbd5e1;">
              group_off
            </mat-icon>
            <p style="margin-top:8px;">No users found. Add one above!</p>
          </div>

        </mat-card-content>
      </mat-card>

    </div>
  `,
  styles: [`
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon mat-icon {
      font-size: 24px !important; width: 24px !important; height: 24px !important;
    }
    .stat-value { font-size: 28px; font-weight: 700; color: #1e293b; line-height: 1; }
    .stat-label { font-size: 13px; color: #64748b; margin-top: 4px; }
  `]
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  isAdding = false;
  showAddForm = false;
  displayedColumns = ['userId', 'name', 'email', 'role', 'status', 'actions'];

  // Computed stats
  get activeUsers() { return this.users.filter(u => u.isActive !== false).length; }
  get adminCount() { return this.users.filter(u => u.role === 'admin').length; }

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
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  addUser(): void {
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
        this.newUser = { userId: '', name: '', email: '', password: '', role: 'user' };
        this.snackBar.open('User created successfully!', 'Close', { duration: 2000 });
        this.loadUsers();
      },
      error: (err) => {
        this.isAdding = false;
        this.snackBar.open(err.error?.message || 'Failed to create user', 'Close', { duration: 3000 });
      }
    });
  }

  toggleStatus(user: User): void {
    const newStatus = user.isActive === false ? true : false;
    this.userService.updateUser(user._id!, { isActive: newStatus }).subscribe({
      next: () => {
        user.isActive = newStatus;
        this.cdr.detectChanges();
        this.snackBar.open(
          `${user.name} ${newStatus ? 'activated' : 'deactivated'}`,
          'Close', { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open('Update failed', 'Close', { duration: 2000 });
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

  goToDashboard(): void { this.router.navigate(['/dashboard']); }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}