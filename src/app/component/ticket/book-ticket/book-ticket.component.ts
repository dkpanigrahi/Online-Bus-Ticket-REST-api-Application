import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Busresponse } from '../../../model/busresponse';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent {
  busId: number;
  date: string;
  seatMap: { [key: number]: boolean } = {};
  selectedSeatsArray: number[] = [];
  passengerNames: string[] = [];
  busDetails: Busresponse = {
    id: 0,
    busNo: '',
    startPlace: '',
    destination: '',
    departureTime: '',
    totalSeats: 0,
    ticketPrice: 0,
    driverName: '',
    conductorName: '',
    availableEveryDay: true,
    specificDays: [],
  };
  totalPrice: number = 0;
  message: string = '';
  errorMessages: { [key: string]: string } = {};

  constructor(private route: ActivatedRoute, private service: UserService, private router: Router) {
    this.busId = +this.route.snapshot.paramMap.get('busId')!;
    this.date = this.route.snapshot.paramMap.get('date')!;
  }

  ngOnInit(): void {
    this.loadSeat();
    this.loadBusDetails();
  }

  loadSeat() {
    this.service.getSeatAvailability(this.busId, this.date).subscribe({
      next: (response) => {
        this.seatMap = response;
      },
      error: (error) => {
        console.log("An error occurred loading the seats: " + error);
      }
    });
  }

  loadBusDetails() {
    this.service.getBusById(this.busId).subscribe({
      next: (bus) => {
        this.busDetails = bus;
      },
      error: (error) => {
        console.log("Error loading bus details: " + error);
      }
    });
  }

  // Method to get seat keys for the template
  getSeatKeys(): number[] {
    return Object.keys(this.seatMap).map(key => +key);
  }

  // Toggle seat selection and directly update the selectedSeatsArray
  toggleSeatSelection(seatNumber: number) {
    const seatIndex = this.selectedSeatsArray.indexOf(seatNumber);

    if (seatIndex === -1) {
      this.selectedSeatsArray.push(seatNumber);
    } else {
      this.selectedSeatsArray.splice(seatIndex, 1);
    }

    this.passengerNames = Array(this.selectedSeatsArray.length).fill('');
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.totalPrice = this.selectedSeatsArray.length * this.busDetails.ticketPrice;
  }

  isAllPassengerNamesFilled(): boolean {
    return this.passengerNames.every(name => name.trim() !== '');
  }

  bookTicket() {
    if (!this.isAllPassengerNamesFilled()) {
      this.message = 'Please enter names for all passengers.';
      return;
    }

    const bookingData = {
      passengerNames: this.passengerNames,
      seatNumbers: this.selectedSeatsArray,
      journeyDate: this.date,
      busId: this.busId
    };

    this.service.bookTicket(bookingData).subscribe({
      next: (response) => {
        console.log("Booking Successful", response);
        const bookingIds = response.bookingIds;
        this.message = response.message;

        this.router.navigate(['/payment-page'], { 
          state: { 
            passengerNames: this.passengerNames,
            busNumber: this.busDetails.busNo,
            busNo: this.busDetails.id,
            from: this.busDetails.startPlace,
            to: this.busDetails.destination,
            time: this.busDetails.departureTime,
            amount: this.totalPrice,
            date: this.date,
            seatNo: this.selectedSeatsArray,
            bookingIds: bookingIds
          } 
        });
      },
      error: (error) => {
        console.error('Error:', error.error);
        this.message = '';
        this.errorMessages['general'] = 'An unexpected error occurred.';
      }
    });
  }
}
