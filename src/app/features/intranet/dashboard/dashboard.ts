import { Component } from '@angular/core';
import { TestResultsService } from '../../components/wellness-test/test-results.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { dashboardStatsI } from '../../../core/models/dashboard-stats.interface';
import { CurrentUserI } from '../../../core/models/current-user';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', '../../intranet/intranet.css'],
})
export class Dashboard {
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

  constructor(private testResultsService: TestResultsService, private authService: AuthService) {
    this.currentUser = this.authService.currentUser(this.currentUser);
    this.isAdmin$ = this.authService.isAdmin;
    this.isUser$ = this.authService.isUser;
  }

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.testResultsService.getDashboardStats().subscribe(stats => {
      this.data = stats;
    });
  }
}
