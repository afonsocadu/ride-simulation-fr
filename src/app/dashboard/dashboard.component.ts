import { Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import axios from 'axios';

declare module 'leaflet' { namespace Control { namespace Geocoder {const nominatim: (options?: any) => any;}}}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  protected _showMap = false;
  protected _inputCurrentLocation = '';
  protected _inputDestinationLocation = '';
  protected _map!: L.Map;
  protected _routingControl: any;
  protected _allowButtonRequestDriver = false;

  // User current location
  private currentLocationLatitude = 0;
  private currentLocationLongitude = 0;
  private _isCurrentLocationRendered: boolean = false;

  // User destination location
  private destinationLocationLatitude = 0;
  private destinationLocationLongitude = 0;
  private _isDestinationLocationRendered: boolean = false;

  private _driverCoordinates: any;

  // Default icon for the map
  private _defaultIcon = L.icon({
    iconUrl: '/assets/leaflet/location.png',
    iconSize: [41, 41],
  });

  constructor() {}
  protected _onSubmit(): void {
    this._isCurrentLocationRendered = false;
    this._isDestinationLocationRendered = false;
    this._setCurrentLocation().then(() => this._updateMapIfReady());
    this._setDestinationLocation().then(() => this._updateMapIfReady());
    this._showMap = true;
    this._allowButtonRequestDriver = true;
  }

  protected _requestDriver() {
    const marker = L.marker([this.currentLocationLatitude, this.currentLocationLongitude], { icon: this._defaultIcon }).addTo(this._map);
debugger
    this._driverCoordinates.forEach((coord: any, index: any) => {
      setTimeout(() => {
        marker.setLatLng([coord.lat, coord.lng]);
        this._map.setView([coord.lat, coord.lng], 16);
      }, 400 * index);
    }).addTo(this._map);
  }


  private async _setCurrentLocation(): Promise<void> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { format: 'json', q: this._inputCurrentLocation }
      });
debugger
      const location = response.data[0].boundingbox;
      this.currentLocationLatitude = location[0];
      this.currentLocationLongitude = location[2];
      this._isCurrentLocationRendered = true;
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  }

  /** Set destination location based on the input value */
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

  private _updateMapIfReady(): void {
    if (this._isCurrentLocationRendered && this._isDestinationLocationRendered) {
      this._updateMap();
    }
  }

  private _initializeMap(): void {
    if (this._map) {
      this._map.remove();
    }

    L.Marker.prototype.options.icon = this._defaultIcon;
    this._map = L.map('map').setView([this.currentLocationLatitude, this.currentLocationLongitude], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this._map);

    this._routingControl = L.Routing.control({
      waypoints: [
        L.latLng(this.currentLocationLatitude, this.currentLocationLongitude),
        L.latLng(this.destinationLocationLatitude, this.destinationLocationLongitude)
      ],
      waypointMode: 'connect',
      showAlternatives: false,
      show: false,
      geocoder: null,
      addWaypoints: false
    }).on('routesfound', (e: any) => {
      debugger
      this._driverCoordinates = e.routes[0].coordinates;
    }).addTo(this._map);
  }

//options.waypoints.
  private _updateMap(): void {
    if (!this._map) {
      this._initializeMap();
      return;
    }

    this._map.setView([this.currentLocationLatitude, this.currentLocationLongitude], 14);

    if (this._routingControl) {
      this._routingControl.setWaypoints([
        L.latLng(this.currentLocationLatitude, this.currentLocationLongitude),
        L.latLng(this.destinationLocationLatitude, this.destinationLocationLongitude)
      ]);
    }
  }
}
