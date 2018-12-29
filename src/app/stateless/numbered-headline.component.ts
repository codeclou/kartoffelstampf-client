import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-numbered-headline',
  template: `
  <div class="numbered-headline">
    <div
      class="numbered-headline-number"
      [class.numbered-headline-number---is-active]="isActive"
    ><span>{{ number }}</span></div>
    <div
      class="numbered-headline-text"
      [class.numbered-headline-text---is-active]="isActive"
    ><span>{{ headline }}</span></div>
  </div>`,
  styles: [
    `.numbered-headline {
      display:flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;
      margin-bottom: 15px;
      margin-top: 15px;
    }`,
    `.numbered-headline-number {
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #777;
      color:#fff;
      border-radius: 100%;
      font-size:20px;
    }`,
    `.numbered-headline-number---is-active {
      background-color: #00A200;
    }`,
    `.numbered-headline-text {
      color: #ccc;
      margin-left:10px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
    }`,
    `.numbered-headline-text---is-active {
      color: #777;
    }`,
  ]
})
export class NumberedHeadlineComponent {

  @Input()
  isActive: boolean;

  @Input()
  number: number;

  @Input()
  headline: string;
}
