import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService2 {
  private _currentLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 };
  private _destinationLocation: { latitude: number; longitude: number } = { latitude: 0, longitude: 0 };

  get currentLocation() {
    return this._currentLocation;
  }

  set currentLocation(location: { latitude: number; longitude: number }) {
    this._currentLocation = location;
  }

  get destinationLocation() {
    return this._destinationLocation;
  }

  set destinationLocation(location: { latitude: number; longitude: number }) {
    this._destinationLocation = location;
  }
}
