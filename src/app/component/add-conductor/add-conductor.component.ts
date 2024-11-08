import { Component } from '@angular/core';
import { Conductor } from '../../model/conductor';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-conductor',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-conductor.component.html',
  styleUrl: './add-conductor.component.css'
})
export class AddConductorComponent {
  conductor: Conductor = {
    name: '',
    phoneNo: '',
    salary: ''
  };
  message: string = '';
  errorMessages: { [key: string]: string } = {};

  constructor(private service: AdminService) {}

  
  saveConductor() {
    // Reset messages before attempting to save
    this.message = '';
    this.errorMessages = {};
    const { id, ...conductorDataWithoutId } = this.conductor;  // Exclude 'id'
    this.service.saveConductor(conductorDataWithoutId).subscribe({
      next: (response) => {
        console.log('Conductor saved successfully', response);
        this.message = response.message;
        this.conductor.name='';
        this.conductor.phoneNo='';
        this.conductor.salary=''; 
      },
      error: (errorResponse) => {
        // Check if there are specific field errors returned from the backend
        if (errorResponse.error && typeof errorResponse.error === 'object') {
          this.errorMessages = errorResponse.error; // Assuming the backend returns an object with field errors
        } else if (errorResponse.status === 409) {
          // Handle specific case for phone number conflict
          this.errorMessages['phoneNo'] = 'Phone number already exists for another Conductor';
        } else {
          this.errorMessages['general'] = errorResponse.error || 'An unexpected error occurred'; // Fallback for unexpected errors
        }
        this.message = ''; // Clear the success message
      }
    });
  }
}
