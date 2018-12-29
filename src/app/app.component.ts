import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    '.container { padding:20px; }',
    '.logo { display: flex; align-items: center; flex-direction: column; margin-bottom:30px;}',
    '.logo-img { width:60%; max-width:1000px; }',
  ]
})
export class AppComponent {
  logoSrc = '/assets/images/logo-small.svg';
}
