import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  oldPassword: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private service: UserService) {}

  changePassword() {
    this.service.changePassword(this.oldPassword, this.newPassword).subscribe(
      (response) => {
        console.log('Password changed successfully:', response);
        this.successMessage = "PassWord Changed Successfully";
        this.oldPassword = '';
        this.newPassword = '';
      },
      (error) => {
        console.error('Error changing password:', error);
        this.errorMessage = error.error.error;
      }
    );
  }
}
