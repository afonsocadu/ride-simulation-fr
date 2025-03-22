import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import {LocationService} from '../location-input/LocationService';
import {MatDialog} from "@angular/material/dialog";
import {DriverModalComponent} from "./driver-modal/driver-modal.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  protected _map!: L.Map;
  protected _routingControl: any;
  protected _allowButtonRequestDriver = false;
  protected _driverisMoving = false;

  // User current location
  private currentLocationLatitude: any = 0;
  private currentLocationLongitude = 0;

  // User destination location
  private destinationLocationLatitude = 0;
  private destinationLocationLongitude = 0;

  private _driverCoordinates: string[] = [];
  private _driverToUserDistance = 0;
  private _totalDistance = 0;

  // Default icon for the map
  private _defaultIcon = L.icon({
    iconUrl: '/assets/leaflet/location.png',
    iconSize: [41, 41],
  });

  constructor(
    private _locationService: LocationService,
    private _dialog: MatDialog,
    private _router: Router) { }

  ngOnInit(): void {
    this._initializeMap();
    this._setLocations();
  }

  protected async _requestDriver() {
    this._initializeMap();
    const {mockDriverLat, mockDriverLng} = this._generateDriverMockLocation();
    this._setupRoutingControl(mockDriverLat, mockDriverLng);
  }

  protected _cancelRide(): void {
    this._driverisMoving = false;
    this._router.navigate(['/user-info']);
  }

  private _setupRoutingControl(mockDriverLat: number, mockDriverLng: number): void {
    this._routingControl = L.Routing.control({
      waypoints: [
        L.latLng(mockDriverLat, mockDriverLng),
        L.latLng(this.currentLocationLatitude, this.currentLocationLongitude)
      ],
      waypointMode: 'connect',
      showAlternatives: false,
      show: false,
      geocoder: null,
      addWaypoints: false,
    }).on('routesfound', (e: any) => {
      this._driverToUserDistance = e.routes[0].summary.totalDistance;
      this._driverCoordinates = e.routes[0].coordinates;

      this._openDriverModal(mockDriverLat, mockDriverLng);
    }).addTo(this._map);
    this._allowButtonRequestDriver = false;
  }

  private _openDriverModal(mockDriverLat: number, mockDriverLng: number): void {
    const dialogRef = this._dialog.open(DriverModalComponent, {
      width: '500px',
      data: { driverToUserDistance: this._driverToUserDistance, totalDistance: this._totalDistance },
      panelClass: 'modal-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === false) {
        this._setLocations()
        return;
      }
      this._driverisMoving = result
      const marker = L.marker([mockDriverLat, mockDriverLng], {icon: this._defaultIcon})
        .addTo(this._map)
        .bindPopup('<b>Your driver is here!</b>')
        .openPopup();

      this._moveDriverToUserLocation(marker);
    });
  }

  /* Move the driver to the user's location */
  private _moveDriverToUserLocation(marker: L.Marker): void {
    this._driverCoordinates.forEach((coord: any, index: any) => {
      setTimeout(() => {
        marker.setLatLng([coord.lat, coord.lng]);
        this._map.setView([coord.lat, coord.lng], 16);
        if (index === this._driverCoordinates.length - 1) {

          L.popup()
            .setLatLng([coord.lat, coord.lng])
            .setContent('<b>Driver has arrived!</b>')
            .openOn(this._map);

          setTimeout(() => {
            this._onDriverArrival();
          }, 2000);
        }
      }, 100 * index);
    });
  }

  private _onDriverArrival(): void {
    this._initializeMap();
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
      this._driverCoordinates = e.routes[0].coordinates;
      this._moveDriverToDestination();
    }).addTo(this._map);
  }

  // Move the driver to the destination location
  private _moveDriverToDestination(): void {
    const marker = L.marker([this.currentLocationLatitude, this.currentLocationLongitude],).addTo(this._map);
    this._driverCoordinates.forEach((coord: any, index: any) => {
      setTimeout(() => {
        marker.setLatLng([coord.lat, coord.lng])
          .addTo(this._map)
          .bindPopup('<b>Driver is on the way!</b>')
          .openPopup();

        this._map.setView([coord.lat, coord.lng], 16);
        if (index === this._driverCoordinates.length - 1) {

          // Update current location to destination location
          this.currentLocationLatitude = this.destinationLocationLatitude;
          this.currentLocationLongitude = this.destinationLocationLongitude;
        }
      }, 100 * index);
    });
  }


  // Generates a mock driver location
  private _generateDriverMockLocation(): { mockDriverLat: number; mockDriverLng: number } {
    const currentLat = parseFloat(this.currentLocationLatitude.toString());
    const currentLng = parseFloat(this.currentLocationLongitude.toString());
    return {
      mockDriverLat: currentLat + 0.01,
      mockDriverLng: currentLng + 0.01
    };
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
        this._totalDistance = e.routes[0].summary.totalDistance;

      }).addTo(this._map);

      this._allowButtonRequestDriver = true;
    });
  }
}
