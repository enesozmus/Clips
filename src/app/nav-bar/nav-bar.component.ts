import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
// We need to declare the component into the AppModule.     declarations:[]
// <app-nav-bar></app-nav-bar>
export class NavBarComponent {

  // *ngIf="!isAuthenticated"
  isAuthenticated: boolean = false;

  constructor(public modalService: ModalService, public authService: AuthService,
    private authFireService: AngularFireAuth) {
    /*
        We will subscribe to the isAuthenticated$ observable from the AuthService.

        this.authService.isAuthenticated$.subscribe(status => {
            this.isAuthenticated = status;
        });
        but It's not necessary.

        async pipe

          Next, we had to store the value pushed by the 'observable'.
          Angular defines a pipe for subscribing to an 'observable' from within the template.
          We're going to apply the 'async' pipe.
          This pipe can be passed any 'promise or 'observable'.
          The async pipe is super helpful.
          We can use it to subscribe to observables from our templates.
    */
  }

  openModal($event: Event) {
    // The preventDefault function will prevent the default behavior of the browser by calling this method.
    // Users will not unexpectedly be redirected to a different page.
    $event.preventDefault();
    this.modalService.toggleModal('authentication');
  }

  async logout($event: Event) {

    $event.preventDefault();
    await this.authFireService.signOut();
  }

  /*
      If you are to look at a token, all you would see is random gibberish.
      One of the most significant advantages of tokens is that they're digitally signed.
      Any changes to their token will automatically invalidate it.

      Tokens are encoded strings that hold your data.
      They're used to transport data between the client and the server.
      Tokens are generally generated on the back end.

      JSON web tokens

      Tokens are broken down into three sections.
        The first section is the header. It's an object with two properties.
          There's the algorithm and the type.
          This section is where we can store meta information about a token.
        The next section is the payload.
          This is the contents of the web token.
          It's an object filled with data.
          You can store any type of data you'd like.
        The last section is the signature.
          The signature is used to verify the contents of the web token.  
  */

  /*
      SSL or TLC is a standard for encrypting data when it's sent between the client and server.
  */

}
