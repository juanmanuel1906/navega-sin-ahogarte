import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHero } from "./components/main-hero/main-hero";
import { PartnerBrands } from "./components/partner-brands/partner-brands";
import { ReviewAnonymousPost } from "./components/review-anonymous-post/review-anonymous-post";
import { ReviewWellnessTest } from "./components/review-wellness-test/review-wellness-test";
import { GalleryResources } from "./components/gallery-resources/gallery-resources";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MainHero, PartnerBrands, ReviewAnonymousPost, ReviewWellnessTest, GalleryResources],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  participationMode: 'profile' | 'anonymous' | null = null;
  participationData: any = {};
  finalUrl: string = '';

  slides: any[] = [
    {
      feature: 'Test de Bienestar',
      icon: 'ph-fill ph-question primary-purple',
      description: 'Descubre tu estado con un test interactivo y recibe una ruta personalizada.',
      image: '/images/wellnest-test-illustration.png',
      alt: 'Ilustración de los personajes realizando el Test de Bienestar'
    },
    {
      feature: 'Comunidad Anónima',
      icon: 'ph-fill ph-chats-circle main-blue',
      description: 'Conecta y comparte en un espacio seguro donde tu voz es escuchada.',
      image: '/images/ansiosos-anonimos-illustration.png',
      alt: 'Ilustración de los personajes interactuando en la Comunidad Anónima'
    },
    {
      feature: 'Contenido Educativo',
      icon: 'ph-fill ph-books text-green-600',
      description: 'Aprende a tu ritmo con videos, podcasts y guías sobre salud mental.',
      image: '/images/educative-content-illustration.png',
      alt: 'Ilustración de los personajes consumiendo Contenido Educativo'
    },
    {
      feature: 'Kit de Emergencia',
      icon: 'ph-fill ph-lifebuoy text-red-600',
      description: 'Accede a líneas de ayuda y agenda sesiones cuando más lo necesites.',
      image: '/images/kit-emergencia-illustration.png',
      alt: 'Ilustración de un personaje usando el Kit de Emergencia'
    }
  ];

  currentSlide = 0;

  constructor() {
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

  ngOnInit(): void {
    this.startCarousel();
  }

  startCarousel(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 9500); // Cambia cada 9.5 segundos
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