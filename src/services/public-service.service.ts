import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Busresponse } from '../app/model/busresponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicServiceService {

  constructor(private http : HttpClient) { }

  private baseUrl = 'http://localhost:8080/api/public';

  // Search buses by start place, destination, and date
  searchBus(startPlace: string, destination: string, date: string): Observable<Busresponse[]> {
    const params = { startPlace, destination, date };
    return this.http.get<Busresponse[]>(`${this.baseUrl}/searchBus`, { params });
  }
}
