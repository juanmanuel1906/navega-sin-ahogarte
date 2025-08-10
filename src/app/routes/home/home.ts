import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WellnessTest } from "../../features/wellness-test/wellness-test";
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, WellnessTest],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  slides: any[] = [
    {
      feature: 'Test de Bienestar',
      icon: 'ph-fill ph-question main-purple',
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

  constructor() { }

  ngOnInit(): void {
    AOS.init();
    this.startCarousel();
  }

  startCarousel(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 9500); // Cambia cada 9.5 segundos
  }
}