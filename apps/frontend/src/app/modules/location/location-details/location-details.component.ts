import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'weather-location-details-component',
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.scss',
})
export class LocationDetailsComponent implements OnInit {
  centerSearchBar: boolean = true;

  searchInputControl = new UntypedFormControl();

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log('Location Details Component Initialized');
  }
}
