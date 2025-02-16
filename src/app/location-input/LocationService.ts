import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly STORAGE_KEY = 'locations';

  private _locations = new BehaviorSubject<{
    currentLocation: { latitude: number; longitude: number };
    destinationLocation: { latitude: number; longitude: number };
  }>(this.loadLocations());

  locations$ = this._locations.asObservable();

  updateLocations(
    current: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): void {
    const newLocations = { currentLocation: current, destinationLocation: destination };
    this._locations.next(newLocations);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newLocations));
  }

  private loadLocations() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : { currentLocation: { latitude: 0, longitude: 0 }, destinationLocation: { latitude: 0, longitude: 0 } };
  }
}
