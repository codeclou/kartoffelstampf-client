import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { KartoffelstampfTerminalOutputEntry, KartoffelstampfCompressInstruction } from '../types/kartoffelstampf-server';
import { TerminalLine } from '../types/kartoffelstampf-client';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styles: [
    `.drop-container {
      width:100%;
      height:120px;
      border:3px dashed #ccc;
      display:flex;
      justify-content: center;
      align-items: center;
    }`,
    `.drop-container---drag-over { border-color: #0DFF0D; }`,
    `.drop-container---drag-leave { border-color: #ccc; }`,
    `.drop-container---drag-drop { border-color: #00A200; }`,
   ],
  providers: [BackendService]
})
export class UploadPageComponent implements OnInit, OnDestroy {

  preDestroy = new Subject<boolean>();
  terminalLines: TerminalLine[] = [];
  uploadedFileBase64URI: string;
  originalFileName: string;
  temporaryFileName: string;
  compressDone = false;

  uiStateDrop = false;
  uiStateDragOver = false;
  uiStateDragLeave = true;

  activeStep = 1;

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    // since router strategy is to forcefully NOT reuse page components.
    // The Component is reiniated automatically on browse to /upload
  }

  ngOnDestroy() {
    this.preDestroy.next(true);
    this.preDestroy.complete();
  }

  handleDrop(event: any) {
    this.uiStateDragOver = false;
    this.uiStateDragLeave = false;
    this.uiStateDrop = true;
    event.stopPropagation();
    event.preventDefault();
    this.processFileToBase64DataURI(<FileList>event.dataTransfer.files);
  }

  handleDragOver(event: Event) {
    this.uiStateDragOver = true;
    this.uiStateDragLeave = false;
    this.uiStateDrop = false;
    event.stopPropagation();
    event.preventDefault();
  }

  handleDragLeave(event: Event) {
    this.uiStateDragOver = false;
    this.uiStateDragLeave = true;
    this.uiStateDrop = false;
    event.stopPropagation();
    event.preventDefault();
  }

  /* classic file input field */
  handleFileChange(event: any) {
    const el = event.srcElement as HTMLInputElement;
    this.processFileToBase64DataURI(el.files);
  }

  processFileToBase64DataURI(files: FileList) {
    const self = this;
    if (files && files[0]) {
      const fileReader = new FileReader();
      self.originalFileName = files[0].name;
      fileReader.addEventListener('load', function(loadedEvent: any) {
        self.uploadedFileBase64URI = loadedEvent.target.result;
        // Upload via backend
        self.backendService
        .uploadImage(self.uploadedFileBase64URI, 'PNG')
        .pipe(
          takeUntil(self.preDestroy)
        )
        .subscribe(uploadResponse => {
          console.log(uploadResponse.fileName);
          self.temporaryFileName = uploadResponse.fileName;
          self.runCompressCommand();
        });
      });
      fileReader.readAsDataURL(files[0]);
      self.activeStep = 2;
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
      }),
      takeUntil(self.preDestroy)
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
