//
// Typings: https://github.com/codeclou/karteoffelstampf-client
//
import { AnserJsonEntry } from 'anser';
import { KartoffelstampfTerminalOutputEntry } from './kartoffelstampf-server';
import * as Anser from 'anser';

export class TerminalLine {
  json: AnserJsonEntry;
  html: string;
  clearLine: boolean;
  type: string;

  constructor(data: KartoffelstampfTerminalOutputEntry) {
    this.type = data.type;
    this.json = Anser.ansiToJson(data.payload.text)[0];
    this.html = Anser.ansiToHtml(data.payload.text);
    this.clearLine = this.json.clearLine;
  }
}

export class CompressImageJobItem {
  terminalLines: TerminalLine[] = [];
  uploadedFileBase64URI: string;
  originalFileName: string;
  temporaryFileName: string;
  originalSize: number;
  compressedSize: number;
  compressDone = false;
  downloadClicked = false;
  terminalLinesExpanded = false;
  serverError: string = null;
}
