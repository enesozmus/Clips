import { Injectable } from '@angular/core';

/*

    by default, Angular does not make our classes injectable.
    We must tell Angular which of our classes can be injected into components.
    There are three ways of making a class injectable.
    You can inject services on a global level, module level or component level.
      
    1
      We are decorating the class with the @Injectable() decorator.
      It'll tell Angular the class can be injected into a component.
      We have one option called providedIn.    an object of configuration options
      This option will tell Angular where to expose the service by setting it to route.
      The service will be injectable from the root injector, therefore it can be injected into any component in our app.
    2
      sharedmodule → providers
    3
      component.ts → providers


*/

/*
  We use an identity system.
  The service is no longer managing a single model.
  These functions should start using IDs to help them perform their respective actions.
  We will need a parent-child relationship between the components.
*/
interface IModal {
  id: string;
  visible: boolean;

}


@Injectable({
  providedIn: 'root'
})
/*
    Services are objects that can be made available to any component of our app.
    We have a service called 'ModalService.
    The 'ModalService' will be responsible for managing our modals inside this class.
*/
export class ModalService {

  // The property we've created will tell other components of the model should be shown or hidden.
  // There's only one problem. We don't know how to expose this property to other components.
  // Angular has a feature called 'dependency injection' for addressing this problem.
  // Angular will manage our dependencies.

  private visible: boolean = false;
  private modals: IModal[] = [];

  constructor() { }

  register(id: string) {
    this.modals.push({ id, visible: false });
    //console.log(this.modals);
  }

  unregister(id: string){
    /*
      The function must return a Boolean value.
      If we return 'true', the element will be added to the new array.
      Otherwise, it will be excluded.

      We want to check if they're not equal to each other.  
      As long as the IDs don't match, the model will be added to the array.
      If there is a match, it'll be excluded from the array.

      We can move on to the next step, which is to call this function when the model is destroyed.
    */
    this.modals = this.modals.filter(
      element => element.id !== id
    );
  }

  isModalOpen(id: string): boolean {

    /* 
        false olarak git
        yani default olarak kapalı dur
    */
    return this.modals.find(element => element.id === id)?.visible;
    // If the find function does not return an object, the line of code will stop at 'the question mark'.
    // As we know, adding a negation operator will convert the type of the value to a Boolean.
    //  return !!this.modals.find(element => element.id === id)?.visible;
    // Boolean(this.modals.find(element => element.id === id)?.visible);
  }

  toggleModal(id: string) {
    /*
        birden fazla modal ile aynı anda çalışmak istediğimiz için bir ID sistemi kurduk
        ve bu ID sistemine göre hareket ediyoruz.
    */
    const modal = this.modals.find(element => element.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
