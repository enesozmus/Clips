import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
// We need to declare the component into the UserModule.     declarations:[]
// and 'This component' will be accessible from other components declared in the same module.
// <app-auth-modal></app-auth-modal>
// If we want to use this template in another module, we must also explicitly export variables, functions and objects.
// We're exporting the component to make it accessible to other modules.
export class AuthModalComponent implements OnInit, OnDestroy {

  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.register('authentication');
    
    /*
        It makes sense to unregister the model when the component gets destroyed.
        We can use lifecycle hooks to help us detect when the component is destroyed.
        Before the component gets destroyed we will call the unregister function.
        import { OnDestroy } from '@angular/core';
    */
  }


  ngOnDestroy(): void {
    this.modalService.unregister('authentication');
  }

}
