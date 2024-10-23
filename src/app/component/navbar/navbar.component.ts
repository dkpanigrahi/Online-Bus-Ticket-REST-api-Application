import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthserviceService } from '../../../services/authservice.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { Profile } from '../../model/profile'; // Adjust this path according to your structure
import { AdminService } from '../../../services/admin.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, CommonModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Corrected styleUrls
})
export class NavbarComponent implements OnInit, OnDestroy {
  
  profile: Profile = {
    name: '',
    email: '',
    role: '',
    phoneNo: '',
  };
  
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private authService: AuthserviceService, 
              private router: Router, 
              private adminService: AdminService,
              private userService:UserService) { }

  ngOnInit(): void {
    // Subscribe to the login status observable
    this.subscription = this.authService.getLoginStatus().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (this.isLoggedIn) {
        const role = this.authService.getRole();
        this.isAdmin = role === 'ROLE_ADMIN'; // Use 'ROLE_ADMIN' to match the stored role
        this.loadProfile(); // Load the profile data when logged in
      } else {
        this.isAdmin = false;
      }
    });
  }

  loadProfile(): void {
    if(this.isAdmin){
      this.adminService.getDashboard().subscribe({
        next: (profileData: Profile) => {
          this.profile = profileData;
        },
        error: (error) => {
          console.error('Error loading profile data', error);
        }
      });
    } else{
      this.userService.getDashboard().subscribe({
        next: (profileData: Profile) => {
          this.profile = profileData;
        },
        error: (error) => {
          console.error('Error loading profile data', error);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
