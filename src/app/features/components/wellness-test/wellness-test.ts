import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
import { TestResultsService } from './test-results.service';
import { DeviceIdService } from '../../../core/services/device-id.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-wellness-test',
  standalone: true,
  imports: [CommonModule, YouTubePlayer],
  templateUrl: './wellness-test.html',
  styleUrls: ['./wellness-test.css']
})
export class WellnessTest implements OnInit, AfterViewInit {

  // Se simplifican los estados de la pantalla
  currentScreen: 'start' | 'initial-data' | 'test-questions' | 'result' = 'start';
  resultStep: 'initial' | 'boats' = 'initial';

  // Almacena los datos iniciales del usuario
  userProfile: { [key: string]: string } = {};

  // Preguntas de perfil en formato interactivo
  profileQuestions = [
    { key: 'age', text: '¿Cuál es tu rango de edad?', options: ['6–11', '12–17', '18–29', '30–44', '45–59', '60+'] },
    { key: 'gender', text: '¿Con qué género te identificas?', options: ['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo'] },
    { key: 'role', text: '¿Cuál es tu rol principal?', options: ['Niño/a', 'Adolescente', 'Adulto', 'Padre/Madre/Cuidador', 'Docente', 'Trabajador/Empleado', 'Empresario/Líder'] },
    { key: 'screenTime', text: '¿Cuántas horas al día usas pantallas en promedio?', options: ['1–2 h', '3–4 h', '5–6 h', '7–8 h', '9+ h'] }
  ];
  profileQuestionIndex = 0;

  /*answerScale = [
    { text: 'Nunca', score: 0 }, { text: 'Rara vez', score: 1 }, { text: 'A veces', score: 2 }, { text: 'Frecuentemente', score: 3 }, { text: 'Siempre', score: 4 }
  ];*/

  answerScale = [
    { text: 'Siempre', score: 4 }, { text: 'A veces', score: 3 }, { text: 'Rara vez', score: 1 }, { text: 'Nunca', score: 0 }
  ];

  answerCriticalScale = [
    { text: 'Sí', score: 10 }, { text: 'No', score: 0 }
  ];

  // Banco de preguntas principal
  testQuestions = [
    { text: 'Me siento inquieto/a si no puedo revisar el celular o el computador.', isCritical: false },
    { text: 'Las notificaciones me distraen incluso cuando estoy ocupado/a en otra cosa.', isCritical: false },
    { text: 'He perdido horas de sueño por quedarme usando pantallas.', isCritical: false },
    { text: 'Me pongo de mal humor si me interrumpen cuando estoy conectado/a.', isCritical: false },
    { text: 'He intentado reducir mi uso de dispositivos, pero no lo logro.', isCritical: false },
    { text: 'El tiempo en redes o pantallas ha afectado mis estudios, trabajo o relaciones.', isCritical: false },
    { text: 'Interrumpo lo que estoy haciendo para revisar el celular.', isCritical: false },
    { text: 'Pienso en redes o mensajes incluso cuando no estoy conectado/a', isCritical: false },
    { text: 'Paso más tiempo conectado/a de lo que había planeado.', isCritical: false },
    { text: 'Planeo pausas de desconexión, pero no logro cumplirlas.', isCritical: false },
    { text: 'Me pongo ansioso/a si no respondo de inmediato un mensaje.', isCritical: false },
    { text: 'Me estreso cuando no tengo señal o batería.', isCritical: false },
    { text: 'Uso el celular en la cama, justo antes de dormir.', isCritical: false },
    { text: 'Me despierto en la noche para revisar notificaciones.', isCritical: false },
    { text: 'He dejado de hacer actividades que antes disfrutaba por pasar tiempo en pantallas.', isCritical: false },
    { text: 'Mi rendimiento en el estudio o trabajo ha bajado por distracciones digitales.', isCritical: false },
    { text: 'He tenido discusiones o conflictos por el tiempo que paso conectado/a.', isCritical: false },
    { text: 'Me comparo con lo que veo en redes y eso me hace sentir mal.', isCritical: false },
    { text: 'Siento que me pierdo de cosas importantes si no reviso redes constantemente.', isCritical: false },
    { text: 'Uso el celular en momentos o lugares donde puede ser peligroso (ejemplo: mientras conduzco).', isCritical: false },
    { text: 'En los últimos días, mi tristeza o ansiedad han sido tan intensas que me cuesta hacer lo básico.', isCritical: true },
    { text: 'He pensado que la vida no vale la pena o que preferiría no estar aquí.', isCritical: true },
    { text: 'He tenido pensamientos de hacerme daño o de quitarme la vida.', isCritical: true }
  ];

