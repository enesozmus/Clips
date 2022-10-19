import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';
import { RouterModule } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/');

@NgModule({
  declarations: [
    ManageComponent,
    UploadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'manage', component: ManageComponent, data: { authOnly: true, authGuardPipe: redirectUnauthorizedToHome }, canActivate: [AngularFireAuthGuard] },
      { path: 'upload', component: UploadComponent, data: { authOnly: true, authGuardPipe: redirectUnauthorizedToHome }, canActivate: [AngularFireAuthGuard] },
      // path change decision
      { path: 'manage-clips', redirectTo: 'manage' },
    ])
  ]
})
export class VideoModule { }
