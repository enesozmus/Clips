import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /* Section Alert*/
  showAlert: boolean = false;
  alertMsg: string = 'Please wait! We are logging you in!';
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  constructor(private authFireService: AngularFireAuth) { }
  credentials = {
    email: '',
    password: ''
  };

  async login() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! We are logging you in!';
    this.inSubmission = true;
    try {
      await this.authFireService.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      );
    } catch (err) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Please try again later!';
      console.log(err);
      return;
    }
    this.alertColor = 'green';
    this.alertMsg = 'Success! You are now logged in!';
  }

  /*
    Template driven forms are configured directly in the template.
    Template forms have a lower learning curve.
    FormsModule
    NgForm    → Creates a top-level 'FormGroup' instance
              → and binds it to a form to track aggregate
              → form value and validation status.
    We can add a directive to our elements to help angular identify the controls in our form.
    NgModel   → Creates a FormControl instance from a domain model
              → and binds it to a form control element.
              → This directive can be added to any element that doesn't have the formControl or formControlName directives.
    First, we should verify its availability.
    We can assign an ID to the control with the name attributes.      name=""
      name="" NgModel 

    We need to add two way data binding.
      'Two way binding' is a feature for being able to listen to events and update values simultaneously.
      We will add property binding and event binding to the directive. The ngModel Directive can perform two tasks.


  */

  /*

    #
      The hash character allows us to declare a variable in the template.
      After typing this character we need to provide a name for our variable.

      <form #loginForm="ngForm" (ngSubmit)="login()"></form>
      <input   #email="ngModel"     name="email"    [(ngModel)]="credentials.email"    required >
      <input   #password="ngModel"  name="password" [(ngModel)]="credentials.password" required  >
      <button   type="submit"       [disabled]="loginForm.invalid"  ></button>
        credentials = {
          email: '',
          password: ''
        };
  */

}
