import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy {

  // This property will be responsible for keeping track of a file being dragged over an element.
  isDragover: boolean = false;
  // The first step is to catch the file dropped onto the element.
  file: File | null = null;
  // The form should be hidden until the user has uploaded a file.
  // By default, the form should be hidden.
  formVisibility: boolean = false;
  // During this subscription, we're going to store the progress in a property
  percentage: number = 0;
  // This property will be responsible for toggling the visibility of the percentage in the alert component.
  showPercentage: boolean = false
  //
  user: firebase.User | null = null;
  //
  task?: AngularFireUploadTask
  // We are going to start working on the upload form by enabling reactive forms.
  title = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]);
  /*
      The FormControl() class has two arguments.
        The first argument is a default value. The initial value will be an empty string.
  */
  uploadForm = new FormGroup({
    title: this.title
  });

  /* Section Alert*/
  showAlert: boolean = false;
  alertColor: string = 'blue';
  alertMsg: string = 'Please wait! Your clip is being uploaded!';
  inSubmission: boolean = false;
  /* Section Alert*/

  constructor(private fireStorage: AngularFireStorage, private fireAuth: AngularFireAuth
    , private clipService: ClipService, private router: Router) {
    // Visitors will not be able to access this page if they're not authenticated.
    fireAuth.user.subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile($event: Event) {
    this.isDragover = false;
    // The first step is to catch the file dropped onto the element.
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    // The setValue() function is defined on the FormControl class.
    // This function will programmatically update a FormControl value.
    // remove the file extension
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.formVisibility = true;
    console.log(this.file);
  }

  uploadFile() {

    this.uploadForm.disable();

    /* Section Alert*/
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded!';
    this.inSubmission = true;
    this.showPercentage = true;
    /* Section Alert*/

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    // This function returns an object with observables. We should store the object in a variable called task.
    this.task = this.fireStorage.upload(clipPath, this.file);
    const clipRef = this.fireStorage.ref(clipPath);

    this.task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100;
    });

    // The state property will tell us the current state of the upload. If the value is set to running, the upload is still in progress.
    // task.snapshotChanges().subscribe(console.log);
    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({

      next: async (url) => {

        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        //console.log(clip);
        const clipDocRef = await this.clipService.createClip(clip);

        /* Section Alert*/
        this.alertColor = 'green';
        this.alertMsg = 'Success! Your clip is now readt to share with the world!';
        this.showPercentage = false;
        /* Section Alert*/

        // At the end of the function, we're going to create a timeout with a duration of 1000 milliseconds.
        // We're not going to redirect the user until a second has passed.
        // We want to give them an opportunity to view the success message.
        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000);
      },
      error: (err) => {

        this.uploadForm.enable();

        /* Section Alert*/
        this.alertColor = 'red';
        this.alertMsg = 'Upload failed! Please, try again later!';
        this.inSubmission = true;
        this.showPercentage = false;
        /* Section Alert*/
        
        console.error(err);
      }
    });
  }

}


/*
    The first step is to grab the file dropped onto the element.
*/

/*
    We want to be able to let the user know if their upload is in progress, a success or a failure.
*/