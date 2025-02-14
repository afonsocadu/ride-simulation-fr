import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import { LocationService } from '../location-input/LocationService';
import { MatDialog } from "@angular/material/dialog";
import { DriverModalComponent } from "./driver-modal/driver-modal.component";

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

  private _driverCoordinates: any;

  // Default icon for the map
  private _defaultIcon = L.icon({
    iconUrl: '/assets/leaflet/location.png',
    iconSize: [41, 41],
  });

  constructor(private _locationService: LocationService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this._initializeMap();
    this._setLocations();
  }

  protected _requestDriver(): void {
    this._initializeMap();
    const { mockDriverLat, mockDriverLng } = this._generateDriverMockLocation();
    this._setupRoutingControl(mockDriverLat, mockDriverLng);
    this._openDriverModal(mockDriverLat, mockDriverLng);
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
      this._driverCoordinates = e.routes[0].coordinates;
    }).addTo(this._map);
    this._allowButtonRequestDriver = false;
  }

  private _openDriverModal(mockDriverLat: number, mockDriverLng: number): void {
    const dialogRef = this._dialog.open(DriverModalComponent, {
      width: '500px',
      data: {},
      panelClass: 'modal-container',
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if(result === 'cancel') {
        return;
      }

      const marker = L.marker([mockDriverLat, mockDriverLng], { icon: this._defaultIcon })
        .addTo(this._map)
          .bindPopup('<b>Your driver is here!</b>')
        .openPopup();

      this._moveMarker(marker);
    });
  }

  private _moveMarker(marker: L.Marker): void {
    this._driverCoordinates.forEach((coord: any, index: any) => {
      setTimeout(() => {
        marker.setLatLng([coord.lat, coord.lng]);
        this._map.setView([coord.lat, coord.lng], 16);
        if (index === this._driverCoordinates.length - 1) {


          this._onDriverArrival();
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
      this._moveMarkerToDestination();
    }).addTo(this._map);
  }

  private _moveMarkerToDestination(): void {
    const marker = L.marker([this.currentLocationLatitude, this.currentLocationLongitude],).addTo(this._map);
    this._driverCoordinates.forEach((coord: any, index: any) => {
      setTimeout(() => {
        marker.setLatLng([coord.lat, coord.lng]);
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
      }).addTo(this._map);

      this._allowButtonRequestDriver = true;
    });
  }
}
