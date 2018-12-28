import { Injectable } from '@angular/core';
import {
  KartoffelstampfTerminalOutputEntry,
  KartoffelstampfImageUploadResponse,
  KartoffelstampfImageUploadRequest,
 } from './types/kartoffelstampf-server';
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

  getDownloadUrl(filePathOnServer: string) {
    return BackendService.REST_API_DOWNLOAD_URL + '/' + filePathOnServer;
  }

  uploadImage(base64Image: string, type: string) {
    const sanitizedBase64 = base64Image.replace('data:image/png;base64,', '');
    return this.http.post<KartoffelstampfImageUploadResponse>(
      BackendService.REST_API_UPLOAD_URL, {
        fileContent: sanitizedBase64,
        fileType: type
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

  runCompressPngCommand(filePathOnServer: string): Observable<KartoffelstampfTerminalOutputEntry> {
    const ws = new WebSocket(BackendService.WEB_SOCKET_COMPRESS_URL);
    const subject = new Subject<KartoffelstampfTerminalOutputEntry>();
    ws.onopen = function (event) {
      ws.send(JSON.stringify({
        command: 'optipng',
        commandArguments: [
          '-o5',
          '/u/' + filePathOnServer // e.g. foo.png
        ]
      }));
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
