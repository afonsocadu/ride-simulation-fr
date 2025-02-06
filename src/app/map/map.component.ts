import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import axios from 'axios';
import { LocationService } from '../location-input/LocationService';
import { LocationService2 } from '../location-input/locationService2';

declare module 'leaflet' {
  namespace Control {
    namespace Geocoder {
      const nominatim: (options?: any) => any;
    }
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  protected _map!: L.Map;
  protected _routingControl: any;
  protected _allowButtonRequestDriver = false;

  // User current location
  private currentLocationLatitude: any = 0;
  private currentLocationLongitude = 0;

  // User destination location
  private destinationLocationLatitude = 0;
  private destinationLocationLongitude = 0;
  private _isDestinationLocationRendered = false;

  private _driverCoordinates: any;

  // Default icon for the map
  private _defaultIcon = L.icon({
    iconUrl: '/assets/leaflet/location.png',
    iconSize: [41, 41],
  });

  constructor(private _locationService: LocationService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this._initializeMap();
    this._setLocations()
  }

  private _initializeMap(): void {
    if (this._map) {
      this._map.remove();
    }

    L.Marker.prototype.options.icon = this._defaultIcon;
    this._map = L.map('map').setView([0, 0], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this._map);
  }

  protected _requestDriver(): void {
    this._initializeMap();
    const { mockDriverLat, mockDriverLng } = this._generateDriverMockLocation();

    this._routingControl = L.Routing.control({
      waypoints: [
        L.latLng(this.currentLocationLatitude, this.currentLocationLongitude),
        L.latLng(mockDriverLat, mockDriverLng),
      ],
      waypointMode: 'connect',
      showAlternatives: false,
      show: false,
      geocoder: null,
      addWaypoints: false,
    }).on('routesfound', (e: any) => {
      this._driverCoordinates = e.routes[0].coordinates;
    }).addTo(this._map);
  }

  _generateDriverMockLocation(): { mockDriverLat: number; mockDriverLng: number } {
    const currentLat = parseFloat(this.currentLocationLatitude.toString())
    const currentLng = parseFloat(this.currentLocationLongitude.toString());
    return {
      mockDriverLat: currentLat + 0.01,
      mockDriverLng: currentLng + 0.01
    };
  }

  // Sets the current and destination locations from the provided input data
  private _setLocations(): void {
    this._locationService.locations$.subscribe((locationData) => {
      this.currentLocationLatitude = locationData.currentLocation.latitude;
      this.currentLocationLongitude = locationData.currentLocation.longitude;

      this.destinationLocationLatitude = locationData.destinationLocation.latitude;
      this.destinationLocationLongitude = locationData.destinationLocation.longitude;

      this._routingControl = L.Routing.control({
        waypoints: [
          L.latLng(this.currentLocationLatitude, this.currentLocationLongitude),
          L.latLng(this.destinationLocationLatitude, this.destinationLocationLongitude),
        ],
        waypointMode: 'connect',
        showAlternatives: false,
        show: false,
        geocoder: null,
        addWaypoints: false,
      }).on('routesfound', (e: any) => {
        this._driverCoordinates = e.routes[0].coordinates;
      }).addTo(this._map);

      this._allowButtonRequestDriver = true;
    });
  }





}
