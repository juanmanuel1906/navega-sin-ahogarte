import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AnonymousPostService } from './anonymous-post.service';
import { DeviceIdService } from '../../../core/services/device-id.service';
import Swal from 'sweetalert2';
import { Observable, Subscription } from 'rxjs';
import { CurrentUserI } from '../../../core/models/current-user';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-anonymous-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './anonymous-post.html',
  styleUrls: ['./anonymous-post.css', '../../intranet/intranet.css'],
})
export class AnonymousPost implements OnInit, OnDestroy {
  @Input() participationData: { mode: 'profile' | 'anonymous'; nickname?: string; } | undefined;
  @Output() exitParticipation = new EventEmitter<void>();
  isAdmin$!: Observable<boolean>;
  isUser$!: Observable<boolean>;

  posts: any[] = [];
  postForm: FormGroup;
  commentForms: { [key: number]: FormGroup } = {};

  deviceId: string;

  currentUser: CurrentUserI | any = localStorage.getItem("currentUser");
  
  private subscriptions = new Subscription();

  constructor(
    private postService: AnonymousPostService,
    private deviceIdService: DeviceIdService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.currentUser = this.authService.currentUser(this.currentUser);

    // (En AnonymousPost constructor)
    this.isAdmin$ = this.authService.isAdmin;
    this.isUser$ = this.authService.isUser; // <-- CORREGIDO

    this.deviceId = this.deviceIdService.getDeviceId();
    this.postForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadInitialPosts();
    this.listenToRealTimeEvents();    
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadInitialPosts(): void {
    this.postService.getInitialPosts().subscribe({
      next: (data) => {
        this.posts = data;
        // Inicializa un formulario de comentario para cada post cargado
        this.posts.forEach((post) => this.initializeCommentForm(post.id));
      },
      error: (err) =>
        console.error('Error al cargar los posts iniciales:', err),
    });
  }

  listenToRealTimeEvents(): void {
    // Escuchar nuevos posts
    this.subscriptions.add(
      this.postService.onNewPost().subscribe((newPost: any) => {
        this.posts.unshift(newPost);
        this.initializeCommentForm(newPost.id);
      })
    );

    // Escuchar nuevos comentarios
    this.subscriptions.add(
      this.postService.onNewComment().subscribe((newComment: any) => {
        const post = this.posts.find((p) => p.id === newComment.postId);
        if (post) {
          if (!post.Comments) post.Comments = [];
          post.Comments.push(newComment);
        }
      })
    );

    // Escuchar actualizaciones de "Me identifica" en posts
    this.subscriptions.add(
      this.postService.onPostUpdated().subscribe((update: any) => {
        const post = this.posts.find((p) => p.id === update.id);
        if (post) {
          post.identifiesCount = update.identifiesCount;
        }
      })
    );

    // Escuchar actualizaciones de "Me identifica" en comentarios
    this.subscriptions.add(
      this.postService.onCommentUpdated().subscribe((update: any) => {
        console.log(update);

        const post = this.posts.find((p) => p.id === update.postId);

        if (post && post.Comments) {
          const comment = post.Comments.find((c: any) => c.id === update.id);
          if (comment) {
            comment.identifiesCount = update.identifiesCount;
          }
        }
      })
    );

    // Escuchar eliminaciones de posts
    this.subscriptions.add(
      this.postService.onPostDeleted().subscribe((data: any) => {
        // Ahora accedemos a data.postId, que es lo que envía el backend.
        this.posts = this.posts.filter((p) => p.id !== data.postId);
      })
    );

    // Escuchar eliminaciones de comentarios
    this.subscriptions.add(
      this.postService.onCommentDeleted().subscribe((data: any) => {
        const post = this.posts.find((p) => p.id === data.postId);
        if (post && post.Comments) {
          // La corrección es comparar c.id con data.commentId
          post.Comments = post.Comments.filter(
            (c: any) => c.id !== data.commentId
          );
        }
      })
    );
  }

  initializeCommentForm(postId: number): void {
    this.commentForms[postId] = this.fb.group({
      message: ['', Validators.required],
    });
  }

  onPostSubmit(): void {
    if (this.postForm.invalid) return;

    const postPayload: any = {
      message: this.postForm.value.message,
    };

    // Si el modo es anónimo, añadimos el deviceId y el nickname al payload
    if (this.participationData?.mode === 'anonymous') {
      postPayload.deviceId = this.deviceId;
      postPayload.nickname = this.participationData?.nickname;
    }
    // Si el modo es 'profile', no añadimos nada extra. El backend usará el token.

    this.postService.createPost(postPayload).subscribe({
      next: () => this.postForm.reset(),
      error: (err) => Swal.fire('Error', err.error.message, 'error'),
    });
  }

  onCommentSubmit(postId: number): void {
    // 1. Obtén el formulario correcto para este post
    const form = this.commentForms[postId];
    if (form.invalid) return;

    // 2. Construye el payload base con el mensaje
    const commentPayload: any = {
      message: form.value.message,
    };

    // 3. Si el modo es anónimo, añade el deviceId y el nickname
    if (this.participationData?.mode === 'anonymous') {
      commentPayload.deviceId = this.deviceId;
      commentPayload.nickname = this.participationData?.nickname;
    }
    // Si el modo es 'profile', no se añade nada extra. El backend usará el token.

    // 4. Llama al servicio con el payload correcto
    this.postService
      .createComment(postId, commentPayload)
      .subscribe({
        next: () => form.reset(),
        error: (err) => Swal.fire('Error', err.error.message, 'error'),
      });
  }

  onToggleIdentifyPost(postId: number): void {
    this.postService.toggleIdentifyPost(postId, this.deviceId).subscribe({
      next: () => console.log('Identificación toggled'),
      error: (err) => console.error('Error en Me identifica del post:', err),
    });
  }

  onToggleIdentifyComment(postId: number, commentId: number): void {
    this.postService
      .toggleIdentifyComment(postId, commentId, this.deviceId)
      .subscribe({
        next: () => console.log('Identificación toggled'),
        error: (err) =>
          console.error('Error en Me identifica del comentario:', err),
      });
  }

  onDeletePost(postId: number): void {
    Swal.fire({
      title: '¿Eliminar esta publicación?',
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(postId, this.deviceId).subscribe({
          next: () => console.log('Post deleted'),
          error: (err) => Swal.fire('Error', err.error.message, 'error'),
        });
      }
    });
  }

  onDeleteComment(postId: number, commentId: number): void {
    Swal.fire({
      title: '¿Eliminar este comentario?',
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService
          .deleteComment(postId, commentId, this.deviceId)
          .subscribe({
            next: () => console.log('Comment deleted'),
            error: (err) => Swal.fire('Error', err.error.message, 'error'),
          });
      }
    });
  }

  onExitParticipation() {
    sessionStorage.removeItem('participationMode');
    sessionStorage.removeItem('anonymousNickname');
    this.exitParticipation.emit();
  }
}
