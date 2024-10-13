import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule,
    MatIconModule,
    MatButtonModule,MatSidenavModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
