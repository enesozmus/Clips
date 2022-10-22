import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { last, switchMap, combineLatest, forkJoin } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
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
  //
  screenshots: string[] = [];
  selectedScreenshot: string = '';
  screenshotTask?: AngularFireUploadTask;
  //
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
    , private clipService: ClipService, private router: Router, public ffmpegService: FfmpegService) {
    // Visitors will not be able to access this page if they're not authenticated.
    fireAuth.user.subscribe(user => this.user = user);
    // We're going to call the init function.
    // We should prevent users from uploading files until FFmpeg is ready.
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile($event: Event) {

    if (this.ffmpegService.isRunning) {
      return
    }

    this.isDragover = false;
    // The first step is to catch the file dropped onto the element.
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    // We're going to pass our file to FFmpeg.
    // Internally, FFmpeg will create a separate memory storage for files.
    // we should pass on the file object to the service.
    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];
    // The setValue() function is defined on the FormControl class.
    // This function will programmatically update a FormControl value.
    // remove the file extension
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.formVisibility = true;
    console.log(this.file);
  }

  async uploadFile() {

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

    // screenshot
    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${clipFileName}.png`;
    // screenshot

    // This function returns an object with observables. We should store the object in a variable called task.
    this.task = this.fireStorage.upload(clipPath, this.file);
    const clipRef = this.fireStorage.ref(clipPath);

    // screenshot
    this.screenshotTask = this.fireStorage.upload(
      screenshotPath, screenshotBlob
    );
    const screenshotRef = this.fireStorage.ref(screenshotPath);
    // screenshot

    // combineLatest
    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe(progress => {
      const [clipProgress, screenshotProgress] = progress;

      if (!clipProgress || !screenshotProgress) {
        return;
      }
      const total = clipProgress + screenshotProgress;
      this.percentage = total as number / 200;
      //this.percentage = progress as number / 100;
    });
    // combineLatest

    // forkJoin
    forkJoin([
      // The state property will tell us the current state of the upload. If the value is set to running, the upload is still in progress.
      // task.snapshotChanges().subscribe(console.log);
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
      switchMap(() => forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls;
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipURL,
          screenshotURL,
          screenshotFileName: `${clipFileName}.png`,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }
        const clipDocRef = await this.clipService.createClip(clip);
        console.log(clip);
        /* Section Alert*/
        this.alertColor = 'green';
        this.alertMsg = 'Success! Your clip is now readt to share with the world!';
        this.showPercentage = false;
        /* Section Alert*/

        // At the end of the function, we're going to create a timeout with a duration of 1500 milliseconds.
        // We're not going to redirect the user until a second has passed.
        // We want to give them an opportunity to view the success message.
        setTimeout(() => {
          this.router.navigate([
            'clip', clipDocRef.id
          ])
        }, 1000)
      },
      error: (error) => {

        this.uploadForm.enable();
        this.alertColor = 'red'
        this.alertMsg = 'Upload failed! Please try again later.'
        this.inSubmission = true
        this.showPercentage = false
        console.error(error)
      }
    });
    // forkJoin
  }
}

/*
    The first step is to grab the file dropped onto the element.
*/

/*
    We want to be able to let the user know if their upload is in progress, a success or a failure.
*/