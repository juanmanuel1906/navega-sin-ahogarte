import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.html',
  styleUrl: './intranet.css',
  imports: [RouterOutlet, RouterLink]
})
export class Intranet {
  isSidebarOpen: boolean = true;
  isUserMenuOpen: boolean = false; // Nuevo estado para el menú de usuario

  // Simulación de los datos del usuario para el diseño
  currentUser = {
    name: 'Capitán Nemo',
    email: 'capitan@navegasinahogarte.com',
    picture: 'https://placehold.co/100x100/C4B5FD/3730A3?text=CN'
  };

  constructor() {}

  ngOnInit(): void {
    // Ya no se necesita initFlowbite()
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
