import { Component } from '@angular/core';
import { Busresponse } from '../../../model/busresponse';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../../services/payment.service';
import { response } from 'express';

declare var Razorpay: any;

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent {

  passengerName: string[] = [];
  busNumber:string='';
  busId:number=0;
  startPlace:string='';
  destination:string='';
  departureTime:string='';
  amount: number = 0;
  date:string='';
  seatNumbers: number[] = [];
  bookingIds: number[]=[];


  constructor(private router: Router, private paymentService : PaymentService) {
    const navigation = this.router.getCurrentNavigation();
    this.passengerName = navigation?.extras.state?.['passengerNames'] ?? 'Unknown Passenger';
    this.busNumber = navigation?.extras.state?.['busNumber'] ?? 'Unknown Bus Number';
    this.busId = navigation?.extras.state?.['busNo'] ?? 'Unknown Bus Number';
    this.startPlace = navigation?.extras.state?.['from'] ?? 'Unknown Passenger';
    this.destination = navigation?.extras.state?.['to'] ?? 'Unknown Bus Number';
    this.amount = navigation?.extras.state?.['amount'] ?? 'Unknown Passenger';
    this.departureTime = navigation?.extras.state?.['time'] ?? 'Unknown Passenger';
    this.date = navigation?.extras.state?.['date'] ?? 'Unknown Passenger';
    this.seatNumbers = navigation?.extras.state?.['seatNo'] ?? 'Unknown Passenger';
    this.bookingIds = navigation?.extras.state?.['bookingIds'] ?? 'Unknown Passenger';
  }
  

  ngOnInit(): void {
    
  }

  payWithRazorPay() {
    this.checkBookingStatus(this.bookingIds).subscribe(
      (status) => {
        if (status) {
          // Booking is in process, proceed to payment
          this.paymentService.createTransaction(this.amount).subscribe(
            (response) => {
              console.log(response);
              this.openTransactionModel(response);
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          // Booking is not in process, show an error message
          console.log("Booking Time Expired....");
          alert("Booking Time Experied....");
        }
      },
      (error) => {
        console.log("Error checking booking status:", error);
      }
    );
  }
  
  checkBookingStatus(bookingIds: number[]) {
    return this.paymentService.checkBookingStatus(bookingIds);
  }
  



  openTransactionModel(response: any){
    var options ={
      order_id: response.order_id,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'JayaBilas Travells',
      description: 'Payment For Seat Booking Through Online',
      image: "jayabilas.png",
      handler: (response: any) => {
        if(response!=null && response.razorpay_payment_id != null){
          console.log(response);
          this.processResponse(response);
        } else{
          alert("Payment Failed...");
        }
        
      },
      prefill : {
        name: 'JayaBilas Travells',
        email: 'jayabilastravells@gmail.com',
        contact: '9999999999'
      },
      notes : {
        address: 'Online Bus Ticket Booking'
      },
      theme : {
        color : '#F37254'
      },
      method: ['upi']
    };

    var razorpayObject = new Razorpay(options);
    razorpayObject.open();
  }

  processResponse(resp: any) {
    const ticketData = {
      passengerName: this.passengerName,
      busId: this.busId,
      date: this.date,
      seatno: this.seatNumbers,
      bookingids : this.bookingIds,
      transactionId : resp.razorpay_payment_id
    };
  
    this.paymentService.saveTicket(ticketData)
      .subscribe(
        (response) => {
          console.log("Ticket and transaction saved:", response);
          this.router.navigate(['/success'], {
            state: {
              message: 'Your payment was successful. Your ticket is confirmed!'
            }
          });
        },
        (error) => {
          console.error("Error saving ticket:", error);
        }
      );
  }
  
}
