import { Injectable } from '@angular/core';
import { switchMap, map, of, BehaviorSubject, combineLatest } from 'rxjs';
import {
  AngularFirestore, AngularFirestoreCollection, DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import IClip from '../contracts/clip';

@Injectable({
  providedIn: 'root'
})

export class ClipService {

  // The property we've created will store the collection for the users uploads.
  // This step is optional, but type checking should always be a priority.
  public clipsCollection: AngularFirestoreCollection<IClip>;

  constructor(
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private fireStorage: AngularFireStorage
  ) {
    // The collection() function will select a collection from our database.
    // The name of our collection will be called clips.
    // This collection doesn't exist, but that's perfectly fine, Firebase will create it for us.
    this.clipsCollection = fireStore.collection('clips');
  }


  //
  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  //
  getUserClips() {

  }

  //
  updateClip() {

  }

  //
  async deleteClip() {

  }
}
