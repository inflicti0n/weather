import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SettingsService } from './shared/services/settings.service';

@Component({
  selector: 'weather-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    //Subscribe to font changes
    this.settingsService.currentFont$.subscribe((fontClass: string) => {
      //Clear any old font classes on body
      this.renderer.removeClass(this.document.body, 'comfortaa');
      this.renderer.removeClass(this.document.body, 'atkinson-hyperlegible');
      this.renderer.removeClass(this.document.body, 'opendyslexic');
      console.log('Adding Class to Body : ', fontClass);
      this.renderer.addClass(this.document.body, fontClass);
    });
  }
}
