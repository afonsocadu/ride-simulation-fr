import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { DriverLocationService } from '../driver-location.service';


@Component({
  selector: 'app-user-map',
  standalone: true,
  imports: [],
  templateUrl: './user-map.component.html',
  styleUrl: './user-map.component.scss'
})
export class UserMapComponent implements OnInit, OnDestroy {
  private map: L.Map | undefined;
  private driverMarkers: L.Marker[] = [];
  private locationsSubscription: Subscription | undefined;

  constructor(private driverLocationService: DriverLocationService) {}

  ngOnInit(): void {
    this.initMap();
    this.subscribeToDriverLocations();
  }

  ngOnDestroy(): void {
    if (this.locationsSubscription) {
      this.locationsSubscription.unsubscribe();
    }
  }

  private initMap(): void {
    //Define map
    this.map = L.map('map', {
      center: [41.2036, -8.6110], 
      zoom: 16,
    });

    //Config marker
    const userIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    //L.Marker.prototype.options.icon = DefaultIcon;
    const marker = L.marker([41.2036, -8.6110], { icon: userIcon, draggable: true });
    const popUp = marker.bindPopup('You are here').addTo(this.map);
  
    //Define google street configuration
    const googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    googleStreets.addTo(this.map);
  
  }

  private subscribeToDriverLocations(): void {
    this.locationsSubscription = this.driverLocationService.getDriverLocations().subscribe(locations => {
      this.updateDriverMarkers(locations);
    });
  }

  private updateDriverMarkers(locations: any[]): void {
    // Remover os marcadores antigos
    this.driverMarkers.forEach(marker => {
      this.map?.removeLayer(marker);
    });
    this.driverMarkers = [];

    // Adicionar novos marcadores para cada motorista
    locations.forEach(driver => {
      const marker = L.marker([driver.lat, driver.lng]).addTo(this.map!);
      marker.bindPopup(`<b>Driver ${driver.id}</b><br>Lat: ${driver.lat.toFixed(5)}, Lng: ${driver.lng.toFixed(5)}`);
      this.driverMarkers.push(marker);
    });
  }
}

