import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent {

  bus:number=0;
  driver:number=0;
  conductor:number=0;
  user:number=0;

  constructor(private adminService: AdminService) { }

  ngOnInit():void{
    this.adminService.getBusCount().subscribe(data => this.bus=data);
    this.adminService.getDriverCount().subscribe(data => this.driver=data);
    this.adminService.getConductorCount().subscribe(data => this.conductor=data);
    this.adminService.getUserCount().subscribe(data => this.user=data);
  }

}
