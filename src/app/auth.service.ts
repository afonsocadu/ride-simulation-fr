import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl = `${environment.apiUrl}/auth`;
  constructor(private _http: HttpClient) {}

  /**
   * Method to do the login
   */
  public login(email: string, password: string): Observable<any> {
    return this._http.post(`${this._baseUrl}/sign_in`, { email, password }, { observe: 'response' }).pipe(
      tap(response => {
        const headers = response.headers;
        localStorage.setItem('access-token', headers.get('access-token') || '');
        localStorage.setItem('client', headers.get('client') || '');
        localStorage.setItem('uid', headers.get('uid') || '');
      })
    );
  }

  /**
   * Method to create new user
   */
  public createUser(email: string, password: string, password_confirmation: string): Observable<any> {
    const confirmSuccessUrl = 'http://localhost:4200/confirmation-success';
    return this._http.post(`${this._baseUrl}`, { email, password, password_confirmation, confirm_success_url: confirmSuccessUrl }, { observe: 'response' }).pipe(
      tap(response => {
        console.log('User created successfully', response);
      }),
    );
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('access-token') && !!localStorage.getItem('client') && !!localStorage.getItem('uid');
  }
}
