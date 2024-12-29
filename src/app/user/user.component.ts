import { Component } from '@angular/core';
import { UserMapComponent } from './user-map/user-map.component';

@Component({
  selector: 'app-user',
  imports: [UserMapComponent],
  standalone: true,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {}
