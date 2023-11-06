import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { LogoutComponent } from '../logout/logout.component'; 
// import {HeaderModule} from '../shared/header/header.module';
// import {FooterModule} from '../shared/footer/footer.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [LogoutComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule, 
    AppRoutingModule, 
    // HeaderModule,
    // FooterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LogoutModule { }
