import { Component } from '@angular/core';
import { SearchBusComponent } from "../search-bus/search-bus.component";
import { FooterComponent } from "../footer/footer.component";
import { RouteConfigLoadEnd, Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {

  constructor(private router:Router){}

navigateToTicketPage() {
  this.router.navigate(['/bus'])
}

}
