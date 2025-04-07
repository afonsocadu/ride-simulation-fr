import { Component, OnInit } from '@angular/core';
import {UserInfoService} from "./user-info.service";
import {LocationService} from "../location-input/LocationService";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  protected _email: string = '';
  protected _totalRides: number = 0;

  constructor(
    private _userInfoService: UserInfoService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this._getUserInfo();
  }

  protected _backToPreviousPage() {
    this._router.navigate(['/map']);
  }

  private _getUserInfo() {
    this._userInfoService.getUserInfo().subscribe((data: any) => {
      if (data) {
        this._email = data.user_email
        this._totalRides = data.total_rides
      }
    })
  }
}
