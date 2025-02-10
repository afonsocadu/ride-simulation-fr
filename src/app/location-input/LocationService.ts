import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _locations = new BehaviorSubject<{
    currentLocation: { latitude: number; longitude: number };
    destinationLocation: { latitude: number; longitude: number };
  }>({
    currentLocation: { latitude: 0, longitude: 0 },
    destinationLocation: { latitude: 0, longitude: 0 }
  });

  locations$ = this._locations.asObservable();

  updateLocations(current: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }): void {
    this._locations.next({ currentLocation: current, destinationLocation: destination });
  }
}
