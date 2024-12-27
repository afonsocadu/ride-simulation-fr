import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverLocationService {

  private driverLocations: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private drivers = [
    { id: 1, lat: 41.2038, lng: -8.6108 },
    { id: 2, lat: 41.2032, lng: -8.6115 },
    { id: 3, lat: 41.2040, lng: -8.6120 }
  ];
  

  constructor() {
    interval(3000).subscribe(() => this.updateLocations());
  }

  private updateLocations(): void {
    this.drivers = this.drivers.map(driver => {
      return {
        ...driver,
        lat: driver.lat + (Math.random() - 0.5) * 0.001,
        lng: driver.lng + (Math.random() - 0.5) * 0.001
      };
    });

    this.driverLocations.next(this.drivers); 
  }

  getDriverLocations(): Observable<any[]> {
    return this.driverLocations.asObservable();
  }
}
