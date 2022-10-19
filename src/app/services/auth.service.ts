import { Injectable } from '@angular/core';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import IUser from '../contracts/user';

import { switchMap, filter, delay, map, Observable, of } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';



@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private userCollection: AngularFirestoreCollection<IUser>;
  // The dollar sign symbol is a special naming convention for identifying properties 'as observables'.
  // We should follow this practice to help other developers identify observables.
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  // The main goal of this lecture is to redirect the user if they're on a page that requires authentication.
  private redirect: boolean = false;

  // After injecting this service, we can start using its methods.
  constructor(private authFireService: AngularFireAuth, private db: AngularFirestore,
    private router: Router,
    private activatedRouter: ActivatedRoute) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = authFireService.user.pipe(
      // This single line will typecast the user argument into a Boolean value
      map(user => !!user)
    );
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));

    //authFireService.user.subscribe(console.log);
    //this.activatedRouter.data.subscribe(console.log);
    // The main goal of this lecture is to redirect the user if they're on a page that requires authentication.
    // 'This event' gets emitted whenever the router is finished navigating to a route.
    // After this event has been emitted, we can attempt to retrieve the data related to the current route.

    // The events of survival will emit several events.
    // We're not interested in handling every single event.
    // We can use operators to help us listen to a specific event.
    // The filter operator can perform this action efficiently.
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.activatedRouter.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false;
    });
  }

  public async registerUser(user: IUser) {

    const userCred = await this.authFireService.createUserWithEmailAndPassword(
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

  public async logout($event?: Event) {

    if ($event) {
      $event.preventDefault();
    }

    await this.authFireService.signOut();
    /*
      absolute and relative paths

        Next, we need to pass in an absolute path.
        Understanding the differences between absolute and relative paths is key to understanding the behavior of a router.
        We may want to redirect the user to a path called 'example'.
        'An absolute path' will redirect the user to the new path relative to the base path of our app. → /example
        On the other hand, a relative path gets appended to the current route. → /some/path/example

      current path: /some/path
      redirect:     /example
    */

    // The main goal of this lecture is to redirect the user if they're on a page that requires authentication.
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
