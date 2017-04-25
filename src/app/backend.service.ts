import { Injectable } from '@angular/core';

@Injectable()
export class BackendService {

  constructor() { }

  runCommand(callback) {
    const ws = new WebSocket("ws://localhost:9999/");
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
      // Returns: KartoffelstampfTerminalOutputEntry
      callback(JSON.parse(event.data));
    };
  }

}
