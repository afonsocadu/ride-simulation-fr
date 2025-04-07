import { Component, OnInit } from '@angular/core';
import { UserInfoService } from "./user-info.service";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationEnd } from "@angular/router";

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
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._getUserInfo();
    this._checkRouteAndCloseModal();
  }

  protected _backToPreviousPage() {
    this._router.navigate(['/map']);
  }

  protected _deleteAccount() {
    debugger;
    //this._userInfoService.deleteUserAccount().subscribe(() => {

    //}
  }

  private _getUserInfo() {
    this._userInfoService.getUserInfo().subscribe((data: any) => {
      if (data) {
        this._email = data.user_email;
        this._totalRides = data.total_rides;
      }
    });
  }

  private _checkRouteAndCloseModal() {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/user-info') {
          this._dialog.closeAll();
        }
      }
    });
  }
}