  /*testQuestions = [
    { text: '¿Sientes la necesidad de revisar tu celular apenas te despiertas?' },
    { text: '¿Te sientes ansioso/a o de mal humor cuando no tienes acceso a internet?' },
    { text: '¿Comparas tu vida con la de otros en redes sociales?' },
    { text: '¿El uso de pantallas afecta tus horas de sueño?' },
    { text: '¿Sientes que te estás perdiendo de algo importante si no estás conectado/a (FOMO)?' },
  ];*/
  
  currentQuestionIndex = 0;
  totalScore = 0;
  finalResult: any = null;

  quickRecommendations = [
    'Desactiva notificaciones no esenciales por 7 días.',
    'Establece una hora sin pantallas antes de dormir.',
    'Usa la regla 20-20-20 (cada 20 min, mira algo a 20 pies de distancia por 20 seg).'
  ];
  selectedRecommendation = '';

  // Datos para los "barcos" o puertas de ayuda
  boatsOfSupport = [
    { 
      id: 'clinical', 
      title: 'CLÍNICO', 
      icon: 'ph-fill ph-heartbeat text-white', 
      color: 'text-blue-600', 
      videoId: 'p_mzd4Ceow4',
      allies: [
        { name: 'Hospital Mental de Filandia', description: 'Acceso a profesionales en centros de salud mental.', icon: '/logos/hsm-logo.png' },
      ],
      offerings: ['Talleres de manejo de ansiedad', 'Guías de primeros auxilios psicológicos', 'Terapia individual y grupal'],
      link: '#enlace-clinico', // Enlace directo a la página de recursos
      disclaimer: 'Estos son recursos de apoyo, no reemplazan una consulta médica. En caso de emergencia, contacta a tu servicio de salud local.' 
    },
    { 
      id: 'sports', 
      title: 'DEPORTIVO', 
      icon: 'ph-fill ph-barbell text-white', 
      color: 'text-green-600',
      videoId: 'wTTxj8JohhQ',
      allies: [
        { name: 'Comfenalco', description: 'Programas de bienestar y acceso a centros deportivos de alta calidad.', icon: '/logos/comfenalco.png' },
        { name: 'Real Sport', description: 'Club deportivo que fomenta el bienestar integral a través del deporte.', icon: '/logos/real-sport.jpeg' }
      ],
      // COMPLETADO
      offerings: ['Rutinas de ejercicio en casa', 'Clases de estiramiento guiado', 'Grupos de ciclismo y senderismo'],
      link: '#enlace-deportivo',
      disclaimer: 'Consulta a un médico antes de iniciar cualquier actividad física nueva.' 
    },
    { 
      id: 'spiritual', 
      title: 'ESPIRITUAL', 
      icon: 'ph-fill ph-hands-praying text-white', 
      color: 'text-yellow-400',
      videoId: '7c5t6FkvUG0',
      allies: [
        { name: 'Centro vida', description: 'Espacios dedicados para la práctica de los principios y valores a través de la Biblia.', icon: 'ph-fill ph-person-simple-walk' },
        { name: 'Guías Comunitarios Locales', description: 'Líderes que ofrecen orientación y grupos de apoyo y conversación.', icon: 'ph-fill ph-users-three' }
      ],
      // COMPLETADO
      offerings: ['Prácticas religiosas', 'Ejercicios de gratitud y journaling', 'Círculos de conversación y escucha'],
      link: '#enlace-espiritual',
      disclaimer: 'Respetamos todas las creencias. Esta es una guía de recursos basados en la libertad religiosa.' 
    },
    { 
      id: 'nutrition', 
      title: 'NUTRICIÓN', 
      icon: 'ph-fill ph-orange text-white', 
      color: 'text-red-600',
      videoId: 'Q4qWzbP0q7I',
      allies: [
        { name: 'Nutricionistas Conscientes', description: 'Profesionales enfocados en la relación entre la comida y las emociones.', icon: 'ph-fill ph-user-circle-plus' },
        { name: 'Mercados Orgánicos Locales', description: 'Promoción de alimentos frescos y saludables directamente de productores de la región.', icon: 'ph-fill ph-shopping-cart-simple' }
      ],
      // COMPLETADO
      offerings: ['Menús semanales para mejorar el ánimo', 'Talleres de cocina saludable y consciente', 'Guías de alimentación intuitiva'],
      link: '#enlace-nutricion',
      disclaimer: 'La información presentada es educativa y no constituye una recomendación médica nutricional.' 
    }
  ];

  constructor(private sanitizer: DomSanitizer, 
              private testResultsService: TestResultsService, 
              private deviceIdService: DeviceIdService,
  ) {}

  ngOnInit(): void {

  }

