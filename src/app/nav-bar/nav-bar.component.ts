import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
// We need to declare the component into the AppModule.     declarations:[]
// <app-nav-bar></app-nav-bar>
export class NavBarComponent implements OnInit {

  constructor(public modalService: ModalService) { }

  ngOnInit(): void {
  }

  openModal($event: Event) {
    // The preventDefault function will prevent the default behavior of the browser by calling this method.
    // Users will not unexpectedly be redirected to a different page.
    event.preventDefault();
    this.modalService.toggleModal('authentication');
  }
}
