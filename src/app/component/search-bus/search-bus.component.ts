import { Component } from '@angular/core';
import { Busresponse } from '../../model/busresponse';
import { PublicServiceService } from '../../../services/public-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bus.component.html',
  styleUrl: './search-bus.component.css'
})
export class SearchBusComponent {
  startPlace: string = '';
  destination: string = '';
  date: string = '';
  buses: Busresponse[] = [];
  errorMessage: string = '';

  constructor(private service: PublicServiceService,private router : Router) {}

  onSearch(): void {
    this.service.searchBus(this.startPlace, this.destination, this.date).subscribe(
      (data: Busresponse[]) => {
        this.buses = data;
      },
      error => {
        console.error('Error fetching buses:', error);
        this.errorMessage = "No Bus Available For Selected Route & Date"
      }
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  bookBus(busId: number): void {
    if (this.isLoggedIn()) {
      // Navigate to booking page or call booking API
      this.router.navigate(['/book-ticket', busId, this.date]);
    } else {
      alert('You must be logged in to book a bus.');
    }
  }
}
