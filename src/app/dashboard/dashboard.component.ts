import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  public mapLatitude: any;
  public mapLongitude: any;
  public userLatitude: number = 0;
  public userLongitude: number = 0;

  title = 'ride-simulation-fr';
  public map!: L.Map;
  public DefaultIcon = L.icon({
    iconUrl: '/assets/leaflet/location.png',
    iconSize: [41, 41],
  });

  constructor() { }

  ngOnInit(): void {
    this._getUserLogin();

  }

  async ngAfterViewInit() {

   // this._initializeMap();
  }


  /*
    * Get user login
    * if the user allows the location, the latitude and longitude will be saved
    * if the user denies the location, an alert will be displayed and a mock latitude and longitude will be saved
  * */
  private async _getUserLogin(): Promise<void> {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.mapLatitude = position.coords.latitude;
          this.mapLongitude = position.coords.longitude;
          this._initializeMap();
        },
        (error) => {
          if(error.code === 1){ console.log('O usuário negou o acesso à localização do dispositivo.') }
          console.log('Não foi possível obter a localização do usuário. Vamos utilizar uma localizaçao padrão.');
          this.mapLatitude = 41.158;
          this.mapLongitude = -8.630;
          this._initializeMap();
        }
      );
    }
  }

  private _initializeMap() {
    L.Marker.prototype.options.icon = this.DefaultIcon;
    this.map = L.map('map').setView([this.mapLatitude, this.mapLongitude], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    //const marker = L.marker([41.158, -8.630], { icon: this.DefaultIcon }).addTo(this.map);
    //marker.bindPopup('Localização inicial: Casa da Música').openPopup();

    L.Routing.control({
      waypoints: [
        L.latLng([this.mapLatitude, this.mapLongitude], ),
        L.latLng(41.14961, -8.61099)
      ],
      waypointMode: "connect",
      routeWhileDragging: true,
      showAlternatives: false,
      //show: false,
      geocoder: null,
      addWaypoints: false
    }).addTo(this.map);
    debugger

  }

}
