import { Component } from '@angular/core';
import { AnonymousPost } from '../../components/anonymous-post/anonymous-post';
import { CommunityPostEntryComponent } from "../../components/community-post-entry/community-post-entry";
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anonymous-post-admin',
  imports: [AnonymousPost, CommunityPostEntryComponent, CommonModule],
  templateUrl: './anonymous-post-admin.html',
  styleUrl: './anonymous-post-admin.css',
})
export class AnonymousPostAdmin {
  participationMode: 'profile' | 'anonymous' | null = null;
  participationData: any = {};

  isAdmin$!: Observable<boolean>;
  
  constructor(private authService: AuthService) {
    this.isAdmin$ = this.authService.isAdmin;

    // Revisa si ya existe una elección guardada en la sesión
    const storedNickname = sessionStorage.getItem('anonymousNickname');
    const storedMode = sessionStorage.getItem('participationMode');

    if (storedMode) {
        this.participationMode = storedMode as 'profile' | 'anonymous';
        this.participationData = {
            mode: this.participationMode,
            nickname: storedNickname || 'Anónimo'
        };
    }
  }

  onModeSelected(data: { mode: 'profile' | 'anonymous', nickname?: string } | any) {
    this.participationMode = data.mode;
    this.participationData = data;
    
    // Guarda la elección en sessionStorage para recordarla si el usuario recarga la página
    sessionStorage.setItem('participationMode', data.mode);
    if (data.mode === 'anonymous') {
      sessionStorage.setItem('anonymousNickname', data.nickname || '');
    } else {
      // Si elige perfil, puedes limpiar el apodo anónimo guardado
      sessionStorage.removeItem('anonymousNickname');
    }
  }

  /**
   * Este método se llamará cuando el hijo emita el evento 'exitParticipation'.
   * Restablece el estado para volver a mostrar la pantalla de selección.
   */
  handleExit(): void {
    this.participationMode = null;
  }
}
