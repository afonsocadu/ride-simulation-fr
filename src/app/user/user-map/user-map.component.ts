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

    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconSize: [25, 41], // Tamanho do ícone
      iconAnchor: [12, 41], // Ponto de ancoragem
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    // Defina o ícone padrão
    L.Marker.prototype.options.icon = DefaultIcon;
    
    this.map = L.map('map', {
      center: [41.2036, -8.6110], 
      zoom: 16,
      
    });
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(this.map);
  
  
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

