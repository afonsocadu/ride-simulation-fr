import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-control-geocoder';
import axios from "axios";

declare module 'leaflet' {
  namespace Control {
    namespace Geocoder {
      const nominatim: (options?: any) => any;
    }
  }
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public currentLocationLatitude: number = 0;
  public currentLocationLongitude: number = 0;
  private _isCurrentLocationRendered: boolean = false;

  public destinationLocationLatitude: number = 0;
  public destinationLocationLongitude: number = 0;
  private _isDestinationLocationRendered: boolean = false;

  public userLatitude: number = 0;
  public userLongitude: number = 0;

  protected _showMap: boolean = false;
  protected _currentLocation: string = '';
  protected _destinationLocation: string = '';
  title = 'ride-simulation-fr';
  public map!: L.Map;
  public DefaultIcon = L.icon({
    iconUrl: '/assets/leaflet/location.png',
    iconSize: [41, 41],
  });
  public routingControl: any;

  constructor() { }

  ngOnInit(): void {

    //this._initializeMap();
  }

  async ngAfterViewInit() {
  }

  protected _onSubmit() {
    this._isCurrentLocationRendered = false;
    this._isDestinationLocationRendered = false;
    if (this._showMap == false) {
      this._showMap = true;


    }
    this._setCurrentLocation();
    this._setDestinationLocation();
  }


  private _setCurrentLocation() {
    axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        format: 'json',
        q: this._currentLocation
      }
    }).then((response) => {
      //const geocoder = L.Control.Geocoder.nominatim();

      const location: number[] = response.data[0].boundingbox
      this.currentLocationLatitude = location[0] //Minimum latitude
      this.currentLocationLongitude = location[2] //Maximum longitude

      this._isCurrentLocationRendered = true;

      // Process the response here
      console.log(response.data);
    }).catch(function(error) {
      console.error("Error fetching geocode data:", error);
    });
  }

  private _setDestinationLocation() {
    axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        format: 'json',
        q: this._destinationLocation
      }
    }).then((response) => {

      //const geocoder = L.Control.Geocoder.nominatim();

      const location:number[] = response.data[0].boundingbox
      this.destinationLocationLatitude = location[0] //Minimum latitude
      this.destinationLocationLongitude = location[2] //Maximum longitude

      this._isDestinationLocationRendered = true;
debugger
      if (this._isCurrentLocationRendered && this._isDestinationLocationRendered) {
        this._updateMap()
      }
      console.log(response.data);
    }).catch(function(error) {
      console.error("Error fetching geocode data:", error);
    });
  }


  private _initializeMap() {
    // Destrua o mapa existente, se necessário
    if (this.map) {
      this.map.remove(); // Remove a instância atual do mapa
    }

    L.Marker.prototype.options.icon = this.DefaultIcon;

    // Inicialize o mapa com as configurações básicas
    this.map = L.map('map').setView([this.currentLocationLatitude, this.currentLocationLongitude], 14);

    // Adicione a camada de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Configure o controle de roteamento
    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(this.currentLocationLatitude, this.currentLocationLongitude),
        L.latLng(this.destinationLocationLatitude, this.destinationLocationLongitude)
      ],
      waypointMode: "connect",
      showAlternatives: false,
      show: false,
      geocoder: null,
      addWaypoints: false
    }).addTo(this.map);
  }

  private _updateMap() {
    // Atualize as configurações do mapa sem reinitializar completamente
    if (this.map) {
      this.map.setView([this.currentLocationLatitude, this.currentLocationLongitude], 14);

      if (this.routingControl) {
        this.routingControl.setWaypoints([
          L.latLng(this.currentLocationLatitude, this.currentLocationLongitude),
          L.latLng(this.destinationLocationLatitude, this.destinationLocationLongitude)
        ]);
      }
    } else {
      // Caso o mapa ainda não tenha sido inicializado
      this._initializeMap();
    }
  }
}
