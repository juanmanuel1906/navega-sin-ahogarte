import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { dashboardStatsI } from '../../../core/models/dashboard-stats.interface';
import { BASE_URL } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService {
  // La URL base de tu API en Node.js  
  private stats$: Observable<any> | undefined;
  
  constructor(private http: HttpClient) { }

  // Helper para obtener los headers con el token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Envía los resultados del test al backend.
   * @param resultData El objeto con el perfil y el resultado final.
   * @returns Un Observable con la respuesta del servidor.
   */
  saveResult(resultData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/results`, resultData, { headers: this.getAuthHeaders() });
  }

  /**
   * Obtiene números estadísticos del backend.
   * La petición HTTP solo se hará la primera vez que se llame a esta función.
   * Las llamadas siguientes devolverán el resultado guardado (cacheado).
   */
  getDashboardStats(): Observable<dashboardStatsI> {
    // Si aún no hemos hecho la petición, la hacemos y la guardamos
    if (!this.stats$) {
      const endpoint = `${BASE_URL}/dashboard/stats`;
      this.stats$ = this.http.get<dashboardStatsI>(endpoint).pipe(
        shareReplay(1) // <-- Cachea el último resultado y lo comparte
      );
    }

    // Devuelve siempre el Observable guardado
    return this.stats$;
  }

  /**
   * Obtiene el resumen completo de las analíticas desde el backend.
   * @returns Un Observable con la respuesta del servidor.
   */
  getAnalyticsSummary(): Observable<any> {
    return this.http.get(`${BASE_URL}/analytics/summary`, { headers: this.getAuthHeaders() });
  }

  /**
   * Obtiene el último resultado del test para un usuario específico.
   * @param userId El ID del usuario.
   * @returns Un Observable con la respuesta del servidor.
   */
  getLatestResult(userId: string): Observable<any> {
    // Llama a la ruta que definimos en el back
    return this.http.get(`${BASE_URL}/results/latest/${userId}`, { headers: this.getAuthHeaders() });
  }
}