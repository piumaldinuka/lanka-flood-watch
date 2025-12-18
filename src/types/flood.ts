export type FloodSeverity = "low" | "medium" | "high" | "critical";

export interface FloodLocation {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number]; // [lat, lng]
  severity: FloodSeverity;
  waterLevel: number; // in meters
  affectedFamilies: number;
  lastUpdated: string;
  description?: string;
}

export interface FloodData {
  locations: FloodLocation[];
  lastSync: string;
  totalAffected: number;
  criticalAreas: number;
}
