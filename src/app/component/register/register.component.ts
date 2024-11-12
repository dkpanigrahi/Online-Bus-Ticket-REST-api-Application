import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService, RegisterRequest } from '../../../services/authservice.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Corrected styleUrls
})
export class RegisterComponent {
  
  registerForm: FormGroup;
  message: string = '';
  errorMessages: { [key: string]: string } = {};

  constructor(private fb: FormBuilder, private userService: AuthserviceService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneno: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData: RegisterRequest = this.registerForm.value;
      this.userService.registerUser(registerData).subscribe({
        next: (response) => {
          this.message = response.message;
          this.errorMessages = {};
          this.registerForm.reset();
        },
        error: (err) => {
          this.errorMessages = err.error;
          this.message = '';
        },
      });
    }
  }
}
