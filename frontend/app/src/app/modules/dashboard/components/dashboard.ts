import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService, ProjectRecord } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';
@Component({
  selector: 'app-dashboard',
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
      next: (res: any) => {
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