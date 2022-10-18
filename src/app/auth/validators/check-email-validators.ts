import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

// By adding this decorator, we will be able to inject services into the constructor function.
@Injectable({
    providedIn: 'root'
})

// We can assume the email is unique.
export class CheckEmailValidators implements AsyncValidator {

    constructor(private authFireService: AngularFireAuth) { }

    // an arrow func.
    validate = (control: AbstractControl): Promise<ValidationErrors | null> => {

        return this.authFireService.fetchSignInMethodsForEmail(control.value).then(
            response => response.length ? { emailTaken: true } : null
        );
    }
}