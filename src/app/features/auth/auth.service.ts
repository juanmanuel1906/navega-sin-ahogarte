import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CurrentUserI } from '../../core/models/current-user';
import { Router } from '@angular/router';
import { BASE_URL } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${BASE_URL}/auth`;
  
  // --- INICIO DE LA CORRECCIÓN ---

  // 1. Los BehaviorSubjects se inicializan leyendo el valor ACTUAL
  //    de localStorage usando métodos privados y seguros.
  private currentUser$ = new BehaviorSubject<CurrentUserI | null>(this.getSafeCurrentUser());
  isLogin = new BehaviorSubject<boolean>(this.hasToken());
  isAdmin = new BehaviorSubject<boolean>(this.hasAdminPermission());
  isUser = new BehaviorSubject<boolean>(this.hasUserPermission());

  // 2. Ya no necesitamos 'attributes' o 'parsedAttributes' como propiedades de clase.
  //    Se volverían obsoletos (stale) inmediatamente.

  constructor(private http: HttpClient, private ngZone: NgZone, private route: Router) { }

  /**
   * Registra un nuevo usuario.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Inicia sesión de un usuario.
   */
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // 3. ¡EL PASO CLAVE QUE FALTABA!
        // Asumimos que la respuesta incluye los tokens Y el usuario.
        // Ej: { accessToken: '...', refreshToken: '...', user: { id: 1, role: 'admin' } }

        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        
        // 4. Guarda el usuario y ACTUALIZA los observables
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          
          // Notifica a todos los suscriptores (como tu componente)
          this.currentUser$.next(response.user);
          this.isLogin.next(true);
          this.isAdmin.next(response.user.role === 'administrator');
          this.isUser.next(response.user.role === 'user');
        }
      })
    );
  }
  
  /**
   * Cierra la sesión del usuario.
   */
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    
    // 5. Resetea TODOS los observables
    this.currentUser$.next(null);
    this.isLogin.next(false);
    this.isAdmin.next(false);
    this.isUser.next(false);

    this.ngZone.run(() => {
      this.route.navigate(['/']).then(() => window.location.reload());
    });
  }

  // --- MÉTODOS PRIVADOS PARA INICIALIZACIÓN SEGURA ---

  /**
   * Lee el 'currentUser' de localStorage de forma segura.
   */
  private getSafeCurrentUser(): CurrentUserI | null {
    const user = localStorage.getItem('currentUser');
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  }

  /**
   * Obtiene el rol del usuario de forma segura.
   */
  private getSafeUserRole(): string | null {
    const user = this.getSafeCurrentUser();
    return user?.role || null;
  }

  /**
   * Verifica si existe un token de acceso.
   */
  public hasToken(): boolean {
    // 6. Corregido para buscar 'accessToken'
    return !!localStorage.getItem("accessToken");
  }

  /**
   * Verifica si el usuario actual es administrador.
   */
  public hasAdminPermission(): boolean {
    return this.getSafeUserRole() === 'administrator';
  }

  /**
   * Verifica si el usuario actual es un usuario normal.
   */
  public hasUserPermission(): boolean {
    return this.getSafeUserRole() === 'user';
  }

  // --- FIN DE LA CORRECCIÓN ---

  // Estos métodos parecen ser para un flujo de Google Login,
  // pero no estaban siendo usados en el login normal.
  setCurrentUser(data: CurrentUserI) {
    localStorage.setItem("currentUser", JSON.stringify(data));
    this.currentUser$.next(data); // <-- También debe actualizar el observable
    return this.currentUser$.asObservable();
  }

  currentUser(data: any) {
    return JSON.parse(data);
  }
}