import { Component } from '@angular/core';
import { Conductor } from '../../model/conductor';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConductorResponce } from '../../model/conductor-responce';

@Component({
  selector: 'app-view-conductor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-conductor.component.html',
  styleUrl: './view-conductor.component.css'
})
export class ViewConductorComponent {

  conductor: ConductorResponce[] = [];
    
  constructor(private service : AdminService,private router:Router) {}

  ngOnInit(): void {
    this.getallBus();
  }

  getallBus(): void {
    this.service.getConductors().subscribe((data) => {
      this.conductor = data;
    });
  }

  editConductor(condId: number): void {
    this.router.navigate(['/edit-bus', condId]);
  }

  // Method to delete a bus
  deleteConductor(condId: number): void {
    if (confirm('Are you sure you want to delete this bus?')) {
      this.service.deleteBus(condId).subscribe(
        () => {
          this.getallBus();
        }
      );
    }
  }
}
