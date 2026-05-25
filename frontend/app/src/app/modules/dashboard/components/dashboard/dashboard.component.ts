import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService, ProjectRecord } from '../../../../core/services/user.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  records: ProjectRecord[] = [];
  isLoadingRecords = false;
  displayedColumns = ['id', 'title', 'status', 'priority', 'assignee', 'date'];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadRecords();
  }

  loadRecords(): void {
    this.isLoadingRecords = true;
    this.userService.getRecords().subscribe({
      next: (res) => {
        this.records = res.records;
        this.isLoadingRecords = false;
      },
      error: () => {
        this.isLoadingRecords = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'Active': 'primary',
      'Pending': 'warn',
      'Completed': 'accent'
    };
    return colors[status] || 'default';
  }
}