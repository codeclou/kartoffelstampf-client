import { Injectable } from '@angular/core';
import {
  KartoffelstampfTerminalOutputEntry,
  KartoffelstampfImageUploadResponse,
  KartoffelstampfImageUploadRequest,
  KartoffelstampfCompressInstruction,
 } from '../types/kartoffelstampf-server';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
export type FnOnMessageCallback = (arg1: KartoffelstampfTerminalOutputEntry) => void;

@Injectable()
export class BackendService {

  private restApiBaseUrl: string;
  private webSocketBaseUrl: string;

  constructor(private http: HttpClient) {
    // Autodetect URLs
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    if (protocol === 'https:') {
      this.restApiBaseUrl = `https://${hostname}${port ? ':' + port : ''}`;
      this.webSocketBaseUrl = `wss://${hostname}${port ? ':' + port : ''}`;
    } else {
      this.restApiBaseUrl = `http://${hostname}${port ? ':' + port : ''}`;
      this.webSocketBaseUrl = `ws://${hostname}${port ? ':' + port : ''}`;
    }
    //
    // Note on localhost we need to overwrite the URLs
    //
    if (localStorage && localStorage.getItem('LOCAL_DEV')) {
      this.restApiBaseUrl = `http://localhost:9999`;
      this.webSocketBaseUrl = `ws://localhost:9999`;
    }
  }

  getDownloadUrl(temporaryFileName: string, originalFileName: string) {
    return `${this.restApiBaseUrl}/download/${temporaryFileName}/${originalFileName}`;
  }

  uploadImage(base64Image: string, type: string) {
    return this.http.post<KartoffelstampfImageUploadResponse>(
      `${this.restApiBaseUrl}/upload`, {
        contentDataUri: base64Image,
      } as KartoffelstampfImageUploadRequest, httpOptions);
  }

  runCompressCommand(compressInstruction: KartoffelstampfCompressInstruction): Observable<KartoffelstampfTerminalOutputEntry> {
    const ws = new WebSocket(`${this.webSocketBaseUrl}/`);
    const subject = new Subject<KartoffelstampfTerminalOutputEntry>();
    ws.onopen = function (event) {
      ws.send(JSON.stringify(compressInstruction));
    };
    ws.onmessage = function(event: MessageEvent) {
      const kartoffelstampfTerminalOutputEntry: KartoffelstampfTerminalOutputEntry = JSON.parse(event.data);
      subject.next(kartoffelstampfTerminalOutputEntry);
    };
    ws.onclose = function (event) {
      subject.complete();
    };
    return subject.asObservable();
  }

}
