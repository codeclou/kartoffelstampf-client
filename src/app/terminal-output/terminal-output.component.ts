import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TerminalLine } from '../types/kartoffelstampf-client';

@Component({
  selector: 'app-terminal-output',
  templateUrl: './terminal-output.component.html',
  styles: [
    `.stdout {
      width: 90%;
      background-color: #444;
      color: #efefef;
      padding: 4px 8px;
      font-size:12px;
      border-left: 4px solid green;
      font-family: "Lucida Console", Monaco, monospace;
    }`,
    `.cmd {
      width: 90%;
      background-color: #333;
      color: #fff;
      font-weight:bold;
      font-size:14px;
      padding: 8px;
      border-left: 4px solid #333;
      font-family: "Lucida Console", Monaco, monospace;
    }`,
    `.stderr {
      width: 90%;
      background-color: #444;
      color: #efefef;
      font-size:12px;
      padding: 4px 8px;
      border-left: 4px solid red;
      font-family: "Lucida Console", Monaco, monospace;
    }`,
  ]
})
export class TerminalOutputComponent {

  linesInternal: TerminalLine[] = [];

  @Input() temporaryFileName: string;
  @Input() originalFileName: string;

  @Output() linesChange = new EventEmitter();

  constructor() { }

  replaceNewlineWithBr(text: string): string {
    if (text !== undefined && text !== null) {
      return text
        .replace(/\n/g, '<br/>')
        .replace(this.temporaryFileName, this.originalFileName);
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
