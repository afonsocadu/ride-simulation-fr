import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss']
})
export class DriverModalComponent implements OnInit {
  protected _price?: number;
  protected driverToUserDistance?: number;
  protected _totalDistance: number = 0;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.driverToUserDistance = data.driverToUserDistance;
    this._convertTotalDistanceToKm(data.totalDistance)
  }

  ngOnInit(): void {
    this._price = this._calculateFare();
  }


  closeModal(event: boolean): void {
    this.dialogRef.close(event);
  }

  private _calculateFare(): number {
    const baseFare = 5;
    const costPerKm = 1.5;
    const distanceInKm = this._totalDistance;

    return baseFare + distanceInKm * costPerKm;
  }

  // Converts the total distance from meters to kilometers
  private _convertTotalDistanceToKm(totalDistance: number): void {
    if (!totalDistance) {
      return;
    }

    this._totalDistance = Number((totalDistance / 1000).toFixed(2));
  }
}
