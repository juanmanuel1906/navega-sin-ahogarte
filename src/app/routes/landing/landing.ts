import { AfterViewInit, Component } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLanding } from './components/nav-landing/nav-landing';
import { CallToActionLanding } from './components/call-to-action-landing/call-to-action-landing';

@Component({
  selector: 'app-landing',
  imports: [NavLanding, CallToActionLanding],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements AfterViewInit {
  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo("#title-navega",
      { // Estado inicial (FROM)
        x: -1000, // Comienza 1000px fuera de la pantalla por la izquierda
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: "#title-navega", // El elemento que activa la animación
          start: "top -10%",      // Comienza cuando la parte superior del elemento llega al centro de la pantalla
          toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
          //markers: true // Cambia a true para ver los marcadores de debug
        }
      },
      { // Estado final (TO)
        x: 0, // Termina en su posición original
        opacity: 1,
          scrollTrigger: {
            trigger: "#title-navega", // El elemento que activa la animación
            end: "top 10%",       // Termina cuando la parte inferior del elemento llega al centro de la pantalla
            toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
            //markers: true // Cambia a true para ver los marcadores de debug
          }
      }
    );
 
    gsap.fromTo("#title-sin-ahogarte",
      { // Estado inicial (FROM)
        x: 1000, // Comienza 1000px fuera de la pantalla por la derecha
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: "#title-navega", // El elemento que activa la animación
          start: "top -10%",      // Comienza cuando la parte superior del elemento llega al centro de la pantalla
          toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
          //markers: true // Cambia a true para ver los marcadores de debug
        }
      },
      { // Estado final (TO)
        x: 0, // Termina en su posición original
        opacity: 1,
          scrollTrigger: {
            trigger: "#title-navega", // El elemento que activa la animación
            end: "top 10%",       // Termina cuando la parte inferior del elemento llega al centro de la pantalla
            toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
            //markers: true Cambia a true para ver los marcadores de debug
          }
      }
    );


    // Animación del párrafo 'p' (aparecer de la nada)
    /*tl.fromTo("#description-text",
      { opacity: 0, scale: 0.8 }, // Estado inicial: oculto y ligeramente encogido
      { opacity: 1, scale: 1, duration: 0.5 }, // Estado final: visible y tamaño normal
      "<0.2" // Inicia 0.2 segundos después de que el título "sin ahogarte" empezó
    );*/
    gsap.fromTo("#description-text", {
      opacity: 0,
      scale: 0.8,
      scrollTrigger: {
          trigger: "#description-text", // El elemento que activa la animación
          start: "top -10%",      // Comienza cuando la parte superior del elemento llega al centro de la pantalla
          toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
          //markers: true // Cambia a true para ver los marcadores de debug
        }
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      scrollTrigger: {
        trigger: "#description-text", // El elemento que activa la animación
        end: "top 10%",       // Termina cuando la parte inferior del elemento llega al centro de la pantalla
        toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
        //markers: true Cambia a true para ver los marcadores de debug
      }
    });


    // Animación del botón del test desde abajo
    gsap.fromTo(".test-button-transition",
      { opacity: 0, 
        scale: 0.1,
        scrollTrigger: {
          trigger: ".test-button-transition", // El elemento que activa la animación
          start: "top -10%",      // Comienza cuando la parte superior del elemento llega al centro de la pantalla
          toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
          //markers: true // Cambia a true para ver los marcadores de debug
        }
      }, // Estado inicial: oculto y abajo
      { opacity: 1,
        scale: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: ".test-button-transition", // El elemento que activa la animación
          end: "top 15%",       // Termina cuando la parte inferior del elemento llega al centro de la pantalla
          toggleActions: "play reverse play reverse", // Reproduce, revierte, reproduce, revierte
          //markers: true // Cambia a true para ver los marcadores de debug
        }
      },
    );
  }
}
