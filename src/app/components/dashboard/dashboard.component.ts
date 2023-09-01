import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, fromEvent, interval, Subscription, tap, timeInterval } from 'rxjs';
import { DEFAULT_REFRESH_RATE } from '../../shared/const';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-dashboard',
  template: `
        <div class="container">
          <div class="central-container" style="order:1">
            <google-map width="1420px"
              height="410px"
              [zoom]="zoom"
              [center]="center">
            </google-map>
            <app-info-top></app-info-top>
            <app-info-map></app-info-map>
            <app-info-bottom></app-info-bottom>
          </div>
          <app-rpm-gauge style="order:0" [value]="rpm"></app-rpm-gauge>
          <app-speed-gauge style="order:2" [value]="speed"></app-speed-gauge>
        </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;

  sub = new Subscription();
  acc = false;
  rpm = 0;
  speed = 0;

  constructor() { }

  ngOnInit(): void {
    const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((e: KeyboardEvent) => e.key === 'ArrowUp'),
        tap(() => this.acc = true)
      );

    const keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        filter((e: KeyboardEvent) => e.key === 'ArrowUp'),
        tap(() => this.acc = false)
      );

    const interval$ = interval(DEFAULT_REFRESH_RATE)
      .pipe(
        timeInterval(),
        tap(() => {
          if (this.acc) {
            this.speed = this.speed < 300 ? this.speed += 1 : this.speed;
            this.rpm = this.rpm < 6000 ? this.rpm += 50 : this.rpm;
          } else {
            this.speed = this.speed > 0 ? this.speed -= 1 : this.speed;
            this.rpm = this.rpm > 0 ? this.rpm -= 50 : this.rpm;
          }
        })
      );

    this.sub.add(...[
      keyDown$.subscribe(),
      keyUp$.subscribe(),
      interval$.subscribe()
    ]);

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }
  
  display: any;
  zoom = 17;
  center: google.maps.LatLngLiteral = { lat: -23.6238370230242, lng: -46.69526979053957 };
  infoContent = '';

  moveMap(event:google.maps.MapMouseEvent){
    if(event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event:google.maps.MapMouseEvent){
    if(event.latLng != null) this.display = (event.latLng.toJSON());
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker);
  }

  logCenter() {
    console.log('deuidhiweu:', JSON.stringify(this.map.getCenter()))
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
