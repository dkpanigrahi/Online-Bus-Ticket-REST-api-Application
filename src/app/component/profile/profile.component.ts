import { Component } from '@angular/core';
import { Profile } from '../../model/profile';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

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

  constructor(private adminService: AdminService) { }

  ngOnInit():void{
    this.loadProfile();
  }

  loadProfile(): void {
    this.adminService.getDashboard().subscribe({
      next: (profileData: Profile) => {
        this.profile = profileData;
      },
      error: (error) => {
        console.error('Error loading profile data', error);
      }
    });
  }
}
