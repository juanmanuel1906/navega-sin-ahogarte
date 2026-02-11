import { HttpClient, } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { CourseI, Module } from '../../../core/models/e-learning';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../../../../environment';
import { AnonymousPostService } from '../anonymous-post/anonymous-post.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class LearningService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCourses(): Observable<CourseI[]> {
    return this.http.get<CourseI[]>(`${BASE_URL}/learning`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

startVideo(moduleId: number): Observable<any> {
  return this.http.post(`${BASE_URL}/learning/${moduleId}/start-video`, 
      {}, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  completeVideo(moduleId: number): Observable<any> {
    return this.http.post(`${BASE_URL}/learning/${moduleId}/complete-video`, 
      {}, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  submitProgress(moduleId: number, score: number): Observable<any> {
    return this.http.post(`${BASE_URL}/learning/${moduleId}/progress`, 
      { score }, 
      { headers: this.authService.getAuthHeaders() });
  }
}