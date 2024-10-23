import { Component } from '@angular/core';
import { SearchBusComponent } from "../search-bus/search-bus.component";

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [SearchBusComponent],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent {

}
