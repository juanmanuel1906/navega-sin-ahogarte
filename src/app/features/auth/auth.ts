import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css']
})
export class Auth {
  isLoginVisible = true;

  loginForm: FormGroup;
  registerForm: FormGroup;

  // Inyecta FormBuilder y AuthService en el constructor
  constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) {
    // Inicializa el formulario de Login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Inicializa el formulario de Registro
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  showRegister(): void {
    this.isLoginVisible = false;
  }

  showLogin(): void {
    this.isLoginVisible = true;
  }

  // Método para manejar el envío del formulario de Login
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      console.error('El formulario de login no es válido.');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      this.authService.setCurrentUser(response.user);

      this.route.navigate(['/dashboard']);

      Toast.fire({
        icon: "success",
        title: `Es bueno verte de nuevo, ${response.user.name}🤓.`
      });
      },
      error: (error) => {
        console.error('Error en el login:', error);
        Swal.fire({
          title: '¡Ooops!',
          text: error.error.message,
          icon: 'error',
          confirmButtonColor: 'var(--primary-purple)',
          confirmButtonText: '<b><i>¡OKEY!</i></b>'
        })
      }
    });
  }

  // Método para manejar el envío del formulario de Registro
  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      console.error('El formulario de registro no es válido.');
      return;
    }
    
    // Se asigna un rol por defecto si no lo envías desde el front
    const formData = { ...this.registerForm.value, role: 'user' };

    this.authService.register(formData).subscribe({
      next: (response) => {
        // Guarda los tokens recibidos en localStorage
        if (response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }

        const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
        });
        Toast.fire({
          icon: "success",
          title: `Es un honor tenerte en la tripulación, ${response.user?.name}🤩.`
        });
        
        this.authService.setCurrentUser(response.user);
        this.route.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        Swal.fire({
          title: '¡Ooops!',
          text: error.error.message,
          icon: 'error',
          confirmButtonColor: 'var(--primary-purple)',
          confirmButtonText: '<b><i>¡OKEY!</i></b>'
        })

        if(error.error.message === "Ya existe un tripulante con este correo electrónico, intenta iniciar sesión.") {
          this.isLoginVisible = true;
        }
      }
    });
  }
}