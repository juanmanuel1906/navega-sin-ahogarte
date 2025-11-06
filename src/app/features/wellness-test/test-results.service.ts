import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../app';

@Injectable({
  providedIn: 'root'
})
export class TestResultsService {
  constructor(private http: HttpClient) { }

  /**
   * Envía los resultados del test al backend.
   * @param resultData El objeto con el perfil y el resultado final.
   * @returns Un Observable con la respuesta del servidor.
   */
  saveResult(resultData: any): Observable<any> {
    const endpoint = `${BASE_URL}/results`;
    return this.http.post(endpoint, resultData);
  }
}