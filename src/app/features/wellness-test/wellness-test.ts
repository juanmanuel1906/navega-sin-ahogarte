import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wellness-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wellness-test.html',
  styleUrls: ['./wellness-test.css']
})
export class WellnessTest {

  // Define el estado actual de la pantalla del test
  currentScreen: 'start' | 'questions' | 'result' = 'start';

  // Banco de preguntas. Cada respuesta tiene un puntaje asociado.
  questions = [
    { text: '¿Sientes la necesidad de revisar tu celular apenas te despiertas?', answers: [ {text: 'Siempre', score: 3}, {text: 'A veces', score: 2}, {text: 'Rara vez', score: 1}, {text: 'Nunca', score: 0} ] },
    { text: '¿Te sientes ansioso/a o de mal humor cuando no tienes acceso a internet?', answers: [ {text: 'Muy a menudo', score: 3}, {text: 'A veces', score: 2}, {text: 'Casi nunca', score: 1}, {text: 'Nunca', score: 0} ] },
    { text: '¿Comparas tu vida con la de otros en redes sociales?', answers: [ {text: 'Constantemente', score: 3}, {text: 'Frecuentemente', score: 2}, {text: 'Pocas veces', score: 1}, {text: 'No lo hago', score: 0} ] },
    { text: '¿El uso de pantallas afecta tus horas de sueño?', answers: [ {text: 'Sí, mucho', score: 3}, {text: 'Un poco', score: 2}, {text: 'No estoy seguro/a', score: 1}, {text: 'No, para nada', score: 0} ] },
    { text: '¿Sientes que te estás perdiendo de algo importante si no estás conectado/a (FOMO)?', answers: [ {text: 'Totalmente', score: 3}, {text: 'A veces', score: 2}, {text: 'Rara vez', score: 1}, {text: 'Nunca', score: 0} ] }
  ];

  // Variables para controlar el estado del test
  currentQuestionIndex = 0;
  totalScore = 0;
  finalResult: any = null;

  // Inicia el test cambiando la pantalla visible
  startTest(): void {
    this.currentScreen = 'questions';
  }

  // Procesa la respuesta del usuario, actualiza el puntaje y avanza a la siguiente pregunta
  selectAnswer(score: number): void {
    this.totalScore += score;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResult();
    }
  }
  
  // Calcula el progreso para la barra visual
  get progressPercentage(): number {
    return (this.currentQuestionIndex / this.questions.length) * 100;
  }

  // Determina y muestra el resultado final basado en el puntaje total
  showResult(): void {
    let resultKey = 'verde';
    if (this.totalScore > 9) {
      resultKey = 'rojo';
    } else if (this.totalScore > 4) {
      resultKey = 'amarillo';
    }

    const results = {
      verde: {
        visualClass: 'bg-green-400',
        icon: 'ph-fill ph-smiley',
        title: 'Tu bienestar es Óptimo',
        description: '¡Felicidades! Tienes hábitos digitales muy saludables. Sigue así y explora nuestro contenido para mantenerte fuerte.'
      },
      amarillo: {
        visualClass: 'bg-yellow-400',
        icon: 'ph-fill ph-smiley-meh',
        title: 'Tu bienestar es Regular',
        description: 'Hay algunas áreas donde puedes mejorar. No te preocupes, estás en el lugar correcto para aprender y crecer.'
      },
      rojo: {
        visualClass: 'bg-red-500',
        icon: 'ph-fill ph-smiley-sad',
        title: 'Tu bienestar necesita Atención',
        description: 'Es momento de tomar acción. Te recomendamos empezar por nuestro Kit de Emergencia y conectar con la comunidad.'
      }
    };
    
    this.finalResult = results[resultKey as keyof typeof results];
    this.currentScreen = 'result';
  }

  retakeTest(): void {
    this.currentQuestionIndex = 0;
    this.totalScore = 0;
    this.finalResult = null;
    this.currentScreen = 'questions';
  }
}