import { Component, ElementRef, QueryList, ViewChildren, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-partner-brands',
  templateUrl: './partner-brands.html',
  styleUrl: './partner-brands.css'
})
export class PartnerBrands implements AfterViewInit, OnDestroy {
  allies = [
    { name: "Cofincafé", image: 'logos/cofincafe-logo.webp' },
    { name: "Comfenalco", image: 'logos/comfenalco-logo.webp' },
    { name: "Hospital de Salud Mental Quindío", image: 'logos/hsm-logo-no-bg.webp' },
    { name: "Gobernación del Quindío", image: 'logos/gobernacion-logo.webp' },
    { name: "Universidad del Quindío", image: 'logos/uq-logo.webp' },
    { name: "TRINEO", image: 'logos/trineo-logo.webp' }
  ];

  @ViewChildren('allyLogo') allyLogos!: QueryList<ElementRef>;
  private timelines: gsap.core.Timeline[] = [];

  ngAfterViewInit() {
    this.initOrbit();
  }

  @HostListener('window:resize')
  onResize() {
    this.initOrbit(); // Recalcula al cambiar el tamaño de pantalla
  }

  initOrbit() {
    // Limpiamos animaciones previas para evitar fugas de memoria
    this.timelines.forEach(tl => tl.kill());
    this.timelines = [];

    const logos = this.allyLogos.toArray();
    const totalLogos = logos.length;

    // Definimos el radio como el 30% del ancho de pantalla, 
    // pero con un máximo de 250px para desktop y un mínimo de 100px para móvil.
    const radius = Math.max(Math.min(window.innerWidth * 0.2, 250), 80);

    logos.forEach((logo, index) => {
      const startAngle = (index / totalLogos) * Math.PI * 2;
      const obs = { angle: startAngle };

      const tl = gsap.timeline({ repeat: -1 });
      this.timelines.push(tl);

      tl.to(obs, {
        angle: startAngle + Math.PI * 2,
        duration: 15,
        ease: "none",
        onUpdate: () => {
          // Círculo perfecto: mismo radio para X e Y
          const x = Math.cos(obs.angle) * radius;
          const y = Math.sin(obs.angle) * radius;

          gsap.set(logo.nativeElement, {
            x: x,
            y: y,
            // Eliminamos rotación excesiva para mantener legibilidad de las marcas
            rotation: 0 
          });
        }
      });
    });
  }

  ngOnDestroy() {
    this.timelines.forEach(tl => tl.kill());
  }
}