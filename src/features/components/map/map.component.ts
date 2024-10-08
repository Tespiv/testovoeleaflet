import {
  Component,
  ComponentRef,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { RegionsApiService } from '../../services/region.sevice';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import 'leaflet.markercluster';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  providers: [RegionsApiService],
})
export class MapComponent implements OnInit {
  private map!: L.Map;

  constructor(
    private readonly regionsApiService: RegionsApiService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.loadRegions();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [56.049634924483286, 92.68719756407422],
      zoom: 5,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private loadRegions(): void {
    const markersCluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        const customIcon = L.divIcon({
          html: `<div >${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: L.point(35, 35),
        });
        return customIcon;
      },
    });
    const addedCoordinates = new Set<string>(); // Для отслеживания добавленных координат

    this.regionsApiService.getRegions().subscribe((regions) => {
      regions.forEach((region) => {
        const latitude = region.latitude;
        const longitude = region.longitude;

        const coordKey = `${latitude},${longitude}`;

        if (
          latitude != null &&
          longitude != null &&
          !isNaN(latitude) &&
          !isNaN(longitude) &&
          !addedCoordinates.has(coordKey) // Проверка на уникальность
        ) {
          addedCoordinates.add(coordKey);

          const customIcon = L.icon({
            iconUrl: 'assets/marker.png',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38],
          });

          const marker = L.marker([latitude, longitude], {
            icon: customIcon,
          }).bindPopup(this.createPopupContent(region));

          markersCluster.addLayer(marker);
        } else {
          console.error(
            'Недействительные или дублирующиеся координаты:',
            latitude,
            longitude
          );
        }
      });

      this.map.addLayer(markersCluster);
    });
  }

  private createPopupContent(region: any): HTMLElement {
    const popupDiv = document.createElement('div');

    // Динамическое создание компонента через ViewContainerRef
    const componentRef: ComponentRef<PopupComponent> =
      this.viewContainerRef.createComponent(PopupComponent);

    // Передача данных в компонент
    componentRef.instance.name = region.name;

    popupDiv.appendChild((componentRef.hostView as any).rootNodes[0]);

    return popupDiv;
  }
}
