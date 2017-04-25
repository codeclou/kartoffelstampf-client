//
// Typings: https://github.com/IonicaBizau/anser
//
export interface AnserJsonEntry {
  content: string;
  fg: string;
  bg: string;
  fg_truecolor: string;
  bg_truecolor: string;
  clearLine: boolean;
  was_processed: boolean;
  isEmpty(): boolean;
}
