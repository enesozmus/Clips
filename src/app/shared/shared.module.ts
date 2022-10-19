import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseModalComponent } from './base-modal/base-modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { AlertComponent } from './alert/alert.component';
import { EventBlockerDirective } from './directives/event-blocker.directive'



@NgModule({
  declarations: [
    BaseModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    // Çünkü dışarıda kullanmak istiyoruz.
    // We're exporting the component to make it accessible to other modules.
    BaseModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective
  ]
})

// We need to import the module into the AppModule.     imports: []
// Keep in mind, 'the SharedModule' should define components, pipes and directives for different parts of our app.
export class SharedModule { }
