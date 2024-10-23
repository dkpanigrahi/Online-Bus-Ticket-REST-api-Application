import { Component } from '@angular/core';
import { DriverResponse } from '../../model/driver-response';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-driver',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-driver.component.html',
  styleUrl: './view-driver.component.css'
})
export class ViewDriverComponent {
  driver: DriverResponse[] = [];
    
  constructor(private service : AdminService,private router:Router) {}

  ngOnInit(): void {
    this.getallDriver();
  }

  getallDriver(): void {
    this.service.getDrivers().subscribe((data) => {
      this.driver = data;
    });
  }

  editDriver(condId: number): void {
    this.router.navigate(['/edit-driver', condId]);
  }

  // Method to delete a bus
  deleteDriver(condId: number): void {
    if (confirm('Are you sure you want to delete this bus?')) {
      this.service.deleteBus(condId).subscribe(
        () => {
          this.getallDriver();
        }
      );
    }
  }
}
