import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

// ♫ CommonModule
// ♫ Exports components, directives and pipes.
// ♫ Exports all the basic Angular directives and pipes, such as 'NgIf', 'NgForOf', 'DecimalPipe', and so on.
// ♫ CommonModule is re-exported by the BrowserModule.
// ‼ The main difference between them is that the BrowserModule will provide 'additional services' for running an app in the browser.

@NgModule({
  declarations: [
    // 'This component' will be accessible from other components declared in the same module.
    // For example, The NavBarComponent is not declared inside this module.
    AuthModalComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    // If we want to use this template in another module, we must also explicitly export variables, functions and objects.
    // We're exporting the component to make it accessible to other modules.
    AuthModalComponent
  ]
})
// We need to import the module into the AppModule.     imports: []
export class AuthModule { }
