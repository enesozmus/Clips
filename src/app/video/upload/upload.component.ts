import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  // This property will be responsible for keeping track of a file being dragged over an element.
  isDragover: boolean = false;
  // The first step is to catch the file dropped onto the element.
  file: File | null = null;
  // The form should be hidden until the user has uploaded a file.
  // By default, the form should be hidden.
  formVisibility: boolean = false;
  // We are going to start working on the upload form by enabling reactive forms.
  title = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]);
  /*
      The FormControl() class has two arguments.
        The first argument is a default value. The initial value will be an empty string.
  */
  uploadForm = new FormGroup({
    title: this.title
  });

  constructor(private fireStorage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  storeFile($event: Event) {
    this.isDragover = false;
    // The first step is to catch the file dropped onto the element.
    this.file = ($event as DragEvent).dataTransfer?.files.item(0)
      ?? null;

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

  uploadFile(){
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    this.fireStorage.upload(clipPath, this.file);
    console.log('file uploaded');
  }

}


/*
    The first step is to grab the file dropped onto the element.

*/