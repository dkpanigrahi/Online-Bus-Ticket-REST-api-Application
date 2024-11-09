import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successpage',
  standalone: true,
  imports: [],
  templateUrl: './successpage.component.html',
  styleUrl: './successpage.component.css'
})
export class SuccesspageComponent {

  successMessage: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Retrieve the success message passed in the state
    const navigation = this.router.getCurrentNavigation();
    this.successMessage = navigation?.extras.state?.['message']|| 'Payment successful!';
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  viewTicket() {
    this.router.navigate(['/user-tickets']); 
  }
}
