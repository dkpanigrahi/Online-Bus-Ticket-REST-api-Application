import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../../../services/authservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Note the correct property name 'styleUrls'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthserviceService, private router: Router) {}

  ngOnInit(): void {
    // Check if user is logged in and redirect accordingly
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin-home']);
      } else if (role === 'ROLE_USER') {
        this.router.navigate(['/user-home']);
      }
    }
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin-home']);
        } else {
          this.router.navigate(['/user-home']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
