import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { RouterModule, Routes } from '@angular/router';
import { BackendService } from './backend.service';
import { TerminalOutputComponent } from './terminal-output/terminal-output.component';

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
    UploadPageComponent,
    TerminalOutputComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
