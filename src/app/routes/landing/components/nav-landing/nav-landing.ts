import { AfterViewInit, Component } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-nav-landing',
  imports: [],
  templateUrl: './nav-landing.html',
  styleUrl: './nav-landing.css'
})
export class NavLanding implements AfterViewInit {
  ngAfterViewInit(): void {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } }); // Establece un ease por defecto para toda la timeline
    gsap.registerPlugin(ScrollTrigger);

    // Animación de la barra de navegación y el botón de login
    tl.fromTo(["nav", ".login-button-transition"],
      { opacity: 0, y: -50 }, // Estado inicial: oculto y ligeramente arriba
      { opacity: 1, y: 0, duration: 1.2 }, // Estado final: visible y en posición
      0 // Inicia esta animación inmediatamente (al principio de la timeline)
    );
  }
}
