import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AnonymousPostService {
  private apiUrl = `${BASE_URL}/posts`;

  constructor(private socket: Socket, private http: HttpClient) {}

  // --- Carga Inicial (HTTP) ---
  getInitialPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // --- Escuchar Eventos (WebSocket) ---
  onNewPost(): Observable<any> {
    return this.socket.fromEvent('newPost');
  }

  onNewComment(): Observable<any> {
    return this.socket.fromEvent('newComment');
  }

  onPostUpdated(): Observable<any> {
    return this.socket.fromEvent('postUpdated');
  }

  onPostDeleted(): Observable<any> {
    return this.socket.fromEvent('postDeleted');
  }

  onCommentDeleted(): Observable<any> {
    return this.socket.fromEvent('deleteComment');
  }

  onCommentUpdated(): Observable<any> {
    return this.socket.fromEvent('commentUpdated');
  }

  // --- Acciones del Usuario (HTTP) ---
  private getAuthHeaders(): HttpHeaders {
    const isAnonymous = sessionStorage.getItem('participationMode') === 'anonymous';
    
    // Si el usuario es anónimo, devolvemos encabezados vacíos sin token.
    if (isAnonymous) {
      return new HttpHeaders();
    }
    
    // Si el usuario eligió su perfil, buscamos y adjuntamos el token.
    const token = localStorage.getItem('accessToken');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    
    // Si no hay token, devolvemos encabezados vacíos.
    return new HttpHeaders();
  }

  createPost(postData: any): Observable<any> {
    return this.http.post(this.apiUrl, postData, {
      headers: this.getAuthHeaders(),
    });
  }

  createComment(postId: number, commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comments`, commentData, {
      headers: this.getAuthHeaders(),
    });
  }

  toggleIdentifyPost(postId: number, deviceId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${postId}/identify`,
      { headers: this.getAuthHeaders() }
    );
  }

  toggleIdentifyComment(
    postId: number,
    commentId: number,
    deviceId: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${postId}/comments/${commentId}/identify?${deviceId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  deletePost(postId: number, deviceId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${postId}?${deviceId}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  deleteComment(postId: number, commentId: number, deviceId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${postId}/comments/${commentId}?${deviceId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
