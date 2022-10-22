import { Injectable } from '@angular/core';
import { switchMap, map, of, BehaviorSubject, combineLatest } from 'rxjs';
import IClip from '../contracts/clip';

import {
  AngularFirestore, AngularFirestoreCollection, DocumentReference,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})

export class ClipService {

  // The property we've created will store the collection for the users uploads.
  // This step is optional, but type checking should always be a priority.
  public clipsCollection: AngularFirestoreCollection<IClip>;
  //
  pendingReq: boolean = false;

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
  // db       fireStore
  //
  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  //
  getUserClips(sort$: BehaviorSubject<string>) {

    // If the user changes the sorting order, the request will need to be performed again.
    // combineLatest → It can combine multiple observables.
    return combineLatest([
      this.fireAuth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        const [user, sort] = values

        if (!user) {
          return of([]);
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==', user.uid
        ).orderBy(
          'timestamp',
          sort === '1' ? 'desc' : 'asc'
        );

        return query.get();
      }), map(snapshot => (snapshot as QuerySnapshot<IClip>).docs
      ));
  }

  //
  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    });
  }

  //
  async deleteClip(clip: IClip) {
    const clipRef = this.fireStorage.ref(`clips/${clip.fileName}`)

    const screenshotRef = this.fireStorage.ref(
      `screenshots/${clip.screenshotFileName}`
    )

    await clipRef.delete()
    await screenshotRef.delete()

    await this.clipsCollection.doc(clip.docID).delete()
  }
}
