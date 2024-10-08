import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../shared/environment/environment';
import { Region, RegionDto } from '../../shared/interfaces/region.interface';

const API_REGIONS = environment.baseUrl + '/api/regions/';

@Injectable()
export class RegionsApiService {
  private _regions$ = new BehaviorSubject<Region[]>([]);

  get regions$(): Observable<Region[]> {
    return this._regions$.asObservable();
  }

  constructor(private httpClient: HttpClient) {
    this.regions().subscribe((result) => {
      this._regions$.next(result);
    });
  }

  public getRegions(): Observable<Region[]> {
    return this._regions$.asObservable();
  }

  public regions(): Observable<Region[]> {
    return this.httpClient.get<RegionDto[]>(API_REGIONS).pipe(
      map((result) => {
        const regions = this.deserialize(result);
        this._regions$.next(regions);
        return regions;
      })
    );
  }

  private deserialize(dto: RegionDto[]): Region[] {
    return dto.map((item) => {
      const coords = item.coordinates.split(',').map((coord) => coord.trim());
      if (coords.length !== 2) {
        console.error('Недействительный формат координат:', item.coordinates);
        return { ...item, latitude: null, longitude: null };
      }

      const latitude = parseFloat(coords[0]);
      const longitude = parseFloat(coords[1]);

      return {
        id: item.id,
        parent: item.parent,
        name: item.name,
        description: item.description,
        group_order: item.group_order,
        incident_address: item.incident_address,
        coordinates: item.coordinates,
        latitude,
        longitude,
      };
    });
  }
}
