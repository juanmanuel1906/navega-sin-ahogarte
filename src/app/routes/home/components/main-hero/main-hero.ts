import { AfterViewInit, Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap/gsap-core';

@Component({
  selector: 'app-main-hero',
  imports: [RouterLink],
  templateUrl: './main-hero.html',
  styleUrl: './main-hero.css'
})
export class MainHero implements AfterViewInit {
  ngAfterViewInit() {
    gsap.ticker.lagSmoothing(1000, 16);
    // Iniciamos los dos flujos de partículas
    this.startParticleFlow('mouth-emitter', 'animations/bubble.png', 800, 'bubble');
    this.startParticleFlow('phone-emitter', 'animations/like.png', 1200, 'like');
  }

  private intervals: any[] = [];

  @HostListener('document:visibilitychange', [])
  onVisibilityChange() {
    if (document.hidden) {
      // Limpiamos los intervalos para que no se creen imágenes en el DOM
      this.intervals.forEach(id => clearInterval(id));
      this.intervals = [];
    } else {
      // Reiniciamos el flujo cuando el usuario vuelve
      this.startParticleFlow('mouth-emitter', 'animations/bubble.png', 800, 'bubble');
      this.startParticleFlow('phone-emitter', 'animations/like.png', 1200, 'like');
    }
  }

  startParticleFlow(emitterId: string, assetPath: string, interval: number, type: 'bubble' | 'like') {
    const emitter = document.getElementById(emitterId);
    if (!emitter) return;

    const id = setInterval(() => {
      const p = document.createElement('img');
      p.src = assetPath;
      p.style.position = 'absolute';
      p.style.width = type === 'like' ? '40px' : '15px';
      p.style.opacity = '0';
      p.style.pointerEvents = 'none';
      emitter.appendChild(p);

      // Lógica de movimiento diferenciada
      const xTarget = type === 'bubble' ? 50 + Math.random() * 30 : 60 + Math.random() * 30;
      const yTarget = type === 'bubble' ? -100 - Math.random() * 50 : -200 - Math.random() * 200;

      gsap.to(p, {
        duration: type === 'bubble' ? 3 : 1,
        x: xTarget,
        y: yTarget,
        rotation: type === 'like' ? Math.random() * 45 : 0,
        opacity: 1,
        scale: type === 'bubble' ? 10 : 15,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(p, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => p.remove()
          });
        }
      });
    }, interval);
    this.intervals.push(id);
  }

}
