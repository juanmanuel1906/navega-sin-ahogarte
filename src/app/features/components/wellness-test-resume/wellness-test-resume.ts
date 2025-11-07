import { Component } from '@angular/core';
import { CurrentUserI } from '../../../core/models/current-user';
import { TestResultsService } from '../wellness-test/test-results.service';
import { AuthService } from '../../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-wellness-test-resume',
  imports: [CommonModule, RouterLink],
  templateUrl: './wellness-test-resume.html',
  styleUrl: './wellness-test-resume.css'
})
export class WellnessTestResume {
  // Variables de estado para la vista
  public isLoading: boolean = true;
  public noResults: boolean = false; // Para usuarios que no han hecho el test
  public currentUser: CurrentUserI | any = localStorage.getItem("currentUser");

  // Variables para la lógica de la tarjeta
  public userName: string = 'ViajeroDigital';
  public resultCategory: string = '';
  public resultText: string = '';
  public colorClass: 'green' | 'yellow' | 'red' | 'gray' = 'gray';
  public progressPercentage: number = 0;

  constructor(
    private testResultsService: TestResultsService,
    private authService: AuthService // Lo usamos para obtener el ID del usuario
  ) {
    this.currentUser = this.authService.currentUser(this.currentUser);
    this.userName = this.currentUser?.name || 'ViajeroDigital';
  }

  ngOnInit(): void {
    this.loadLatestResult();
  }

  loadLatestResult(): void {
    this.isLoading = true;
    const userId = this.currentUser?.id;

    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      this.isLoading = false;
      this.noResults = true; // No podemos buscar sin ID
      return;
    }

    this.testResultsService.getLatestResult(userId).subscribe({
      next: (response:any) => {
        const resultData = response.data;        

        // Asignamos el puntaje para la barra de progreso
        // Asumimos que final_score es un número de 0 a 100
        this.progressPercentage = resultData.final_score || 0;

        // Aquí está la lógica de los 3 estados
        switch (resultData.result_category.toLowerCase()) {
          case 'verde':
            this.resultCategory = 'SALUDABLE';
            this.resultText = '¡Excelente! Tu bienestar digital está en su punto más alto.';
            this.colorClass = 'green';
            this.progressPercentage = 95;
            break;
          case 'amarillo':
            this.resultCategory = 'REGULAR';
            this.resultText = '¡Sigue así, estás en camino!';
            this.colorClass = 'yellow';
            this.progressPercentage = 50;
            break;
          case 'rojo':
            this.resultCategory = 'CRÍTICO';
            this.resultText = 'Es un buen momento para revisar tus hábitos digitales.';
            this.colorClass = 'red';
            this.progressPercentage = 10;
            break;
          default:
            // Caso por si la categoría no es reconocida
            this.resultCategory = 'Indefinido';
            this.resultText = 'No pudimos identificar tu resultado.';
            this.colorClass = 'gray';
            this.progressPercentage = 50; // default
        }

        this.isLoading = false;
        this.noResults = false;
      },
      error: (err: HttpErrorResponse) => {
        // Si el error es 404 (No Encontrado), es un usuario nuevo
        if (err.status === 404) {
          this.noResults = true;
        } else {
          // Manejar otros errores
          console.error('Error al cargar el resultado:', err);
        }
        this.isLoading = false;
      }
    });
  }
}
