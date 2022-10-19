import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[app-event-blocker]'
})


export class EventBlockerDirective {

  // We will define a public method called handleEvent.
  // It'll be decorated with the HostListener decorator.
  // We're going to listen to an event called Drop.
  // The HostListener directive will understand that we want the event object.
  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event']) 
  public handleEvent($event: Event) {

    $event.preventDefault();
  }

}

/*
    Directives are defined as classes decorated with the @Directive() decorator.
    The @Directive() decorator will allow the class to be injected with services
    We can pass in an object to configure the directive. In this example, the selector property will configure the name of the directive.

    Primary goal of this directive is to block and events default behavior.
    This directive should be able to prevent the default behavior on any element.


    We're going to begin the upload process by using drag and drop events.
    because We don't want the user to be redirected away from the app when they drop a file.
    We are going to design the directive to be reusable.

*/

/*
    The HostListener decorator performs two actions.
      First, it also let the host element.
      Secondly, it will listen to an event on the host.
    We can use this decorator to prevent the default behavior of the host elements events.
*/

/*
  The drop event is emitted when the user has released an element or text selection on an element.
  This event can be triggered when the user releases their mouse or by pressing the escape key.
  The dragover event is emitted when an element or selection is dragged over an element.
*/