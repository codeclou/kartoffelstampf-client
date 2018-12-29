import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UploadPageComponent } from './upload-page/upload-page.component';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { BackendService } from './services/backend.service';
import { TerminalOutputComponent } from './terminal-output/terminal-output.component';
import { SpinnerComponent } from './stateless/spinner.component';
import { NumberedHeadlineComponent } from './stateless/numbered-headline.component';
import { ForceRouteReuseStrategy } from './stateless/force-route-reuse-strategy';

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
  ],
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserModule,
    FormsModule,
    HttpClientModule
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
