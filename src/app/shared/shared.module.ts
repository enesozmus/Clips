import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseModalComponent } from './base-modal/base-modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';



@NgModule({
  declarations: [
    BaseModalComponent,
    TabsContainerComponent,
    TabComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // Çünkü dışarıda kullanmak istiyoruz.
    // We're exporting the component to make it accessible to other modules.
    BaseModalComponent,
    TabsContainerComponent,
    TabComponent
  ]
})

// We need to import the module into the AppModule.     imports: []
// Keep in mind, 'the SharedModule' should define components, pipes and directives for different parts of our app.
export class SharedModule { }
