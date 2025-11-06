import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
export let BASE_URL: string = '';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('navega-sin-ahogarte');

  constructor() {
    const urls = [
      {
        url: 'https://navegasinahogarte.com',
        base_url: 'https://navegasinahogarte.com/api',
      },
      {
        url: 'http://localhost:4200',
        base_url: 'http://localhost:3000/api',
      },
    ];

    const defaultUrl = 'http://localhost:3000/api';
    const currentUrl = window.location.origin;

    const match = urls.find((u) => currentUrl.includes(u.url));
    if (match) {
      BASE_URL = match.base_url;
    } else {
      BASE_URL = defaultUrl;
    }
  }
}
