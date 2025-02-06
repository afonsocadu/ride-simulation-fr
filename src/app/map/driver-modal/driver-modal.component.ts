import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-driver-modal',
  templateUrl: './driver-modal.component.html',
  styleUrls: ['./driver-modal.component.scss']
})
export class DriverModalComponent implements OnInit {
  protected _price?: number;
  constructor() {
    this._generatePrice();
  }

  ngOnInit(): void {
  }

  private _generatePrice(): void {

  }

}
