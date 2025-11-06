import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BASE_URL } from '../../app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  /**
   * Registra un nuevo usuario.
   * @param userData Objeto con name, email, y password.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/auth/register`, userData);
  }

  /**
   * Inicia sesión de un usuario.
   * @param credentials Objeto con email y password.
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${BASE_URL}/auth/login`, credentials).pipe(
      tap((response: any) => {
        // Al iniciar sesión, guarda los tokens en localStorage
        if (response.accessToken && response.refreshToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      })
    );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Aquí podrías añadir una lógica para redirigir al usuario a la página de login
  }
}