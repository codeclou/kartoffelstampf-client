import { Injectable } from '@angular/core';
import { KartoffelstampfTerminalOutputEntry } from './types/kartoffelstampf-server';

@Injectable()
export class BackendService {

  constructor() { }

  runCommand(callback) {

    const ws = new WebSocket(`ws://${window.location.hostname}:9999/`);
    ws.onopen = function (event) {
      ws.send(JSON.stringify({
        command: 'optipng',
        commandArguments: [
          '-o5',
          '/test/test.png'
        ]
      }));
    };
    ws.onmessage = function(event) {
      const kartoffelstampfTerminalOutputEntry: KartoffelstampfTerminalOutputEntry = JSON.parse(event.data);
      callback(kartoffelstampfTerminalOutputEntry);
    };
  }

}
