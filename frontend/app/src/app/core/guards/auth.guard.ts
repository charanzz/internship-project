// Guards decide whether a user can access a route
// This guard blocks non-logged-in users from seeing protected pages
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;  // Allow navigation
    }
    // Redirect to login if not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}