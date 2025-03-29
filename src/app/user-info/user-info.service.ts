import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RideDetails } from './user-info-config';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  private url:string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getUserInfo(){
    return this.http.get(`${this.url}/rides`)
  }

  public createUserInfo(rider_details: RideDetails){
    return this.http.post(`${this.url}/rides`, { rider_details })
  }

  public updateStatusInfo(id: number, completed: boolean) {
    return this.http.put(`${this.url}/rides/${id}`, { completed });
  }
}
