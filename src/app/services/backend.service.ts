import { Injectable } from '@angular/core';
import {
  KartoffelstampfTerminalOutputEntry,
  KartoffelstampfImageUploadResponse,
  KartoffelstampfImageUploadRequest,
  KartoffelstampfCompressInstruction,
 } from '../types/kartoffelstampf-server';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, takeWhile } from 'rxjs/operators';

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

  private ws: WebSocket;
  private subject = new Subject<KartoffelstampfTerminalOutputEntry>();

  constructor(private http: HttpClient) {
    const self = this;
    //
    // Autodetect URLs
    //
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
    //
    // Connect
    //
    self.ws = new WebSocket(`${this.webSocketBaseUrl}/`);
    self.ws.onclose = function(event: CloseEvent) {
      console.log('websocket onclose', event);
      self.subject.complete();
    };
    self.ws.onmessage = function(event: MessageEvent) {
      const kartoffelstampfTerminalOutputEntry: KartoffelstampfTerminalOutputEntry = JSON.parse(event.data);
      self.subject.next(kartoffelstampfTerminalOutputEntry);
    };
    self.ws.onerror = function(event: ErrorEvent) {
      console.log('websocket onerror', event);
      self.subject.complete();
    };
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
    this.ws.send(JSON.stringify(compressInstruction));
    // Use single websocket connection and distinguish messages by compressInstruction
    // The last message sent by the server per compressJob should be type=DONE. This is where we unsubscribe.
    return this.subject
      .asObservable()
      .pipe(
        filter(e =>
          e.compressInstruction.compressType === compressInstruction.compressType &&
          e.compressInstruction.temporaryFileName === compressInstruction.temporaryFileName
        ),
        takeWhile(data => data.type !== 'DONE'),
      );
  }

}
