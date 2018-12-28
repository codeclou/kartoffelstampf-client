import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TerminalLine } from '../types/kartoffelstampf-client';

@Component({
  selector: 'app-terminal-output',
  templateUrl: './terminal-output.component.html',
  styles: [
    `.stdout {
      width: 90%;
      background-color: #555;
      color: #efefef;
      padding: 8px;
      border-left: 10px solid green;
      font-family: "Lucida Console", Monaco, monospace;
    }`,
    `.stderr {
      width: 90%;
      background-color: #555;
      color: #efefef;
      padding: 8px;
      border-left: 10px solid red;
      font-family: "Lucida Console", Monaco, monospace;
    }`,
    `.processStatus {
      width: 90%;
      background-color: #555;
      color: #efefef;
      padding: 8px;
      border-left: 10px solid blue;
      font-family: "Lucida Console", Monaco, monospace;
    }`,
  ]
})
export class TerminalOutputComponent {

  linesInternal: TerminalLine[] = [];
  @Output() linesChange = new EventEmitter();

  constructor() { }

  replaceNewlineWithBr(text: string): string {
    if (text !== undefined && text !== null) {
      return text.replace(/\n/g, '<br/>');
    }
    return text;
  }

  @Input() get lines() {
    return this.linesInternal;
  }

  set lines(val: TerminalLine[]) {
    const self = this;
    self.linesInternal = val;
    // Angular Emit Change
    this.linesChange.emit(this.linesChange);
  }
}
