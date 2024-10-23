import { Component } from '@angular/core';
import { UserList } from '../../model/user-list';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonEngine } from '@angular/ssr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {
  users: UserList[] = [];
    
  constructor(private service : AdminService,private router:Router) {}

  ngOnInit(): void {
    this.getallUsers();
  }

  getallUsers(): void {
    this.service.getUsers().subscribe((data) => {
      this.users = data;
    });
  }


  // Method to delete a bus
  blockUser(condId: number): void {
    if (confirm('Are you sure you want to delete this bus?')) {
      this.service.deleteBus(condId).subscribe(
        () => {
          this.getallUsers();
        }
      );
    }
  }
}
