import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css'
})
export class BookTicketComponent {

  busId: number;
  date: string;

  constructor(private route: ActivatedRoute) {
    // Access the route parameters
    this.busId = +this.route.snapshot.paramMap.get('busId')!;
    this.date = this.route.snapshot.paramMap.get('date')!;
  }

  ngOnInIt(): void{
    
  }
}
