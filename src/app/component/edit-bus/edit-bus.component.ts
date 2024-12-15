import { Component } from '@angular/core';
import { Bus } from '../../model/bus';
import { Driver } from '../../model/driver';
import { Conductor } from '../../model/conductor';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-bus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-bus.component.html',
  styleUrls: ['./edit-bus.component.css']
})
export class EditBusComponent {
  busDto: Bus = {
    id: 0,
    busNo: '',
    startPlace: '',
    destination: '',
    departureTime: '',
    coach: '',
    totalSeats: 0,
    ticketPrice: 0,
    availableEveryDay: true,
    specificDays: [],
    driverId: 0,
    conductorId: 0
  };

  selectedBusId: number = 0;
  message: string = '';
  errorMessages: { [key: string]: string } = {};

  driverList: Driver[] = [];
  conductorList: Conductor[] = [];

  constructor(private service: AdminService, private route: ActivatedRoute) {
    // Get selectedBusId from the route
    const busIdParam = this.route.snapshot.paramMap.get('busId');
    this.selectedBusId = busIdParam ? +busIdParam : 0;
  }

  ngOnInit() {
    if (this.selectedBusId) {
      this.getBusById(this.selectedBusId);
    }
    this.loadDrivers();
    this.loadConductors();
  }

  loadDrivers() {
    this.service.getDrivers().subscribe({
      next: (drivers: Driver[]) => {
        console.log('Drivers loaded:', drivers);
        this.driverList = drivers;
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
      }
    });
  }

  loadConductors() {
    this.service.getConductors().subscribe({
      next: (conductors: Conductor[]) => {
        console.log('Conductors loaded:', conductors);
        this.conductorList = conductors;
      },
      error: (error) => {
        console.error('Error loading conductors:', error);
      }
    });
  }

  getBusById(id: number) {
    this.service.getBusById(id).subscribe({
      next: (bus: Bus) => {
        console.log('Bus details loaded:', bus);
        this.busDto = bus;
      },
      error: (error) => {
        console.error('Error loading bus details:', error);
      }
    });
  }

  onSubmit() {
    const { id, ...busDataWithoutId } = this.busDto;
    busDataWithoutId.driverId = parseInt(busDataWithoutId.driverId.toString(), 10);
    busDataWithoutId.conductorId = parseInt(busDataWithoutId.conductorId.toString(), 10);

    busDataWithoutId.departureTime = this.convertTo12HourFormat(this.busDto.departureTime);

    console.log('Submitting bus data:', busDataWithoutId);
    this.service.createBus(busDataWithoutId).subscribe({
      next: (response) => {
        console.log('Bus saved successfully:', response);
        this.message = response.message;

        // Reset form
        this.resetForm();
      },
      error: (errorResponse) => {
        console.error('Error saving bus:', errorResponse);

        // Clear previous success message
        this.message = '';

        // Handle specific validation errors
        if (errorResponse.status === 400 && errorResponse.error) {
          this.errorMessages = errorResponse.error;
        } else {
          this.errorMessages['general'] = 'An unexpected error occurred.';
        }
      }
    });
  }

  toggleSpecificDay(day: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.busDto.specificDays.includes(day)) {
        this.busDto.specificDays.push(day);
      }
    } else {
      this.busDto.specificDays = this.busDto.specificDays.filter(d => d !== day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.busDto.specificDays.includes(day);
  }

  convertTo12HourFormat(time: string): string {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'pm' : 'am';

    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${suffix}`;
  }

  resetForm() {
    this.busDto = {
      id: 0,
      busNo: '',
      startPlace: '',
      destination: '',
      departureTime: '',
      coach: '',
      totalSeats: 0,
      ticketPrice: 0,
      availableEveryDay: true,
      specificDays: [],
      driverId: 0,
      conductorId: 0
    };
    this.errorMessages = {};
  }
}
