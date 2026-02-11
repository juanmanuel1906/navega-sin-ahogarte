import { Component, OnInit, OnDestroy, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningService } from './e-learning.service';
import { Module, QuestionI, OptionI, CourseI } from '../../../core/models/e-learning';
import { MainLoader } from "../../../core/shared/main-loader/main-loader";

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [CommonModule, MainLoader],
  templateUrl: './e-learning.html',
  styleUrls: ['./e-learning.css']
})
export class ELearning implements OnInit, AfterViewInit, OnDestroy {

  constructor(private learningService: LearningService) { }

  @ViewChild('youtubeContainer') youtubeContainer!: ElementRef<HTMLDivElement>;

  // --- STATE ---
  courses = signal<CourseI[]>([]);
  selectedCourse: any = signal<CourseI | null>(null);

  // Datos del curso activo
  courseTitle = signal<string>('');
  modules = signal<Module[]>([]);

  activeModuleId = signal<number>(0);
  completedModules = signal<number[]>([]);

  // UI State
  loading = signal<boolean>(true);
  isVideoEnded = signal<boolean>(false);
  showQuiz = signal<boolean>(false);

  // Quiz State
  currentQuestionIndex = signal<number>(0);
  currentAnswers = signal<Record<number, string | number>>({});
  quizFinished = signal<boolean>(false);
  quizPassed = signal<boolean>(false);
  currentScore = signal<number>(0);

  // --- COMPUTED ---
  currentModule = computed(() => this.modules().find(m => m.id === this.activeModuleId()));

  progressPercentage = computed(() => {
    if (this.modules().length === 0) return 0;
    return Math.round((this.completedModules().length / this.modules().length) * 100);
  });

  allModulesCompleted = computed(() =>
    this.modules().length > 0 && this.completedModules().length === this.modules().length
  );

  currentQuestion = computed(() => {
    const mod = this.currentModule();
    return (mod && mod.questions) ? mod.questions[this.currentQuestionIndex()] : null;
  });

  isLastQuestion = computed(() => {
    const mod = this.currentModule();
    return mod ? this.currentQuestionIndex() === mod.questions.length - 1 : true;
  });

  scorePercentage = computed(() => {
    console.log("CURRENT SCORE: ", this.currentScore());

    const mod = this.currentModule();
    if (!mod || !mod.questions || mod.questions.length === 0) return 0;
    return Math.round((this.currentScore() / mod.questions.length) * 100);
  });

  private player: any;

  ngOnInit() {
    this.loadAllCourses();
  }

  loadAllCourses() {
    this.loading.set(true);

    this.learningService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);

        // --- 1. LÓGICA DE PROGRESO (Ajustada a tu JSON) ---
        const completedIds: number[] = [];

        if (data) {
          data.forEach((course: any) => {
            if (course.modules) {
              course.modules.forEach((mod: any) => {
                // CORRECCIÓN: Usamos 'userProgress' tal como viene en tu JSON
                // Verificamos que el array tenga datos y el flag 'is_completed' sea true
                if (mod.userProgress && mod.userProgress.length > 0 && mod.userProgress[0].is_completed) {
                  completedIds.push(mod.id);
                }
              });
            }
          });
        }

        // Al llenar esta señal, Angular actualiza automáticamente la barra de porcentaje y los checks
        this.completedModules.set(completedIds);
        // -----------------------------

