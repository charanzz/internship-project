import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatChipsModule
  ],
  template: `
    <mat-toolbar color="warn">
      <mat-icon>admin_panel_settings</mat-icon>
      <span style="margin-left:8px;">Admin Panel</span>
      <span style="flex:1"></span>
      <button mat-button (click)="goToDashboard()">
        <mat-icon>dashboard</mat-icon> Dashboard
      </button>
      <button mat-icon-button (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div style="padding:24px; max-width:1200px; margin:0 auto;">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Management</mat-card-title>
          <mat-card-subtitle>Total: {{ users.length }} users</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>

          <div *ngIf="isLoading"
            style="display:flex; justify-content:center; padding:40px;">
            <mat-progress-spinner mode="indeterminate" diameter="48">
            </mat-progress-spinner>
          </div>

          <table mat-table [dataSource]="users"
            *ngIf="!isLoading && users.length > 0" style="width:100%">

            <ng-container matColumnDef="userId">
              <th mat-header-cell *matHeaderCellDef>User ID</th>
              <td mat-cell *matCellDef="let user">{{ user.userId }}</td>
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

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button color="warn"
                  (click)="deleteUser(user)"
                  [disabled]="user.role === 'admin'">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <p *ngIf="!isLoading && users.length === 0"
            style="text-align:center; padding:40px; color:#666;">
            No users found.
          </p>

        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  displayedColumns = ['userId', 'name', 'email', 'role', 'actions'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef  // ← fixes the ExpressionChanged error
  ) {}

  ngOnInit(): void {
    // setTimeout pushes loading outside Angular's change detection cycle
    setTimeout(() => this.loadUsers(), 0);
  }

  loadUsers(): void {
    this.isLoading = true;
    this.cdr.detectChanges();  // tell Angular to update NOW

    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users;
        this.isLoading = false;
        this.cdr.detectChanges();  // update again after data arrives
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Delete ${user.name}?`)) {
      this.userService.deleteUser(user._id!).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== user._id);
          this.cdr.detectChanges();
          this.snackBar.open('User deleted', 'Close', { duration: 2000 });
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