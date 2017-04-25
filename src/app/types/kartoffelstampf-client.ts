//
// Typings: https://github.com/codeclou/karteoffelstampf-client
//
import { AnserJsonEntry } from 'anser';

export class TerminalLine {
  json: AnserJsonEntry;
  html: string;
  clearLine: boolean;
  type: string;
}
