import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private url:string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUserInfo(){
    return this.http.get(`${this.url}/rides`)
  }
}
