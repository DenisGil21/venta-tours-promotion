import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination/pagination.component';



@NgModule({
  declarations: [HeaderComponent, FooterComponent, PaginationComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    PaginationComponent,
  ]
})
export class SharedModule { }
