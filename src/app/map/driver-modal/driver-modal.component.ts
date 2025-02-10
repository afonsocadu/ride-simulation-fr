import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss']
})
export class DriverModalComponent implements OnInit {
  protected _price?: number;
  constructor(private dialogRef: MatDialogRef<any>) {
    this._generatePrice();
  }

  ngOnInit(): void {
  }

  private _generatePrice(): void {

  }

  closeModal(event: boolean): void {
    this.dialogRef.close(event);
  }

}
