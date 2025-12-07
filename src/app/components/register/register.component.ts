import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'WAITER', label: 'Mesero' },
    { value: 'USER', label: 'Usuario' }
  ];
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Usuario registrado correctamente';
          this.errorMessage = '';
          this.registerForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Error al registrar usuario';
          this.successMessage = '';
        }
      });
    }
  }
}
