import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { TicketResponse } from '../../model/ticket-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-ticket.component.html',
  styleUrls: ['./admin-ticket.component.css']
})
export class AdminTicketComponent {
  tickets: TicketResponse[] = [];
  filteredTickets: TicketResponse[] = [];
  paginatedTickets: TicketResponse[] = [];

  // Filters
  searchTerm: string = '';
  filterDate: string = '';
  filterBusNo: string = '';
  uniqueBusNumbers: string[] = []; 

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private service: AdminService) {}

  ngOnInit(): void {
    this.loadTickets();
    this.loadBusNumber();
  }

  loadTickets(): void {
    this.service.getAllTicket().subscribe({
      next: (data: TicketResponse[]) => {
        this.tickets = data;
        this.applyFilters();
      },
      error: (error) => console.error('Error fetching tickets:', error),
    });
  }

  loadBusNumber(): void {
    this.service.getAllBusNumber().subscribe({
      next: (busNumbers: string[]) => {
        this.uniqueBusNumbers = busNumbers; // Populate dropdown with all buses
      },
      error: (error) => console.error('Error fetching buses:', error),
    });
  }

  applyFilters(): void {
    this.filteredTickets = this.tickets.filter((ticket) => {
      const matchesTransactionId = ticket.transactionId
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesDate =
        !this.filterDate || ticket.date === this.filterDate;
      const matchesBusNo =
        !this.filterBusNo || ticket.busNo === this.filterBusNo;

      return matchesTransactionId && matchesDate && matchesBusNo;
    });
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTickets.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTickets = this.filteredTickets.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  viewTicket(id: number): void {
    console.log('Viewing ticket with ID:', id);
  }
}
