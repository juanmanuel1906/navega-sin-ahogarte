import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YouTubePlayer } from '@angular/youtube-player';
import { TestResultsService } from './test-results.service';
import { DeviceIdService } from '../../core/services/device-id.service';

@Component({
  selector: 'app-wellness-test',
  standalone: true,
  imports: [CommonModule, YouTubePlayer],
  templateUrl: './wellness-test.html',
  styleUrls: ['./wellness-test.css']
})
export class WellnessTest {

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
    { text: 'Siempre', score: 3 }, { text: 'A veces', score: 2 }, { text: 'Rara vez', score: 1 }, { text: 'Nunca', score: 0 }
  ];

  // Banco de preguntas principal
  /*testQuestions = [
    { text: 'Me siento inquieto/a si no puedo revisar el celular o el computador.' },
    { text: 'Las notificaciones me distraen cuando estoy ocupado/a.' },
    { text: 'He perdido horas de sueño por quedarme frente a una pantalla.' },
    { text: 'Me molesta que me interrumpan cuando estoy conectado/a.' },
    { text: 'He intentado reducir mi uso de pantallas, pero no lo logro.' },
    { text: 'El uso de pantallas ha afectado mis estudios, trabajo o relaciones.' },
    { text: 'Interrumpo lo que estoy haciendo para revisar el celular.' },
    { text: 'Pienso en redes o mensajes incluso cuando no las estoy usando.' },
    { text: 'Me siento ansioso/a si no respondo rápido un mensaje.' },
    { text: 'Me pongo nervioso/a cuando no tengo señal o batería.' },
    { text: 'Me comparo con lo que otros publican y me siento peor.' },
    { text: 'Siento que me pierdo cosas si no reviso redes seguido.' },
    { text: 'Uso el teléfono en la cama justo antes de dormir.' },
    { text: 'Me despierto en la noche para revisar notificaciones.' },
    { text: 'Dejo de hacer cosas que disfruto por estar conectado/a.' },
    { text: 'Las interrupciones digitales afectan mi productividad.' },
    { text: 'Planeo descansar de pantallas, pero termino usándolas igual.' },
    { text: 'Paso más tiempo conectado/a del que había planeado.' },
    { text: 'Uso el celular en situaciones peligrosas (ej. conduciendo).' },
    { text: 'He tenido conflictos importantes por el tiempo que paso conectado/a.' }
  ];*/

  testQuestions = [
    { text: '¿Sientes la necesidad de revisar tu celular apenas te despiertas?' },
    { text: '¿Te sientes ansioso/a o de mal humor cuando no tienes acceso a internet?' },
    { text: '¿Comparas tu vida con la de otros en redes sociales?' },
    { text: '¿El uso de pantallas afecta tus horas de sueño?' },
    { text: '¿Sientes que te estás perdiendo de algo importante si no estás conectado/a (FOMO)?' },
  ];
  
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
      title: 'Clínico', 
      icon: 'ph-fill ph-heartbeat text-white', 
      color: 'text-blue-600', 
      videoId: '_9agX3gY1jU',
      allies: [
        { name: 'Hospitales Aliados', description: 'Acceso a profesionales en centros de salud mental.', icon: 'ph-fill ph-hospital' },
        { name: 'Línea Amiga de Apoyo', description: 'Soporte telefónico inmediato y confidencial 24/7.', icon: 'ph-fill ph-phone-call' }
      ],
      offerings: ['Talleres de manejo de ansiedad', 'Guías de primeros auxilios psicológicos', 'Terapia individual y grupal'],
      link: '#enlace-clinico', // Enlace directo a la página de recursos
      disclaimer: 'Estos son recursos de apoyo, no reemplazan una consulta médica. En caso de emergencia, contacta a tu servicio de salud local.' 
    },
    { 
      id: 'sports', 
      title: 'Deportivo', 
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
      title: 'Espiritual', 
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
      title: 'Nutrición', 
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

  selectedBoat: any = null;

  constructor(private sanitizer: DomSanitizer, 
              private testResultsService: TestResultsService, 
              private deviceIdService: DeviceIdService
  ) {}


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

  // ACTUALIZADO: Lógica de respuesta simplificada
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

  // ACTUALIZADO: Barra de progreso simplificada
  get testProgressPercentage(): number {
    return (this.currentQuestionIndex / this.testQuestions.length) * 100;
  }

  showFinalResult(): void {
    console.log('Pantalla', this.currentScreen);
    let resultKey = 'verde';
    
    if (this.totalScore > 9) {
      resultKey = 'rojo';
    } else if (this.totalScore > 4) {
      resultKey = 'amarillo';
    }

    // Los nuevos umbrales están basados en un puntaje máximo de 80.
    /*if (this.totalScore >= 54) { 
      resultKey = 'rojo';
    } else if (this.totalScore >= 27) {
      resultKey = 'amarillo';
    }*/
    // Si el puntaje es de 0 a 26, se mantiene como 'verde'.

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

    console.log('Pantalla 2', this.currentScreen);

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

    /*
    this.testResultsService.saveResult(resultData).subscribe({
      next: (response) => console.log('Resultado guardado con éxito en la BD.', response),
      error: (error) => console.error('Hubo un error al guardar el resultado.', error)
    });*/
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