  // Usar ngAfterViewInit para asegurar que el DOM esté listo
  ngAfterViewInit(): void {
    // 1. Registrar el plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Crear la animación
    gsap.from("#wellness-test", {
      // Propiedades de la animación
      opacity: 0,
      x: -300,
      duration: 1,
      ease: 'power2.out',

      // Propiedades de ScrollTrigger
      scrollTrigger: {
        trigger: "#wellness-test", // El elemento que dispara la animación
        start: "top 80%", // Empieza cuando el 80% superior del elemento entra en la vista
        
        // (onEnter, onLeave, onEnterBack, onLeaveBack)
        toggleActions: "play reverse play reverse",
        // markers: true // Descomentar para depurar y ver las líneas
      }
    });
  }

  selectedBoat: any = null;

  startTest(): void {
    this.currentScreen = 'initial-data';
  }
  
  selectProfileAnswer(key: string, value: string): void {
    this.userProfile[key] = value;
    this.profileQuestionIndex++;

    if (this.profileQuestionIndex >= this.profileQuestions.length) {
      this.currentScreen = 'test-questions'; // Pasa al test unificado
    }
  }

  // Lógica de respuesta simplificada
  selectAnswer(score: number): void {
    this.totalScore += score;
    this.currentQuestionIndex++;

    // Si se han respondido todas las preguntas, muestra el resultado
    if (this.currentQuestionIndex >= this.testQuestions.length) {
      this.showFinalResult();
    }
  }

  get profileProgressPercentage(): number {
    return (this.profileQuestionIndex / this.profileQuestions.length) * 100;
  }

  // Barra de progreso simplificada
  get testProgressPercentage(): number {
    return (this.currentQuestionIndex / this.testQuestions.length) * 100;
  }

  showFinalResult(): void {    
    let resultKey = 'verde';

    /* Los umbrales están basados en un puntaje máximo de 90.
      Verde (Uso saludable): 0 - 30 puntos
      Amarillo (Uso moderado): 31 - 60 puntos
      Rojo (Uso problemático): 61 - 90 puntos
    */
    if (this.totalScore >= 61) { 
      resultKey = 'rojo';
    } else if (this.totalScore >= 31) {
      resultKey = 'amarillo';
    }

    /*
    if (this.totalScore > 9) {
      resultKey = 'rojo';
    } else if (this.totalScore > 4) {
      resultKey = 'amarillo';
    }*/

    const results = {
      verde: { visualClass: 'bg-green-400', icon: 'ph-fill ph-smiley', title: 'Uso saludable', description: '¡Felicidades! Tu uso de la tecnología parece equilibrado. Sigue así y explora nuestros recursos para mantenerte fuerte.' },
      amarillo: { visualClass: 'bg-yellow-400', icon: 'ph-fill ph-smiley-meh', title: 'Uso moderado con riesgos', description: 'Hay algunas áreas donde puedes mejorar. Estás en el lugar correcto para aprender y encontrar un mejor equilibrio.' },
      rojo: { visualClass: 'bg-red-500', icon: 'ph-fill ph-smiley-sad', title: 'Uso alto o problemático', description: 'Es momento de tomar acción. Te recomendamos empezar por nuestro Kit de Emergencia y conectar con la comunidad para obtener apoyo.' }
    };

    // Selecciona una recomendación aleatoria
    const randomIndex = Math.floor(Math.random() * this.quickRecommendations.length);
    this.selectedRecommendation = this.quickRecommendations[randomIndex];
    
    this.finalResult = results[resultKey as keyof typeof results];
    this.currentScreen = 'result';

    this.saveResultsToDatabase(resultKey);
  }

  // 5. Nueva función que prepara y envía los datos
  saveResultsToDatabase(resultCategory: string): void {
    const resultData = {
      device_id: this.deviceIdService.getDeviceId(),
      age_range: this.userProfile['age'],
      gender: this.userProfile['gender'],
      user_role: this.userProfile['role'],
      screen_time: this.userProfile['screenTime'],
      final_score: this.totalScore,
      result_category: resultCategory
    };

    this.testResultsService.saveResult(resultData).subscribe({
      next: (response) => console.log('Resultado guardado con éxito en la BD.', response),
      error: (error) => console.error('Hubo un error al guardar el resultado.', error)
    });
  }

  retakeTest(): void {
    this.currentScreen = 'start';
    this.resultStep = 'initial';
    this.userProfile = {};
    this.profileQuestionIndex = 0;
    this.currentQuestionIndex = 0;
    this.totalScore = 0;
    this.finalResult = null;
  }

  // Métodos para manejar la selección de los barcos
  selectBoat(boat: any): void {
    this.selectedBoat = boat;
  }

  closeBoatDetail(): void {
    this.selectedBoat = null;
  }

  // Método para avanzar al paso de los barcos
  showBoats(): void {
    this.resultStep = 'boats';
  }

  // Método para avanzar al paso de los barcos
  hideBoats(): void {
    this.resultStep = 'initial';
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}