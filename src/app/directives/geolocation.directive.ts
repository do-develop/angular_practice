import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appGeolocation]'
})
export class GeolocationDirective {
  @Input() latitude!: number;
  @Input() longitude!: number;

  constructor() { }
}
