import { Component } from '@angular/core';
import { Driver } from '../../model/driver';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'] // Corrected styleUrl to styleUrls
})
export class AddDriverComponent {
  
  driver: Driver = {
    name: '',
    phoneno: '',
    salary: ''
  };
  
  message: string = '';
  errorMessages: { [key: string]: string } = {};

  constructor(private service: AdminService) {}

  saveDriver() {
    // Reset messages before attempting to save
    this.message = '';
    this.errorMessages = {};

    this.service.saveDriver(this.driver).subscribe({
      next: (response) => {
        console.log('Driver saved successfully', response);
        this.message = response.message; 
      },
      error: (errorResponse) => {
        // Check if there are specific field errors returned from the backend
        if (errorResponse.error && typeof errorResponse.error === 'object') {
          this.errorMessages = errorResponse.error; // Assuming the backend returns an object with field errors
        } else if (errorResponse.status === 409) {
          // Handle specific case for phone number conflict
          this.errorMessages['phoneno'] = 'Phone number already exists for another driver';
        } else {
          this.errorMessages['general'] = errorResponse.error || 'An unexpected error occurred'; // Fallback for unexpected errors
        }
        this.message = ''; // Clear the success message
      }
    });
  }
}
