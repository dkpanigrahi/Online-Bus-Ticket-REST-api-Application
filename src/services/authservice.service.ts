import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface RegisterRequest {
  name: string;
  email: string;
  phoneno: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  private url = 'http://localhost:8080/api/auth';

  // Create a BehaviorSubject to track login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.url}/login`, { email, password }, { headers }).pipe(
      tap((response: any) => {
        // Save token and role on successful login
        this.saveToken(response.token, response.role);
        this.updateLoginStatus(); // Update the login status
      })
    );
  }
  //pipe: Used to chain multiple operators together to manipulate the observable stream.
  //tap: Used to perform side effects (like logging or saving data) on the values emitted by the observable without changing those values.
  saveToken(token: string, role: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userRole', role);
    }
  }

  // Update the login status in BehaviorSubject
  private updateLoginStatus(): void {
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Method to get the login status observable
  getLoginStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('jwtToken');
    }
    return null;
  }

  getRole(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem('userRole');
    }
    return null;
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userRole');
      this.updateLoginStatus(); // Update the login status
    }
  }

  registerUser(registerData: RegisterRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(`${this.url}/register`, registerData, { headers });
  }

  // Helper function to check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }



}


