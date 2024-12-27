import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, Marker, icon, Map } from 'leaflet';
import { DriverLocationService } from '../user/driver-location.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './map.component.html',
})
export class MapComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
  