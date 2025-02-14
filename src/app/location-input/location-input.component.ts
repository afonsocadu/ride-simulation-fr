import { Component } from '@angular/core';
import axios from "axios";
import {LocationService} from "./LocationService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.scss']
})
export class LocationInputComponent {
  protected _inputCurrentLocation = '';
  protected _inputDestinationLocation = '';

  // User current location
  private currentLocationLatitude = 0;
  private currentLocationLongitude = 0;
  private _isCurrentLocationRendered: boolean = false;

  // User destination location
  private destinationLocationLatitude = 0;
  private destinationLocationLongitude = 0;
  private _isDestinationLocationRendered: boolean = false;

  constructor(
    private _locationService: LocationService,
    private _router: Router
  ) { }

  protected _onSubmit(): void {
    this._isCurrentLocationRendered = false;
    this._isDestinationLocationRendered = false;
    this._setCurrentLocation().then(() => this._emitLocations());
    this._setDestinationLocation().then(() => this._emitLocations());
  }

  // Method to set the current location of the user
  private async _setCurrentLocation(): Promise<void> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { format: 'json', q: this._inputCurrentLocation }
      });

      const location = response.data[0].boundingbox;
      this.currentLocationLatitude = location[0];
      this.currentLocationLongitude = location[2];
      this._isCurrentLocationRendered = true;
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  }

  // Set destination location based on the input value
  private async _setDestinationLocation(): Promise<void> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { format: 'json', q: this._inputDestinationLocation }
      });

      const location = response.data[0].boundingbox;
      this.destinationLocationLatitude = location[0];
      this.destinationLocationLongitude = location[2];
      this._isDestinationLocationRendered = true;
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  }

  private _emitLocations(): void {
    if (this._isCurrentLocationRendered && this._isDestinationLocationRendered) {
      this._locationService.updateLocations(
        { latitude: this.currentLocationLatitude, longitude: this.currentLocationLongitude },
        { latitude: this.destinationLocationLatitude, longitude: this.destinationLocationLongitude }
      );

      this._router.navigate(['/map']);

    }
  }
}
