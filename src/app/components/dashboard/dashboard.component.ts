import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, interval, startWith, Subscription, tap, timeInterval } from 'rxjs';
import { DEFAULT_REFRESH_RATE } from '../../shared/const';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-dashboard',
  template: `
        <div class="container">
          <div class="central-container" style="order:1;flex-direction: column;">
            <div class="map">
              <google-map width="1380px"
                height="410px"
                [options]="mapOptions" >
                <map-marker [position]="marker.position"></map-marker>
              </google-map>
            </div>
            <app-info-top></app-info-top>
            <app-info-map></app-info-map>
            <app-info-bottom [value]="totalKm"
              [fuel]="fuelLevel"></app-info-bottom>
          </div>
          <app-rpm-gauge style="order:0" [value]="rpm"></app-rpm-gauge>
          <app-speed-gauge style="order:2" [value]="speed"></app-speed-gauge>
        </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  @ViewChild(MapMarker, { static: false }) myMarker!: MapMarker;

  sub = new Subscription();
  acc = false;
  rpm = 0;
  speed = 0;
  totalKm = 0;
  fuelLevel = 3;

  constructor() { }

  ngOnInit(): void {
    const mouseDown$ = fromEvent<MouseEvent>(document, 'mousedown')
      .pipe(
        startWith('initial'),
        tap(() => this.acc = true)
      );

    const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(
        startWith('initial'),
        tap(() => this.acc = false)
      );

    const interval$ = interval(DEFAULT_REFRESH_RATE)
      .pipe(
        timeInterval(),
        tap(() => {
          if (this.acc) {
            this.speed = this.speed < 300 ? this.speed += 20 : this.speed;
            this.rpm = this.rpm < 6000 ? this.rpm += 400 : this.rpm;
          } else {
            this.speed = this.speed > 0 ? this.speed -= 10 : this.speed;
            this.rpm = this.rpm > 0 ? this.rpm -= 200 : this.rpm;
          }
        })
      );

    this.sub.add(...[
      mouseDown$.subscribe(),
      mouseUp$.subscribe(),
      interval$.subscribe()
    ]);

    navigator.geolocation.getCurrentPosition((position) => {
      const c = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.myMarker?.marker?.setPosition(c);
      this.mapOptions.center = c;
    });
  }


  mapOptions: google.maps.MapOptions = {
    center: { lat: -23.6238370230242, lng: -46.69526979053957 },
    zoom: 17,
    disableDefaultUI: true,
  }

  display: any;
  infoContent = '';
  marker = {
    position: { lat: -23.6238370230242, lng: -46.69526979053957 },
  }

  moveMap(event:google.maps.MapMouseEvent){
    if(event.latLng != null) this.mapOptions.center = (event.latLng.toJSON());
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
