//
// Typings: https://github.com/codeclou/karteoffelstampf-server
//

export interface KartoffelstampfTerminalOutputEntryPayload {
  text: string;
}

export interface KartoffelstampfTerminalOutputEntry {
  payload: KartoffelstampfTerminalOutputEntryPayload;
  type: string;
}
