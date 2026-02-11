import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { gsap } from 'gsap';

interface PostI {
  id: number;
  images: string[];
  currentSlide: number;
  theme: string;
}

@Component({
  selector: 'app-gallery-resources',
  imports: [NgClass],
  templateUrl: './gallery-resources.html',
  styleUrl: './gallery-resources.css'
})
export class GalleryResources {
  posts: PostI[] = [
    { id: 1, images: ['/posts/2.png', '/posts/3.png', '/posts/4.png', '/posts/5.png'], currentSlide: 0, theme: 'light' },
    { id: 2, images: ['/posts/6.png'], currentSlide: 0, theme: 'light' },
    { id: 3, images: ['/posts/7.png'], currentSlide: 0, theme: 'light' },
    { id: 4, images: ['/posts/8.png'], currentSlide: 0, theme: 'dark' },
    { id: 5, images: ['/posts/9.png', '/posts/10.png', '/posts/11.png'], currentSlide: 0, theme: 'dark' },
    { id: 6, images: ['/posts/12.png'], currentSlide: 0, theme: 'dark' },
  ];

  selectedPost: PostI | null = null;

  openModal(post: PostI) {
    this.selectedPost = { ...post, currentSlide: 0 };
    // Animación de entrada con GSAP
    gsap.fromTo(".modal-content", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
  }

  closeModal() {
    this.selectedPost = null;
  }

  nextSlide(event: Event) {
    event.stopPropagation();
    if (this.selectedPost && this.selectedPost.currentSlide < this.selectedPost.images.length - 1) {
      this.selectedPost.currentSlide++;
    }
  }

  prevSlide(event: Event) {
    event.stopPropagation();
    if (this.selectedPost && this.selectedPost.currentSlide > 0) {
      this.selectedPost.currentSlide--;
    }
  }
}
