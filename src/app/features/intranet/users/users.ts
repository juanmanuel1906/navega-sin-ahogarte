// src/app/features/users/users.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css', '../../intranet/intranet.css'],
})
export class Users implements OnInit {
  
  users: any[] = [];
  isModalOpen = false;
  userForm: FormGroup;
  isEditMode = false;
  currentUserId: number | null = null;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      password: [''] // El password solo es requerido al crear
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (response) => {
        this.users = response.users;
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  openModal(user: any | null = null): void {
    if (user) {
      // Modo Edición
      this.isEditMode = true;
      this.currentUserId = user.id;
      this.userForm.patchValue(user);
      this.userForm.get('password')?.clearValidators(); // No requerir password al editar
    } else {
      // Modo Creación
      this.isEditMode = false;
      this.userForm.reset({ role: 'user' });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onFormSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    if (this.isEditMode && this.currentUserId) {
      // Lógica de Actualización
      this.usersService.updateUser(this.currentUserId, this.userForm.value).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          Swal.fire('¡Éxito!', 'Usuario actualizado correctamente.', 'success');
        },
        error: (err) => Swal.fire('Error', err.error.message, 'error')
      });
    } else {
      // Lógica de Creación
      this.usersService.createUser(this.userForm.value).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
          Swal.fire('¡Éxito!', 'Usuario creado correctamente.', 'success');
        },
        error: (err) => Swal.fire('Error', err.error.message, 'error')
      });
    }
  }

  onDeleteUser(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '<b>Sí, ¡eliminar!</b>',
      cancelButtonText: '<b>Cancelar</b>'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(id).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
          },
          error: (err) => Swal.fire('Error', err.error.message, 'error')
        });
      }
    });
  }
}