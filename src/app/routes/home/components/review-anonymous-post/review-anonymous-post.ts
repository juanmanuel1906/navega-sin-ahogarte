import { AfterViewInit, Component } from '@angular/core';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { CommunityPostEntryComponent } from "../../../../features/components/community-post-entry/community-post-entry";

@Component({
  selector: 'app-review-anonymous-post',
  imports: [CommunityPostEntryComponent],
  templateUrl: './review-anonymous-post.html',
  styleUrl: './review-anonymous-post.css'
})
export class ReviewAnonymousPost implements AfterViewInit {
  messages: string[] = [
    //"Tengo un nudo en la garganta. ¿Podemos hablar?",
    "Necesito deshaogarme.",
    "Siento mucha presión hoy.",
    "Quisiera hablar con alguien."
  ]

  ngAfterViewInit(): void {
    gsap.registerPlugin(TextPlugin);
    const mainTimeline = gsap.timeline({ repeat: -1 });

    this.messages.forEach((message) => {
      mainTimeline
        .to("#typing-text", {
          duration: 2,
          text: message,
          ease: "none"
        })
        .to({}, { duration: 2 })
        .to("#typing-text", {
          duration: 1,
          text: "",
          ease: "none"
        })
    })
  }
}
