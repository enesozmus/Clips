import { Component, Input, OnInit, ElementRef} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

/*
  The AuthModalComponent will handle the inner content of the modal.
  It will not care about whether the modal is being displayed on the page.

  'The BaseModalComponent' in 'the SharedModule' will not handle the inner content.
  It will focus on the visibility of the model.
*/

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss']
})
/*
    We need to declare the component into the SharedModule.     declarations:[]
    and 'This component' will be accessible from other components declared in the same module.

    We're exporting the component to make it accessible to other modules.
*/
export class BaseModalComponent implements OnInit {

  /*
      We use an identity system.
      The service is no longer managing a single model.
      So we will need a parent-child relationship between the components.
      Hangi modal'a göre işlem yapacağımız bilgisi modal'ların kendisinden modalID olarak gelecek.
  */
  @Input() modalID = '';

  // Angular will manage our dependencies.
  constructor(public modalService: ModalService, public elementRef: ElementRef) { 
    console.log(elementRef);
  }

  ngOnInit(): void {
    // CSS issues
    document.body.appendChild(this.elementRef.nativeElement)
  }

  closeModal() {
    this.modalService.toggleModal(this.modalID);
  }

  /*
    The 'ElementRef' object gives us access to the host element of our component.
  */

}
