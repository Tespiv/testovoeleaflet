export interface Region {
  id: number;
  parent: number | null;
  name: string;
  group_order: number;
  incident_address: string;
  description: string;
  coordinates: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface RegionDto {
  id: number;
  parent: number | null;
  name: string;
  description: string;
  group_order: number;
  incident_address: string;
  coordinates: string;
}
