import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/contracts/user';

import { AuthService } from 'src/app/services/auth.service';
import { ConfirmPasswordValidators } from '../validators/confirm-password-validators';
import { CheckEmailValidators } from '../validators/check-email-validators';


/*
    'The FormGroup' object allows us to register a new form.
    You can think of it 'as a container' for our form.
      It's similar to our tabs component.
      We created a container for our tabs because we may have multiple groups of tabs on a page.
    'The FormGroup' object will allow us to create a container for a single form.
*/

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {

  // After injecting this service, we can start using its methods.
  constructor(private authService: AuthService, private emailValidators: CheckEmailValidators) {

  }


  /*
      { } The instance has one argument, which is an object of configuration options.
      { } We can configure this object to help angular understand what's inside the form.
  */
  /*
      A FormControl is an object that controls an individual input field.
      For every input field in our form, we should have a corresponding form FormControl.
        Once again, it's similar to our tab's components.
        We had a component for controlling a single tap.
      'The FormControl' object will control a single input field.
      as key value pairs
  */

  name = new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]);
  email = new FormControl('', [Validators.required, Validators.email], [this.emailValidators.validate]);
  age = new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]);
  password = new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)]);
  confirm_password = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]);

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
    /*
      Now, we will bind our FormGroup to the form in the template.
      We need to establish a relationship between the group in our class and the form element in the template.
      form     → [formGroup]="registerForm"
      submit   → (ngSubmit)=""
      inputs   → formControlName="name", formControlName="email", formControlName="age"...
      *ngIf="" → registerForm.controls.name.touched && registerForm.controls.name.dirty
                && registerForm.controls.name.errors?.required
    */
  }, [ConfirmPasswordValidators.match('password', 'confirm_password')]);

  /*
      We are going to be displaying an error for every rule.
          <p> {{ registerForm.controls.name?.errors | json }} </p> or
          <p> {{ registerForm.get('name').errors | json }} </p>

  */

  /*
      AbstractControl         This is the base class for FormControl, FormGroup, and FormArray.
        'registerForm.controls.name' property holds an object.
        The type of the object is AbstractControl.
      The [control] input wants an object with the type of FormControl.

      valid         the input is valid
      invalid       the input is invalid
      disabled      ignores validation on the input
      touched       the field has been touched
      untouched     the field remains untouched
      pristine      the value in the field remains unchanged
      dirty         the value in the field remains changed

  */

  /* Section Alert*/
  showAlert: boolean = false;
  alertMsg: string = 'Please wait! Your account is being created!';
  alertColor: string = 'blue';
  inSubmission: boolean = false;


  /*
      The function should be asynchronous.
      As noted in the documentation, the create user function will return a promise.
  */
  async register() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your account is being created!';
    this.inSubmission = true;

    const { email, password } = this.registerForm.value;

    try {
      await this.authService.registerUser(this.registerForm.value as IUser);
    }
    catch (err) {
      this.alertColor = 'red';
      this.alertMsg = 'An unexcepted error occurred. Please try again later!';
      this.inSubmission = false;
      console.log(err);
      return;
    }
    this.alertColor = 'green';
    this.alertMsg = 'Success! Your account has been created!';
  }

}