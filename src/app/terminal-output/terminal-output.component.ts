import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AnserJsonEntry } from '../types/anser';
import { ansiToJson, ansiToHtml } from 'anser';
import { TerminalLine } from "../types/kartoffelstampf-client";
import {KartoffelstampfTerminalOutputEntry} from "../types/kartoffelstampf-server";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-terminal-output',
  templateUrl: './terminal-output.component.html',
  styleUrls: ['./terminal-output.component.scss']
})
export class TerminalOutputComponent implements OnInit {

  linesInternal: TerminalLine[] = [];

  constructor() { }

  replaceNewlineWithBr(text: string): string {
    if (text !== undefined && text !== null) {
      return text.replace(/\n/g, '<br/>');
    }
    return text;
  };

  ngOnInit() {
  }

  // TWO WAY BINDING HOWTO: https://blog.thoughtram.io/angular/2016/10/13/two-way-data-binding-in-angular-2.html

  @Output()
  linesChange = new EventEmitter();

  @Input()
  get lines() {
    return this.linesInternal;
  }

  set lines(val: TerminalLine[]) {
    const self = this;
    self.linesInternal = val;
    // Angular Emit Change
    this.linesChange.emit(this.linesChange);
  }
}
