import { Component } from '@angular/core';
import { Busresponse } from '../../../model/busresponse';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent {

  passengerName: string = '';
  busNumber:string='';
  busId:number=0;
  startPlace:string='';
  destination:string='';
  departureTime:string='';
  amount: number = 0;
  date:string='';
  seatNumbers: number[] = [];

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.passengerName = navigation?.extras.state?.['passengerName'] ?? 'Unknown Passenger';
    this.busNumber = navigation?.extras.state?.['busNumber'] ?? 'Unknown Bus Number';
    this.busId = navigation?.extras.state?.['busId'] ?? 'Unknown Bus Number';
    this.startPlace = navigation?.extras.state?.['from'] ?? 'Unknown Passenger';
    this.destination = navigation?.extras.state?.['to'] ?? 'Unknown Bus Number';
    this.amount = navigation?.extras.state?.['amount'] ?? 'Unknown Passenger';
    this.departureTime = navigation?.extras.state?.['time'] ?? 'Unknown Passenger';
    this.date = navigation?.extras.state?.['date'] ?? 'Unknown Passenger';
    this.seatNumbers = navigation?.extras.state?.['seatNo'] ?? 'Unknown Passenger';
  }
  

  ngOnInit(): void {
    
  }
}
