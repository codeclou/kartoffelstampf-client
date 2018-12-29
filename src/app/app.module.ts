import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CloukitIconModule } from '@cloukit/icon';

import { AppComponent } from './app.component';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { BackendService } from './services/backend.service';
import { TerminalOutputComponent } from './terminal-output/terminal-output.component';
import { SpinnerComponent } from './stateless/spinner.component';
import { NumberedHeadlineComponent } from './stateless/numbered-headline.component';
import { ForceRouteReuseStrategy } from './stateless/force-route-reuse-strategy';
import { FileSizePipe } from './stateless/file-size.directive';

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
    TerminalOutputComponent,
    SpinnerComponent,
    NumberedHeadlineComponent,
    FileSizePipe,
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CloukitIconModule,
  ],
  providers: [
    BackendService,
    {
      provide: RouteReuseStrategy,
      useClass: ForceRouteReuseStrategy
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
