import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../app/model/profile';
import { Busresponse } from '../app/model/busresponse';
import { TicketResponse } from '../app/model/ticket-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http : HttpClient) { }

  private baseUrl = 'http://localhost:8080/api/user';

  // Get the Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log('JWT Token:', token); 
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });
  }

  //fetch User Profile
  // Fetch Admin Dashboard
  getDashboard(): Observable<Profile>{
    const headers = this.getAuthHeaders();
    return this.http.get<Profile>(`${this.baseUrl}/profile`, {headers});
  }

  getSeatAvailability(busId: number, date: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('busId', busId.toString())
      .set('date', date);
    return this.http.get(`${this.baseUrl}/seatCount`, {params, headers});
  }

  getBusById(busId: number): Observable<Busresponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<Busresponse>(`${this.baseUrl}/bus/${busId}`,{headers});
  }

  bookTicket(bookingData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(bookingData);
    return this.http.post(`${this.baseUrl}/bookTicket`, bookingData, { headers });
  }

  //fetch all tickets
  getTickets(): Observable<TicketResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<TicketResponse[]>(`${this.baseUrl}/getTickets`, { headers });
  }
  
  
}
