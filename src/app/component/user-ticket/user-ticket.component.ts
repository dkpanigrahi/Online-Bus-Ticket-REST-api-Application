import { Component } from '@angular/core';
import { TicketResponse } from '../../model/ticket-response';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-ticket.component.html',
  styleUrls: ['./user-ticket.component.css']
})
export class UserTicketComponent {
  tickets: TicketResponse[] = [];

  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.service.getTickets().subscribe({
      next: (data: TicketResponse[]) => {
        // Sort the tickets by date in ascending order
        this.tickets = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (error) => console.error('Error fetching tickets:', error),
    });
  }
  

  viewTicket(id: number): void {
    console.log(`Viewing ticket with ID: ${id}`);
    // Implement view logic
  }

  cancelTicket(id: number): void {
    console.log(`Cancelling ticket with ID: ${id}`);
    // Call cancel ticket service method
    
  }

  getStatus(ticketDate: string): string {
    const today = new Date();
    const ticketDateObj = new Date(ticketDate);

    return ticketDateObj > today ? 'Upcoming' : 'Completed';
  }

  getStatusClass(ticketDate: string): string {
    const status = this.getStatus(ticketDate);
    return status === 'Upcoming' ? 'text-success' : 'text-secondary';
  }
}
