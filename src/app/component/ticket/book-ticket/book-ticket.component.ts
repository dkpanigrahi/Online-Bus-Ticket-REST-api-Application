import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { Busresponse } from '../../../model/busresponse';
import { time } from 'node:console';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent {

  busId: number;
  date: string;
  seatMap: { [key: number]: boolean } = {}; 
  passengerName: string = '';
  selectedSeats: { [key: string]: boolean } = {}; 
  busDetails : Busresponse={
    id:0,
    busNo:'',
    startPlace:'',
    destination: '',
    departureTime: '', 
    totalSeats: 0,
    ticketPrice: 0,
    driverName: '',
    conductorName:'',
    availableEveryDay: true,
    specificDays:[],
  }

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

   // Calculate total price based on selected seats
   calculateTotalPrice() {
    const selectedCount = Object.values(this.selectedSeats).filter(value => value).length;
    this.totalPrice = selectedCount * this.busDetails.ticketPrice;
  }

  isAnySeatSelected(): boolean {
    return Object.values(this.selectedSeats).some(seat => seat === true);
  }
  

  // This method can be called whenever a seat is selected/deselected
  onSeatSelectionChange() {
    this.calculateTotalPrice();
  }

  bookTicket() {
    const selectedSeatsArray = Object.keys(this.selectedSeats)
    .filter(seat => this.selectedSeats[seat])
    .map(seat => parseInt(seat, 10)); 
    const bookingData = {
        passengerName: this.passengerName,
        seatNumbers: selectedSeatsArray,
        journeyDate: this.date,
        busId: this.busId
    };

    if (selectedSeatsArray.length > 0) {
        this.service.bookTicket(bookingData).subscribe({
            next: (response) => {
                console.log("Booking Successful",response);
                this.message = response.message;
                // Prepare data for navigation to the payment pass
                
                this.router.navigate(['/payment-page'], { 
                  state: { passengerName: this.passengerName, 
                           busNumber:this.busDetails.busNo,
                           busNo:this.busDetails.id,
                           from:this.busDetails.startPlace,
                           to:this.busDetails.destination,
                           time:this.busDetails.departureTime,
                           amount:this.totalPrice,
                           date:this.date,
                           seatNo:selectedSeatsArray
                          } });

            },
            error: (error) => {
              console.error('Error:', error.error);
              this.message = '';

                      // Handle specific validation errors from the backend (if any)
              if (error.status === 400) {
                if (error.error && typeof error.error === 'object') {
                  this.errorMessages = error.error;  // Assuming the backend returns field-specific error messages
                } else {
                  this.errorMessages['general'] = 'Invalid input data. Please check your form values.';
                }
              } else {
                this.errorMessages['general'] = 'An unexpected error occurred.';
              }
            }
        });
    } else {
        console.log("No seats selected.");
        this.message="No seat selected...";
    }
}

  
}
