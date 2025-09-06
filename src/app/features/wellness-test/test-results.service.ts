import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService {
  // La URL base de tu API en Node.js
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Envía los resultados del test al backend.
   * @param resultData El objeto con el perfil y el resultado final.
   * @returns Un Observable con la respuesta del servidor.
   */
  saveResult(resultData: any): Observable<any> {
    const endpoint = `${this.apiUrl}/results`;
    return this.http.post(endpoint, resultData);
  }
}