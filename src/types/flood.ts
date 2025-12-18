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

export interface HistoricalTrendPoint {
  date: string;
  totalAffected: number;
  critical: number;
  high: number;
}

export interface FloodData {
  locations: FloodLocation[];
  lastSync: string;
  totalAffected: number;
  criticalAreas: number;
  historicalTrend?: HistoricalTrendPoint[];
}