        // --- 2. SELECCIÓN INTELIGENTE DEL MÓDULO ---
        if (data && data.length === 1) {
          const singleCourse = data[0];

          this.selectedCourse.set(singleCourse);
          this.courseTitle.set(singleCourse.title);
          this.modules.set(singleCourse.modules || []);

          if (singleCourse.modules && singleCourse.modules.length > 0) {
            // Buscamos el primer módulo que NO esté en la lista de completados
            const firstUnfinishedModule = singleCourse.modules.find(
              (m: any) => !completedIds.includes(m.id)
            );

            if (firstUnfinishedModule) {
              this.selectModule(firstUnfinishedModule.id);
            } else {
              // Si ya acabó todo (Curso al 100%), lo llevamos al primero para que repase
              this.selectModule(singleCourse.modules[0].id);
            }
          }

          this.loading.set(false);

        } else {
          this.loading.set(false);
        }
      },
      error: (err) => {
        console.error("Error cargando cursos", err);
        this.loading.set(false);
      }
    });
  }

  // --- YOUTUBE & QUIZ LOGIC (Igual que antes) ---
  ngAfterViewInit() { this.loadYouTubeAPI(); }
  ngOnDestroy() { if (this.player) this.player.destroy(); }

  loadYouTubeAPI() {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);
      (window as any).onYouTubeIframeAPIReady = () => { if (this.selectedCourse) this.initPlayer(); };
    } else {
      if (this.selectedCourse) this.initPlayer();
    }
  }

  initPlayer() {
    const module = this.currentModule();
    // Validamos que el elemento HTML exista
    if (!module || !this.youtubeContainer || !this.youtubeContainer.nativeElement) return;

    // VERIFICACIÓN ESTRICTA:
    // No basta con saber si this.player existe. Debemos preguntar si tiene el método que necesitamos.
    if (this.player && typeof this.player.loadVideoById === 'function') {
      try {
        this.player.loadVideoById(module.videoId);
      } catch (error) {
        console.warn("El player falló al cargar, reiniciando...", error);
        this.createPlayer(module.videoId); // Fallback: recrear si falla
      }
    } else {
      // Si this.player es null, o existe pero no tiene el método (está corrupto), creamos uno nuevo.
      this.createPlayer(module.videoId);
    }
  }

  // Helper para no repetir código y asegurar limpieza
  createPlayer(videoId: string) {
    // 1. BLINDAJE: Si la API de YouTube aún no existe en 'window', detenemos todo.
    if (!(window as any).YT || !(window as any).YT.Player) {
      console.warn("YouTube API aún no está lista. Esperando...");
      return;
    }

    // Limpieza previa (por si acaso)
    if (this.player && typeof this.player.destroy === 'function') {
      try { this.player.destroy(); } catch (e) { }
    }

    // AHORA ES SEGURO CREARLO
    this.player = new (window as any).YT.Player(this.youtubeContainer.nativeElement, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: { 'playsinline': 1, 'modestbranding': 1, 'rel': 0 },
      events: { 'onStateChange': this.onPlayerStateChange.bind(this) }
    });
  }

  onPlayerStateChange(event: any) {
    // ESTADO 1: REPRODUCIENDO (PLAY)
    if (event.data === 1) {
      this.learningService.startVideo(this.activeModuleId()).subscribe({
        error: (err) => console.error("Error iniciando timer:", err)
      });
    }

    // ESTADO 0: TERMINADO (ENDED)
    if (event.data === 0) {
      console.log("Video finalizado en YouTube. Validando con backend...");

      this.learningService.completeVideo(this.activeModuleId()).subscribe({
        next: (response) => {
          console.log("Validación exitosa:", response);
          // Si el backend dice OK, mostramos el botón
          if (!this.isModuleCompleted(this.activeModuleId())) {
            this.isVideoEnded.set(true);
          }
        },
        error: (err) => {
          console.error("Error validando video:", err);
          // Opcional: Mostrar alerta al usuario si hizo trampa
          if (err.status === 403) {
            alert("El sistema detectó que no viste el video completo. Por favor, míralo sin saltar partes.");
          }
        }
      });
    }
  }

  isModuleCompleted(id: number): boolean { return this.completedModules().includes(id); }

  isModuleLocked(id: number): boolean {
    const index = this.modules().findIndex(m => m.id === id);
    if (index <= 0) return false;
    return !this.isModuleCompleted(this.modules()[index - 1].id);
  }

  selectModule(id: number) {
    if (this.isModuleLocked(id)) return;

    // Si existe un player viejo, lo destruimos y limpiamos la variable.
    // Esto obliga a initPlayer() a crear uno nuevo conectado al DOM fresco.
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    this.activeModuleId.set(id);
    this.showQuiz.set(false);
    this.quizFinished.set(false);
    this.currentScore.set(0);
    this.currentQuestionIndex.set(0);
    this.currentAnswers.set({});

    // Verificamos si ya estaba completado para mostrar botón inmediatamente
    const isCompleted = this.isModuleCompleted(id);
    this.isVideoEnded.set(isCompleted);

    // Damos un respiro a Angular para que pinte el <div> antes de montar YouTube
    setTimeout(() => this.initPlayer(), 100);
  }

  startQuiz() { this.showQuiz.set(true); }

  selectOption(optionId: string | number) {
    const q = this.currentQuestion();
    if (q) this.currentAnswers.update(prev => ({ ...prev, [q.id]: optionId }));
  }

  nextQuestion() {
    if (this.isLastQuestion()) this.finishQuiz();
    else this.currentQuestionIndex.update(v => v + 1);
  }

  prevQuestion() { if (this.currentQuestionIndex() > 0) this.currentQuestionIndex.update(v => v - 1); }

  finishQuiz() {
    console.log("FINISH COUNT");

    const mod = this.currentModule();
    if (!mod || !mod.questions) return; // Validación de seguridad

    const questions = mod.questions;
    let correctCount = 0;

    // VERIFICACIÓN DE RESPUESTAS ---
    questions.forEach((q: QuestionI) => {
      console.log("Question: ", q);

      // ID de la opción que el usuario seleccionó
      const userSelectedId = this.currentAnswers()[q.id];

      // Buscamos cuál es la opción correcta en la lista de opciones de la pregunta
      // (Esto funciona porque el backend envía isCorrect: true/false en las opciones)
      const correctOption = q.options.find((o: OptionI) => o.is_correct);

      // Comparamos IDs (convertimos a String para evitar errores de tipo '1' vs 1)
      if (correctOption && String(correctOption.id) === String(userSelectedId)) {
        correctCount++;
      }
    });

    console.log("CORRECT COUNT: ", correctCount);

    // CÁLCULO DE PUNTAJE (0 - 100) ---
    // Si hay 4 preguntas y acierta 3: (3 / 4) * 100 = 75
    const finalScore = Math.round((correctCount / questions.length) * 100);

    // Actualizamos señales locales para mostrar en pantalla inmediatamente
    this.currentScore.set(correctCount);
    this.quizPassed.set(finalScore >= 60); // Feedback visual inmediato
    this.quizFinished.set(true);

    // ENVÍO AL BACKEND ---
    // Solo enviamos si aprobó
    if (finalScore >= 60) {
      this.learningService.submitProgress(this.activeModuleId(), finalScore).subscribe({
        next: (res) => {
          console.log("Progreso guardado:", res);
          // Si el backend confirma, marcamos el módulo como completado localmente
          if (!this.isModuleCompleted(this.activeModuleId())) {
            this.completedModules.update(prev => [...prev, this.activeModuleId()]);
          }
        },
        error: (err) => console.error("Error guardando quiz:", err)
      });
    }
  }

  handleQuizResultAction() {
    console.log("handleQuizResultAction");

    if (this.quizPassed()) {
      const index = this.modules().findIndex(m => m.id === this.activeModuleId());
      if (index < this.modules().length - 1) this.selectModule(this.modules()[index + 1].id);
      else this.showQuiz.set(false);
    } else {
      this.currentQuestionIndex.set(0);
      this.currentAnswers.set({});
      this.quizFinished.set(false);
    }
  }
}