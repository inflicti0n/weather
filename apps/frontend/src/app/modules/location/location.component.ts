import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'weather-location-component',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent implements OnInit {
  centerSearchBar: boolean = true;

  searchInputControl = new UntypedFormControl();

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log('Location Component Initialized');
  }
}
