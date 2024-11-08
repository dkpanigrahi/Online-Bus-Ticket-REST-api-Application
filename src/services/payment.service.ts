import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http : HttpClient) { }

  private baseUrl = 'http://localhost:8080/api/user/payment';

  // Get the Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log('JWT Token:', token); 
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });
  }

  createTransaction(amount: number){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/createTransaction/${amount}`,{ headers })
  }
}
