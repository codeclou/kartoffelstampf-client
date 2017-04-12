import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { RouterModule, Routes } from '@angular/router';
import { BackendService } from './backend.service';

const appRoutes: Routes = [
  { path: 'upload', component: UploadPageComponent },
  { path: '',
    redirectTo: '/upload',
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    UploadPageComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
