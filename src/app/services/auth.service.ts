import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { delay, map, Observable } from 'rxjs';
import IUser from '../contracts/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userCollection: AngularFirestoreCollection<IUser>;
  // The dollar sign symbol is a special naming convention for identifying properties 'as observables'.
  // We should follow this practice to help other developers identify observables.
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  // After injecting this service, we can start using its methods.
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      // This single line will typecast the user argument into a Boolean value
      map(user => !!user)
    );
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    auth.user.subscribe(console.log);
  }

  public async registerUser(user: IUser) {

    const userCred = await this.auth.createUserWithEmailAndPassword(
      user.email as string, user.password as string
    );

    await this.userCollection.doc(userCred.user?.uid).set({
      name: user.name,
      email: user.email,
      age: user.age,
      phoneNumber: user.phoneNumber
    });

    await userCred.user.updateProfile({
      displayName: user.name
    });
  }
}
