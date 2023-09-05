import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { select } from 'd3';
import * as moment from 'moment';

@Component({
  selector: 'app-info-bottom',
  template: `<div>
    <div class="left-bottom"></div>
    <div class="info-bottom"></div>
    <div class="right-bottom"></div>
  </div>`
})
export class InfoBottomComponent implements OnInit {
  @Input() value: number = 0;
  @Input() fuel: number = 0;

  constructor(private readonly elementRef: ElementRef) {}

  ngOnInit(): void {
    this.generate();
  }

  private generate(): void {
    const el = this.elementRef.nativeElement.querySelector('.info-bottom');
    const svg = select(el).append('svg').attr('width', '100%').attr('height', '100%').attr('viewBox', '0 0 460 200');
    const g = svg.append('g');

    // trip km text
    g.append('text')
      .text('Cons: 9,2 km/l')
      .attr('x', '90px')
      .attr('y', '40px')
      .attr('font-size', '18')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF');

    // red line
    g.append('image')
      .attr('xlink:href', '/assets/images/red-line.svg')
      .attr('x', '160px')
      .attr('y', '22px')
      .attr('width', '25px')
      .attr('height', '25px');

    // hour
    const date = new Date();
    g.append('text')
      .text( moment(date).format('DD/MM HH:mm') )
      .attr('x', '230px')
      .attr('y', '40px')
      .attr('font-size', '18')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF');

    // red line
    g.append('image')
      .attr('xlink:href', '/assets/images/red-line.svg')
      .attr('x', '280px')
      .attr('y', '22px')
      .attr('width', '25px')
      .attr('height', '25px');

    // mileage
    g.append('text')
      .text(this.value+' km')
      .attr('x', '370px')
      .attr('y', '40px')
      .attr('font-size', '18')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF');

    // white line
    g.append('image')
      .attr('xlink:href', '/assets/images/white-line.svg')
      .attr('x', '65px')
      .attr('y', '70px')
      .attr('width', '320px')
      .attr('height', '10px');

    // iPhone text
    g.append('text')
      .text('Erick Crus')
      .attr('x', '120px')
      .attr('y', '100px')
      .attr('font-size', '16')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF');

    // musical note
    g.append('image')
      .attr('xlink:href', '/assets/images/musical-note.svg')
      .attr('x', '190px')
      .attr('y', '80px')
      .attr('width', '25px')
      .attr('height', '25px');

    // Song text
    g.append('text')
      .attr('x', '285px')
      .attr('y', '90px')
      .attr('textLength', '180px')
      .attr('lengthAdjust', 'spacing')
      .attr('font-size', '12')
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
        .append('tspan')
        .attr('x', '300')
        .text('Bezerra da Silva')
        .append('tspan')
        .attr('dy', '15px')
        .attr('x', '300')
        .text('Se Leonardo da Vinte');

    const fuelGauge = this.elementRef.nativeElement.querySelector('.right-bottom');
    const fuelSvg = select(fuelGauge).append('svg').attr('width', '225px').attr('height', '40px');
    const fuelG = fuelSvg.append('g');
    for(let i = 0; i < 8; i++){
      const color = i < this.fuel ? '#FFF' : '#999';
      fuelG.append('rect')
        .attr('width', 20)
        .attr('height', 5)
        .attr('x', 25*i)
        .attr('y', 25)
        .attr('fill', color);
    }
    const icon = fuelSvg.append('svg').attr('viewBox', '0 0 512 512')
      .attr('width', '20px')
      .attr('height', '20px')
      .attr('x', '180px')
      .attr('y', '0px')
      .attr('fill', '#FFF');
    icon.append('path')
      .attr('d', 'M304 96c0-8.837-7.163-16-16-16H128c-8.837 0-16 7.163-16 16v128c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16V96zm-32 112H144v-96h128v96z');

    icon.append('path')
      .attr('d', 'm487.538 113.453-63.809-32c-7.922-3.969-17.42-.742-21.373 7.156-3.953 7.906-.702 17.516 7.204 21.469l24.301 12.139c-.65 1.74-1.491 3.58-1.491 5.549 0 20.832 15.63 38.426 31.63 45.051v194.949c0 8.82-7.18 16-16 16s-16-7.18-16-16v-128c0-38.631-32-70.949-64-78.383V63.766C368 28.477 340.053 0 304.764 0h-192C77.475 0 48 28.477 48 63.766v358.109l-23.156 11.578A15.998 15.998 0 0 0 16 447.766v48C16 504.602 23.928 512 32.764 512h352C393.6 512 400 504.602 400 495.766v-48a15.998 15.998 0 0 0-8.844-14.313L368 421.875v-227.16c16 6.625 32 24.219 32 45.051v128c0 26.469 21.531 48 48 48s48-21.531 48-48v-240c0-6.063-3.04-11.602-8.462-14.313zM368 480H48v-22.344l23.156-11.578A15.998 15.998 0 0 0 80 431.765v-368C80 46.117 95.115 32 112.764 32h192C322.412 32 336 46.117 336 63.766v368a15.998 15.998 0 0 0 8.844 14.313L368 457.656V480z');
  }
}
