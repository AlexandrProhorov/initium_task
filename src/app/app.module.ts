import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './core/components/modal/modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterComponent } from './core/components/filter/filter.component';


@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    FilterComponent,
    ],
    imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
