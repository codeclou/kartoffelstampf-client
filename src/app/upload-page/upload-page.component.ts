import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { KartoffelstampfTerminalOutputEntry, KartoffelstampfCompressInstruction } from '../types/kartoffelstampf-server';
import { TerminalLine, CompressImageJobItem } from '../types/kartoffelstampf-client';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject, throwError, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

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
      transition: border-color 0.5s linear;
    }`,
    `.drop-container---drag-over { border-color: #0DFF0D; }`,
    `.drop-container---drag-leave { border-color: #ccc; }`,
    `.drop-container---drag-drop { border-color: #00A200; }`,
    `.fileTable {
      width:100%;
    }`,
    `.fileTable th {
      font-weight:bold;
      text-align:left;
      color:#999;
      font-size:12px;
      padding-bottom:8px;
    }`,
    `.download { background-color:#00A200; color:#fff; padding:3px 6px; text-decoration: none; }`,
    `.download---clicked { background-color:#777; }`,
    `.terminal-line-td { padding:5px 10px 20px 27px; }`,
    `.expandable {
      cursor: pointer;
      display:flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
     }`,
     `.error { display:block; padding:2px 4px; background-color: #A60000; color:#fff;}`,
   ],
  providers: [BackendService]
})
export class UploadPageComponent implements OnInit, OnDestroy {

  preDestroy = new Subject<boolean>();
  imageCompressJobs: CompressImageJobItem[] = [];

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
    const self = this;
    self.uiStateDragOver = false;
    self.uiStateDragLeave = false;
    self.uiStateDrop = true;
    setTimeout(() => {
      self.uiStateDrop = false;
      self.uiStateDragLeave = true;
    }, 400);
    event.stopPropagation();
    event.preventDefault();
    self.processFileToBase64DataURI(<FileList>event.dataTransfer.files);
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
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const job = new CompressImageJobItem();
        const fileReader = new FileReader();
        job.originalFileName = file.name;
        job.originalSize = file.size;
        fileReader.addEventListener('load', function(loadedEvent: any) {
          job.uploadedFileBase64URI = loadedEvent.target.result;
          // Upload via backend
          self.backendService
            .uploadImage(job.uploadedFileBase64URI, 'PNG')
            .pipe(
              takeUntil(self.preDestroy),
              catchError((e: any) => {
                self.imageCompressJobs.push(job);
                job.serverError = e.error.error;
                return EMPTY;
              })
            )
            .subscribe((uploadResponse: any) => {
              job.temporaryFileName = uploadResponse.fileName;
              self.imageCompressJobs.push(job);
              self.runCompressCommand(job);
            });
        });
        fileReader.readAsDataURL(file);
      }
      self.activeStep = 2;
    }
  }

  getDownloadUrl(job: CompressImageJobItem) {
    return this.backendService.getDownloadUrl(job.temporaryFileName, job.originalFileName);
  }

  runCompressCommand(job: CompressImageJobItem) {
    const self = this;
    self.backendService.runCompressCommand(<KartoffelstampfCompressInstruction>{
      compressType: KartoffelstampfCompressInstruction.COMPRESS_TYPE_LOSSLESS,
      temporaryFileName: job.temporaryFileName,
    })
    .pipe(
      finalize(() => {
        job.compressDone = true;
      }),
      takeUntil(self.preDestroy)
    )
    .subscribe(data => {
      if (data.type === 'compressResult') {
        job.compressedSize = data.payload['compressedSize'];
      } else {
        const terminalLine = new TerminalLine(data);
        const previousTerminalLine = job.terminalLines[job.terminalLines.length - 1];
        if (previousTerminalLine !== undefined &&
            previousTerminalLine.clearLine === true &&
            terminalLine.clearLine === true) {
          job.terminalLines.pop();
        }
        job.terminalLines.push(terminalLine);
      }
    });
  }

}
