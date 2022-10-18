import { ValidationErrors, AbstractControl, ValidatorFn } from "@angular/forms";

export class ConfirmPasswordValidators {

    // we will add a static method called Match.
    // if a method is static We can directly call the method without creating a new instance.
    // The main goal of this function is to match the passwords.
    static match(controlName: string, matchingControlName: string): ValidatorFn {

        // an arrow func.
        return (group: AbstractControl): ValidationErrors | null => {

            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);

            if (!control || !matchingControl) {
                console.error('Form controls can not be found in the form group.')
                return { controlNotFound: false }
            }

            // parolalar eşleşirs null döner
            // eşleşmezse noMatch: true döner
            const error = control.value === matchingControl.value ?
                null : { noMatch: true }

            matchingControl.setErrors(error);
            return error;
        }
        /*
            We should annotate the methods return type for type safety
            Validators must return either an object containing errors or null.

        */
    }
}


/*
        Let's say the match method did not have the static keyword.
        If we want to call this method, a new instance of the Register of Validators class must be created.
        After creating the instance, we will be able to call this method.
*/

