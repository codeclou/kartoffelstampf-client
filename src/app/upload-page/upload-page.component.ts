import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss'],
  providers: [BackendService]
})
export class UploadPageComponent implements OnInit {

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.backendService.foo();
  }

}
