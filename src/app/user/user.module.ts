import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component'; 
import { UserMapComponent } from './user-map/user-map.component';

@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    UserComponent,
    UserMapComponent
  ]
})
export class UserModule { }
