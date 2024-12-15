import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver } from '../app/model/driver';
import { Observable } from 'rxjs';
import { Conductor } from '../app/model/conductor';
import { Bus } from '../app/model/bus';
import { Profile } from '../app/model/profile';
import { Busresponse } from '../app/model/busresponse';
import { ConductorResponce } from '../app/model/conductor-responce';
import { DriverResponse } from '../app/model/driver-response';
import { UserList } from '../app/model/user-list';
import { TicketResponse } from '../app/model/ticket-response';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http : HttpClient) { }

  private baseUrl = 'http://localhost:8080/admin';

  // Get the Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
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
  getDrivers(): Observable<DriverResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DriverResponse[]>(`${this.baseUrl}/getDriver`, {headers});
  }

  // Fetch all Users
  getUsers(): Observable<UserList[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<UserList[]>(`${this.baseUrl}/getUsers`, {headers});
  }


  // Fetch all conductors
  getConductors(): Observable<ConductorResponce[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ConductorResponce[]>(`${this.baseUrl}/getConductor`,{headers});
  }

  // Create a new bus
  createBus(bus: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log(bus);
    return this.http.post<any>(`${this.baseUrl}/createBus`, bus, {headers});
  }

  // Fetch all Bus
  getAllBus(): Observable<Busresponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Busresponse[]>(`${this.baseUrl}/bus`,{headers});
  }

  // Fetch Bus By Id
  getBusById(id:number): Observable<Bus> {
    const headers = this.getAuthHeaders();
    return this.http.get<Bus>(`${this.baseUrl}/bus/${id}`,{headers});
  }

  //fetch all ticket
  getAllTicket():Observable<TicketResponse[]>{
    const headers = this.getAuthHeaders();
    return this.http.get<TicketResponse[]>(`${this.baseUrl}/ticket`,{headers})
  }

  //fetch all Bus Number
  getAllBusNumber(): Observable<string[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<string[]>(`${this.baseUrl}/busNumber`,{headers});
  }

  //delete Bus
  deleteBus(id:number):Observable<void>{
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.baseUrl}/bus/${id}`,{headers});
  }

    // Fetch Admin Dashboard
    getDashboard(): Observable<Profile> {
      const headers = this.getAuthHeaders();
      return this.http.get<Profile>(`${this.baseUrl}/dashboard`, {headers});
    }

    getBusCount():Observable<number>{
      const headers = this.getAuthHeaders();
      return this.http.get<number>(`${this.baseUrl}/busCount`,{headers});
    }

    getDriverCount():Observable<number>{
      const headers = this.getAuthHeaders();
      return this.http.get<number>(`${this.baseUrl}/driverCount`,{headers});
    }

    getConductorCount():Observable<number>{
      const headers = this.getAuthHeaders();
      return this.http.get<number>(`${this.baseUrl}/conductorCount`,{headers});
    }

    getUserCount():Observable<number>{
      const headers = this.getAuthHeaders();
      return this.http.get<number>(`${this.baseUrl}/userCount`,{headers});
    }

     //change password
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    
    return this.http.post(`${this.baseUrl}/change-password`, body, { headers });
  }

}
