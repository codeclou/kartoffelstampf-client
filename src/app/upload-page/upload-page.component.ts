import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ansiToJson, ansiToHtml} from 'anser';
import { KartoffelstampfTerminalOutputEntry } from '../types/kartoffelstampf-server';
import { TerminalLine } from '../types/kartoffelstampf-client';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
  providers: [BackendService]
})
export class UploadPageComponent implements OnInit {

  terminalLines: TerminalLine[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    const self = this;
    this.backendService.runCommand((data: KartoffelstampfTerminalOutputEntry) => {
      const terminalLine = new TerminalLine();
      terminalLine.type = data.type;
      terminalLine.json = ansiToJson(data.payload.text)[0];
      terminalLine.html = ansiToHtml(data.payload.text);
      terminalLine.clearLine = terminalLine.json.clearLine;
      const previousTerminalLine = self.terminalLines[self.terminalLines.length - 1];
      if (previousTerminalLine !== undefined && previousTerminalLine.clearLine === true && terminalLine.clearLine === true) {
        self.terminalLines.pop();
      }
      self.terminalLines.push(terminalLine);
    });
  }

}
