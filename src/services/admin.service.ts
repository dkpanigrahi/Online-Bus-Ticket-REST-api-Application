import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver } from '../app/model/driver';
import { Observable } from 'rxjs';
import { Conductor } from '../app/model/conductor';
import { Bus } from '../app/model/bus';

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
  saveDriver(driver: Driver): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/saveDriver`, driver, {headers});
  }

  // Save a new conductor
  saveConductor(conductor: Conductor): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/saveConductor`, conductor, {headers});
  }

  // Fetch all drivers
  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.baseUrl}/getDriver`);
  }

  // Fetch all conductors
  getConductors(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(`${this.baseUrl}/getConductor`);
  }

  // Create a new bus
  createBus(bus: Bus, availableDays: string, specificDays: string[]): Observable<any> {
    const params = {
      availableDays: availableDays,
      specificDays: specificDays ? specificDays.join(',') : ''
    };

    return this.http.post(`${this.baseUrl}/createBus`, bus, { params });
  }



}
