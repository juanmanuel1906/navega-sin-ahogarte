// community-entry.component.ts

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CurrentUserI } from '../../../core/models/current-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community-post-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './community-post-entry.html',
  styleUrls: ['./community-post-entry.css']
})
export class CommunityPostEntryComponent implements OnInit {
  // Evento que notificará al componente padre la elección del usuario
  @Output() modeSelected = new EventEmitter<{ mode: 'profile' | 'anonymous', nickname?: string | null | undefined }>();

  // Estado interno para controlar qué se muestra: la elección o el formulario de apodo
  currentStep: 'selection' | 'nickname' = 'selection';
  
  nicknameForm!: FormGroup;

  currentUser: CurrentUserI | any = localStorage.getItem("currentUser");

  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router) {
    this.nicknameForm = this.fb.group({
      nickname: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser(this.currentUser);        
  }

  // Muestra el formulario para elegir un apodo
  selectAnonymous(): void {
    this.currentStep = 'nickname';
  }

  // Confirma el apodo y emite el evento para iniciar en modo anónimo
  confirmNickname(): void {
    if (this.nicknameForm.invalid) return;
    this.modeSelected.emit({
      mode: 'anonymous',
      nickname: this.nicknameForm.value.nickname ?? 'Anónimo'
    });
  }

  // Comprueba si existe un usuario. Si existe, emite el evento. Si no, navega a la página de autenticación.
  selectProfile(): void {
    if (this.currentUser && this.currentUser.name) {
      this.modeSelected.emit({
        mode: 'profile',
        nickname: this.currentUser.name 
      });
    } else {
      // Si no hay usuario, redirige a la página de login/registro
      this.router.navigate(['/auth']);
    }
  }
}