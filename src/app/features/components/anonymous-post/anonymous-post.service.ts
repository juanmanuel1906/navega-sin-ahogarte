import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../../environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AnonymousPostService {
  private apiUrl = `${BASE_URL}/posts`;

  constructor(private socket: Socket, private http: HttpClient, private authService:AuthService) {}

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

  createPost(postData: any): Observable<any> {
    return this.http.post(this.apiUrl, postData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createComment(postId: number, commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comments`, commentData, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  toggleIdentifyPost(postId: number, deviceId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${postId}/identify`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  toggleIdentifyComment(
    postId: number,
    commentId: number,
    deviceId: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${postId}/comments/${commentId}/identify?${deviceId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deletePost(postId: number, deviceId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${postId}?${deviceId}`, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deleteComment(postId: number, commentId: number, deviceId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${postId}/comments/${commentId}?${deviceId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
