import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { ClipComponent } from './clip/clip.component';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    AboutComponent,
    ClipComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    VideoModule,
    AppRoutingModule,
    // @angular/fire
    AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule,
    AngularFirestoreModule, AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
