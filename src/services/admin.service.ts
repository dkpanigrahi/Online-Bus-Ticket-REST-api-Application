import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver } from '../app/model/driver';
import { Observable } from 'rxjs';
import { Conductor } from '../app/model/conductor';
import { Bus } from '../app/model/bus';
import { Profile } from '../app/model/profile';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient) { }

  private baseUrl = 'http://localhost:8080/api/admin';

  // Get the Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    console.log('JWT Token:', token); 
    return new HttpHeaders({
      'Authorization': `${token}`,
      'Content-Type': 'application/json'
    });
  }


  // Save a new driver
  saveDriver(driver: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/saveDriver`, driver, {headers});
  }

  // Save a new conductor
  saveConductor(conductor: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/saveConductor`, conductor, {headers});
  }

  // Fetch all drivers
  getDrivers(): Observable<Driver[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Driver[]>(`${this.baseUrl}/getDriver`, {headers});
  }

  // Fetch all conductors
  getConductors(): Observable<Conductor[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Conductor[]>(`${this.baseUrl}/getConductor`,{headers});
  }

  // Create a new bus
  createBus(bus: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/createBus`, bus, {headers});
  }

    // Fetch Admin Dashboard
    getDashboard(): Observable<Profile> {
      const headers = this.getAuthHeaders();
      return this.http.get<Profile>(`${this.baseUrl}/dashboard`, {headers});
    }

}
