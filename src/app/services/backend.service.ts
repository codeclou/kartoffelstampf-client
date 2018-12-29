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

  private static WEB_SOCKET_COMPRESS_URL = `ws://${window.location.hostname}:9999/`;
  private static REST_API_UPLOAD_URL = `http://${window.location.hostname}:9999/upload`;
  private static REST_API_DOWNLOAD_URL = `http://${window.location.hostname}:9999/download`;

  constructor(private http: HttpClient) { }

  getDownloadUrl(temporaryFileName: string, originalFileName: string) {
    return `${BackendService.REST_API_DOWNLOAD_URL}/${temporaryFileName}/${originalFileName}`;
  }

  uploadImage(base64Image: string, type: string) {
    return this.http.post<KartoffelstampfImageUploadResponse>(
      BackendService.REST_API_UPLOAD_URL, {
        contentDataUri: base64Image,
      } as KartoffelstampfImageUploadRequest, httpOptions)
    .pipe(
      catchError((e: HttpErrorResponse) => {
        console.log(e);
        return throwError(
          'Something bad happened; please try again later.'
        );
      })
    );
  }

  runCompressCommand(compressInstruction: KartoffelstampfCompressInstruction): Observable<KartoffelstampfTerminalOutputEntry> {
    const ws = new WebSocket(BackendService.WEB_SOCKET_COMPRESS_URL);
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
