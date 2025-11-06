import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CurrentUserI } from '../../core/models/current-user';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.html',
  styleUrl: './intranet.css',
  imports: [RouterOutlet, RouterLink, CommonModule]
})
export class Intranet {
  isSidebarOpen: boolean = true;
  isUserMenuOpen: boolean = false; // Nuevo estado para el menú de usuario
  isAdmin$!: Observable<boolean>;
  isUser$!: Observable<boolean>;

  currentUser: CurrentUserI | any = localStorage.getItem("currentUser");
  picture: string = 'https://placehold.co/100x100/C4B5FD/3730A3?text=CN'

  constructor(public authService:AuthService) {
    this.currentUser = this.authService.currentUser(this.currentUser);
    this.isAdmin$ = this.authService.isAdmin;
  }

  ngOnInit(): void {    
    const storedState = localStorage.getItem('isSidebarOpen');
    this.isSidebarOpen = storedState ? JSON.parse(storedState) : true;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    localStorage.setItem('isSidebarOpen', JSON.stringify(this.isSidebarOpen));
  }

  // Nuevo método para controlar el menú de usuario
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
