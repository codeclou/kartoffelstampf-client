import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TerminalLine } from '../types/kartoffelstampf-client';

@Component({
  selector: 'app-terminal-output',
  templateUrl: './terminal-output.component.html',
  styleUrls: ['./terminal-output.component.scss']
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
  };

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
