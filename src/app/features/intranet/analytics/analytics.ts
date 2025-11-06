import { Component } from '@angular/core';
import { dashboardStatsI } from '../../../core/models/dashboard-stats.interface';
import { CommonModule } from '@angular/common';

import * as Highcharts from 'highcharts';
import { TestResultsService } from '../../components/wellness-test/test-results.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrls: ['./analytics.css', '../../intranet/intranet.css'],
})
export class Analytics {
  Highcharts: typeof Highcharts = Highcharts;

  // Opciones para el gráfico de dona
  donutChartOptions!: Highcharts.Chart;
  
  // Opciones para el gráfico de barras
  barChartOptions!: Highcharts.Chart;
  
  generalData: dashboardStatsI = {
    totalTests: 0,
    newUsersToday: 0,
    averageResult: '',
    totalUsers: 0,
    mostActiveRole: '',
  };

  kpiData: any = {};

  constructor(private testResultsService: TestResultsService) {}

  ngOnInit() {
    this.loadAnalyticsData();
    this.loadSummaryAnalyticsData();
  }

  private loadAnalyticsData() {
    this.testResultsService.getDashboardStats().subscribe((stats) => {
      this.generalData = stats;
    });
  }

  loadSummaryAnalyticsData(): void {
    this.testResultsService.getAnalyticsSummary().subscribe(summaryData => {
      // Guardamos los datos de KPIs
      this.kpiData = summaryData; 
      // Configuramos ambos gráficos con los datos recibidos
      this.setupDonutChart(summaryData.distribution);
      this.setupBarChart(summaryData.resultsByRole);
    });
  }

  setupDonutChart(distributionData: any): void {
    const seriesData = [
      {
        name: 'Saludable',
        y: distributionData.verde.percentage,
        color: 'oklch(72.3% 0.219 149.579)',
      },
      {
        name: 'Moderado',
        y: distributionData.amarillo.percentage,
        color: 'oklch(85.2% 0.199 91.936)',
      },
      {
        name: 'Problemático',
        y: distributionData.rojo.percentage,
        color: '#fb2c36',
      },
    ];

    this.donutChartOptions = Highcharts.chart('donutChartOptions', {
      chart: { type: 'pie', backgroundColor: 'transparent' },
      title: { text: '' },
      credits: { enabled: false },
      plotOptions: {
        pie: {
          innerSize: '70%',
          borderWidth: 0,
          dataLabels: { enabled: false },
          showInLegend: true,
        },
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'vertical',
      },
      series: [
        {
          type: 'pie',
          name: 'Porcentaje',
          data: seriesData,
        },
      ],
    });
  }

  setupBarChart(resultsByRoleData: any[]): void {
    const roles = resultsByRoleData.map((item) => item.role);
    // 1. Prepara los datos con el color dinámico
    const seriesData = resultsByRoleData.map(item => ({
      y: item.testCount,
      color: this.getColorForScore(item.averageScore)
    }));

    this.barChartOptions = Highcharts.chart('barChartOptions', {
      chart: { type: 'column', backgroundColor: 'transparent' },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        categories: roles,
        title: { text: null },
        gridLineWidth: 0,
        lineWidth: 0,
      },
      yAxis: {
        min: 0,
        title: { text: 'Número de tests', align: 'middle' },
        labels: { overflow: 'justify' },
        gridLineWidth: 0,
      },
      plotOptions: {
        // 3. Cambiamos de 'bar' a 'column'
        column: {
          dataLabels: { enabled: true },
          borderWidth: 0,
        },
      },
      legend: { enabled: false },
      series: [
        {
          type: 'column',
          name: 'Tests realizados',
          data: seriesData,
        },
      ],
    });
  }

  private getColorForScore(score: number): string {
    if (score >= 61) {
      return '#fb2c36'; // Rojo
    } else if (score >= 31) {
      return 'oklch(85.2% 0.199 91.936)'; // Amarillo
    } else {
      return 'oklch(72.3% 0.219 149.579)'; // Verde
    }
  }
}
