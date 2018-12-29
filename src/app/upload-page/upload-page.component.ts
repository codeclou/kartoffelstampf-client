import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { KartoffelstampfTerminalOutputEntry, KartoffelstampfCompressInstruction } from '../types/kartoffelstampf-server';
import { TerminalLine } from '../types/kartoffelstampf-client';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styles: [ ],
  providers: [BackendService]
})
export class UploadPageComponent implements OnInit {

  terminalLines: TerminalLine[] = [];
  uploadedFileBase64URI: string;
  originalFileName: string;
  temporaryFileName: string;
  compressDone = false;

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    const self = this;
    // self.runCompressCommand();
  }

  processFileToBase64DataURI(event: Event) {
    const self = this;
    const el = event.srcElement as HTMLInputElement;
    if (el.files && el.files[0]) {
      const fileReader = new FileReader();
      self.originalFileName = el.files[0].name;
      fileReader.addEventListener('load', function(loadedEvent: any) {
        self.uploadedFileBase64URI = loadedEvent.target.result;
        // Upload via backend
        self.backendService.uploadImage(self.uploadedFileBase64URI, 'PNG')
        .subscribe(uploadResponse => {
          console.log(uploadResponse.fileName);
          self.temporaryFileName = uploadResponse.fileName;
          self.runCompressCommand();
        });
      });
      fileReader.readAsDataURL(el.files[0]);
    }
  }

  getDownloadUrl() {
    return this.backendService.getDownloadUrl(this.temporaryFileName, this.originalFileName);
  }

  runCompressCommand() {
    const self = this;
    self.backendService.runCompressCommand(<KartoffelstampfCompressInstruction>{
      compressType: KartoffelstampfCompressInstruction.COMPRESS_TYPE_LOSSLESS,
      temporaryFileName: this.temporaryFileName,
    })
    .pipe(
      finalize(() => {
        console.log('compress-done!');
        self.compressDone = true;
      })
    )
    .subscribe(data => {
      const terminalLine = new TerminalLine(data);
      const previousTerminalLine = self.terminalLines[self.terminalLines.length - 1];
      if (previousTerminalLine !== undefined &&
          previousTerminalLine.clearLine === true &&
          terminalLine.clearLine === true) {
        self.terminalLines.pop();
      }
      self.terminalLines.push(terminalLine);
    });
  }

}
