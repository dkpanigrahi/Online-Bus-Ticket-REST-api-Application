import { Component } from '@angular/core';
import { SearchBusComponent } from "../search-bus/search-bus.component";

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [SearchBusComponent],
  templateUrl: './public-home.component.html',
  styleUrl: './public-home.component.css'
})
export class PublicHomeComponent {

}
