import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Bus } from '../../model/bus';
import { Driver } from '../../model/driver'; // Adjust import based on your project structure
import { Conductor } from '../../model/conductor'; // Adjust import based on your project structure

@Component({
  selector: 'app-add-bus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-bus.component.html',
  styleUrls: ['./add-bus.component.css']
})
export class AddBusComponent implements OnInit {

  busDto: Bus = {
    id:0,
    busNo: '',
    startPlace: '',
    destination: '',
    departureTime: '',
    totalSeats: 0,
    ticketPrice: 0,
    availableEveryDay: true,
    specificDays: [],
    driverId: 0,
    conductorId: 0
  };
  
  message: string = '';
  errorMessages: { [key: string]: string } = {};
  
  driverList: Driver[] = [];  
  conductorList: Conductor[] = [];

  constructor(private service: AdminService) {}

  ngOnInit() {
    this.loadDrivers();
    this.loadConductors();
  }

  loadDrivers() {
    this.service.getDrivers().subscribe({
        next: (drivers: Driver[]) => {
            console.log('Drivers:', drivers); // Check what is received
            this.driverList = drivers;
        },
        error: (error) => {
            console.error('Error loading drivers', error);
        }
    });
}

loadConductors() {
  this.service.getConductors().subscribe({
      next: (conductors: any[]) => {
          console.log('Original Conductors:', conductors); // Check the original response
          this.conductorList = conductors.map(conductor => ({
              id: conductor.id,
              name: conductor.user.name,
              email: conductor.user.email,
              password: conductor.user.password,
              phoneNo: conductor.user.phoneno, 
              salary: conductor.salary
          }));
          console.log('Transformed Conductors:', this.conductorList); 
      },
      error: (error) => {
          console.error('Error loading conductors', error);
      }
  });
}



  onSubmit() {
    const { id, ...busDataWithoutId } = this.busDto;
    busDataWithoutId.driverId = parseInt(busDataWithoutId.driverId.toString(), 10);
    busDataWithoutId.conductorId = parseInt(busDataWithoutId.conductorId.toString(), 10);

    // Convert the departureTime to 12-hour format
    busDataWithoutId.departureTime = this.convertTo12HourFormat(this.busDto.departureTime);
    console.log('Bus Without Id..',busDataWithoutId);
    this.service.createBus(busDataWithoutId).subscribe({
      next: (response) => {
        console.log('Bus saved successfully', response);
        this.message = response.message;
      },
      error: (errorResponse) => {
        console.error('Error:', errorResponse);
  
        // Clear any previous success message
        this.message = '';
  
        // Handle specific validation errors from the backend (if any)
        if (errorResponse.status === 400) {
          if (errorResponse.error && typeof errorResponse.error === 'object') {
            this.errorMessages = errorResponse.error;  // Assuming the backend returns field-specific error messages
          } else {
            this.errorMessages['general'] = 'Invalid input data. Please check your form values.';
          }
        } else {
          this.errorMessages['general'] = 'An unexpected error occurred.';
        }
      }
    });
  }

  // Helper function to toggle specific days
  toggleSpecificDay(day: string, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (!this.busDto.specificDays.includes(day)) {
        this.busDto.specificDays.push(day);
      }
    } else {
      this.busDto.specificDays = this.busDto.specificDays.filter(d => d !== day);
    }
  }

  // Check if the day is selected
  isDaySelected(day: string): boolean {
    return this.busDto.specificDays.includes(day);
  }

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'pm' : 'am';
  
    hour = hour % 12 || 12;  // Convert 24-hour time to 12-hour time
    return `${hour}:${minutes} ${suffix}`;
  }
  
}