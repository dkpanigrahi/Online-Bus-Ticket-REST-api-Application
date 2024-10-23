import { Component } from '@angular/core';
import { Profile } from '../../model/profile';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { AuthserviceService } from '../../../services/authservice.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  profile: Profile = {
    name: '',
    email: '',
    role: '',
    phoneNo: '',
  };
  isAdmin: boolean = false;

  constructor(private adminService: AdminService, 
              private authService: AuthserviceService,
              private userService: UserService) { }

  ngOnInit():void{
    const role = this.authService.getRole();
    this.isAdmin = role === 'ROLE_ADMIN'; 
    this.loadProfile();
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
    }else{
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
}
