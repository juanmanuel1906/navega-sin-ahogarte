import { Component, OnInit } from '@angular/core';
import { TestResultsService } from '../../components/wellness-test/test-results.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { dashboardStatsI } from '../../../core/models/dashboard-stats.interface';
import { CurrentUserI } from '../../../core/models/current-user';
import { Observable, take } from 'rxjs'; // Importamos take
import { AuthService } from '../../auth/auth.service';
import { WellnessTestResume } from "../../components/wellness-test-resume/wellness-test-resume";

// 1. Definimos una interfaz para las tarjetas
interface NavigationCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, WellnessTestResume],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', '../../intranet/intranet.css'],
})
export class Dashboard implements OnInit {
  currentUser: CurrentUserI | any = localStorage.getItem("currentUser");
  isAdmin$!: Observable<boolean>;
  isUser$!: Observable<boolean>;

  data: dashboardStatsI = {
    totalTests: 0,
    newUsersToday: 0,
    averageResult: '',
    totalUsers: 0,
    mostActiveRole: ''
  }

  // Creamos la lista final de tarjetas que usará el HTML
  public navigationCards: NavigationCard[] = [];

  // Definimos las tarjetas que SÓLO ven los admins
  private adminOnlyCards: NavigationCard[] = [
    {
      icon: 'ph-fill ph-chart-bar',
      title: 'Ver analíticas',
      description: 'Explora los datos, gráficos interactivos y tendencias de los resultados del test.',
      link: '/analytics',
      buttonText: 'NAVEGAR'
    },
    {
      icon: 'ph-fill ph-users-three',
      title: 'Administrar usuarios',
      description: 'Gestiona los perfiles, roles y permisos de todos los usuarios registrados en la plataforma.',
      link: '/users',
      buttonText: 'NAVEGAR'
    }
  ];

  // Definimos las tarjetas que ven TODOS (admins y usuarios)
  private sharedCards: NavigationCard[] = [
    {
      icon: 'ph-fill ph-chats-teardrop',
      title: 'Comunidad Anónima',
      description: 'Gestiona las publicaciones de tus usuarios.',
      link: '/anonymous-post-admin',
      buttonText: 'NAVEGAR'
    },
    {
      icon: 'ph-fill ph-boat',
      title: 'Test de bienestar digital',
      description: 'Encuentra puntos a mejorar realizando este test.',
      link: '/wellness-test-panel',
      buttonText: 'NAVEGAR'
    }
  ];

  constructor(private testResultsService: TestResultsService, private authService: AuthService) {
    this.currentUser = this.authService.currentUser(this.currentUser);
    this.isAdmin$ = this.authService.isAdmin;
    this.isUser$ = this.authService.isUser;
  }

  ngOnInit() {
    //    Usamos 'take(1)' para que el observable se complete solo
    //    y no necesitemos gestionar la desuscripción.
    this.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
      if (isAdmin) {
        // Si es admin, cargamos los stats y combinamos AMBAS listas
        this.loadDashboardStats();
        this.navigationCards = [...this.adminOnlyCards, ...this.sharedCards];
      } else {
        // Si es usuario normal, SÓLO cargamos las tarjetas compartidas
        this.navigationCards = [...this.sharedCards];
      }
    });
  }

  loadDashboardStats() {
    // Esta función ahora solo es llamada si el usuario es admin
    this.testResultsService.getDashboardStats().subscribe(stats => {
      this.data = stats;
    });
  }
}