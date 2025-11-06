import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  // Helper para obtener los headers con el token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Listar todos los usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${BASE_URL}/users`, { headers: this.getAuthHeaders() });
  }

  // Crear un nuevo usuario
  createUser(userData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/users`, userData, { headers: this.getAuthHeaders() });
  }

  // Actualizar un usuario existente
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${BASE_URL}/users/${id}`, userData, { headers: this.getAuthHeaders() });
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/users/${id}`, { headers: this.getAuthHeaders() });
  }
}