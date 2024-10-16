import { Component } from '@angular/core';
import { Conductor } from '../../model/conductor';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-add-conductor',
  standalone: true,
  imports: [],
  templateUrl: './add-conductor.component.html',
  styleUrl: './add-conductor.component.css'
})
export class AddConductorComponent {
  conductor: Conductor = {
    id: 0,
    name: '',
    phoneno: '',
    salary: ''
  };
  message: string = '';
  error: string = '';

  constructor(private service: AdminService) {}

  
  saveConductor() {
    this.service.saveConductor(this.conductor).subscribe(response => {
      console.log('Conductor saved successfully', response);
      this.message = response.message;
      this.error = '';
    }, error => {
      console.error('Error saving conductor', error);
      this.error = error.error;
      this.message = '';
    });
  }
}
