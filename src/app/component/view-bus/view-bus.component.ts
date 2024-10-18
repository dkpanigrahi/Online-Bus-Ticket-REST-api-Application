import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Bus } from '../../model/bus';
import { AdminService } from '../../../services/admin.service';
import { Busresponse } from '../../model/busresponse';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-view-bus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-bus.component.html',
  styleUrl: './view-bus.component.css'
})
export class ViewBusComponent {
  
  bus: Busresponse[] = [];
    
  constructor(private service : AdminService,private router:Router) {}

  ngOnInit(): void {
    this.getallBus();
  }

  getallBus(): void {
    this.service.getAllBus().subscribe((data) => {
      this.bus = data;
    });
  }

  editBus(busId: number): void {
    this.router.navigate(['/edit-bus', busId]);
  }

  // Method to delete a bus
  deleteBus(busId: number): void {
    if (confirm('Are you sure you want to delete this bus?')) {
      this.service.deleteBus(busId).subscribe(
        () => {
          this.getallBus();
        }
      );
    }
  }


}
