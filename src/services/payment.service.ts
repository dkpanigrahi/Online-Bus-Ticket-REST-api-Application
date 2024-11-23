import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http : HttpClient) { }

  private baseUrl = 'http://localhost:8080/user/payment';

  // Get the Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });
  }

  createTransaction(amount: number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/createTransaction/${amount}`,{ headers })
  }

  saveTicket(ticketData: any) {
    const headers = this.getAuthHeaders();
    console.log(ticketData);
    return this.http.post(`${this.baseUrl}/saveTicket`, ticketData, { headers });
  }


  checkBookingStatus(bookingIds: number[]) {
    const headers = this.getAuthHeaders();
    const body = { bookingIds };
    console.log(bookingIds);
    return this.http.post<boolean>(`${this.baseUrl}/checkStatus`,body, { headers });
  }
  
}
