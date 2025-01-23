import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {lastValueFrom} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  protected _email: string = '';
  protected _password: string = '';
  protected _password_confirmation: string = '';
  protected _isCreatingUser: boolean = false;

  constructor(private _authService: AuthService,  private _router: Router) {}

  public ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        function(error) {
          if (error.code === 1) {
            alert('Você negou o acesso à sua localização. Para continuar, permita o acesso.');
          } else {
            console.error('Erro ao obter localização:', error.message);
          }
        }
      );
    } else {
      console.log('Geolocalização não é suportada neste navegador.');
    }
  }

  /**
   * Logs in as a recruiter by creating a new user with a unique email and default password.
   * Upon successful user creation, submits the login form.
   */
  protected _logInRecruiter() {
    this._email = this._generateUniqueEmail();
    this._password = '123456'
    this._password_confirmation = '123456'

    this._createUser();

  }

  protected _toggleForm() {
    this._isCreatingUser = !this._isCreatingUser;
  }

  /**
   * Handles the login form submission.
   */
  protected onSubmit() {
    if (this._isCreatingUser) {
      this._createUser();

      return
    }

    this._login();

  }


  /**
   * Generates a unique email
   */
  private _generateUniqueEmail(): string {
    const timestamp = new Date().getTime();
    return `recruiter${timestamp}@example.com`;
  }

  private _login() {
    this._authService.login(this._email, this._password).subscribe(
      response => {
        console.log(response)
        if (response.status == 200) {
          this._router.navigate(['/dashboard']);
        }
      }
    )
  }


  private async _createUser() {
    try {
      const response = await lastValueFrom(
        this._authService.createUser(this._email, this._password, this._password_confirmation)
      )

      if (response.body.status == 'success') {
        this._login();
        return
      }
    } catch(error) {
      if (error instanceof HttpErrorResponse) {
        //TODO Refactor to improve readability
        const errorMessage = error.error?.errors?.full_messages;


      }
    }
  }
}
