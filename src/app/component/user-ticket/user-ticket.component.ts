import { Component } from '@angular/core';
import { TicketResponse } from '../../model/ticket-response';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-ticket.component.html',
  styleUrl: './user-ticket.component.css'
})
export class UserTicketComponent {


  tickets: TicketResponse[] = [];

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.service.getTickets().subscribe({
      next: (data: TicketResponse[]) => this.tickets = data,
      error: (error) => console.error('Error fetching tickets:', error)
    });
  }

  viewTicket(id:number) {
    
  }
}
