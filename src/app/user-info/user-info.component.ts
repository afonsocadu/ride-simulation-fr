import { Component, OnInit } from '@angular/core';
import {UserInfoService} from "./user-info.service";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  constructor(private userInfoService: UserInfoService) { }

  ngOnInit(): void {
    this.userInfoService.getUserInfo();
  }

}
