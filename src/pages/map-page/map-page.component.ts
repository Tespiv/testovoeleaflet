import { Component } from '@angular/core';
import { MapComponent } from '../../features/components/map/map.component';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.scss',
})
export class MapPageComponent {}
