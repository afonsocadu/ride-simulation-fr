import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DriverLocationService {

  private driverLocations: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private drivers = [
    { id: 1, lat: -23.55052, lng: -46.633308 },
    { id: 2, lat: -23.55152, lng: -46.632308 },
    { id: 3, lat: -23.54952, lng: -46.634308 }
  ];

  constructor() {
    interval(3000).subscribe(() => this.updateLocations());
  }

  private updateLocations(): void {
    this.drivers = this.drivers.map(driver => {
      return {
        ...driver,
        lat: driver.lat + (Math.random() - 0.5) * 0.001,
        lng: driver.lng + (Math.random() - 0.5) * 0.001
      };
    });

    this.driverLocations.next(this.drivers); // Atualiza a emissão para os observadores
  }

  // Método para o componente se inscrever e receber as localizações
  getDriverLocations(): Observable<any[]> {
    return this.driverLocations.asObservable();
  }
}
