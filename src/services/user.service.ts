import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../app/model/profile';

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
}
