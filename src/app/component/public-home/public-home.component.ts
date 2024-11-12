import { Component } from '@angular/core';
import { SearchBusComponent } from "../search-bus/search-bus.component";
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './public-home.component.html',
  styleUrl: './public-home.component.css'
})
export class PublicHomeComponent {

  constructor(private router:Router){}

  navigateToTicketPage() {
    this.router.navigate(['/bus'])
  }
}
