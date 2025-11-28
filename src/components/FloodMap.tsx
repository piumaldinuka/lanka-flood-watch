import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { FloodLocation } from "@/types/flood";
import "leaflet/dist/leaflet.css";

interface FloodMapProps {
  locations: FloodLocation[];
}

// Component to set map bounds based on locations
const MapBounds = ({ locations }: { locations: FloodLocation[] }) => {
  const map = useMap();

  useEffect(() => {
    if (locations && Array.isArray(locations) && locations.length > 0) {
      try {
        const bounds = locations
          .filter(loc => loc.coordinates && Array.isArray(loc.coordinates) && loc.coordinates.length === 2)
          .map(loc => loc.coordinates as [number, number]);
        
        if (bounds.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error('Error setting map bounds:', error);
      }
    }
  }, [locations, map]);

  return null;
};

const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "medium":
      return "#eab308";
    case "low":
      return "#3b82f6";
    default:
      return "#3b82f6";
  }
};

const getSeverityRadius = (severity: string): number => {
  switch (severity) {
    case "critical":
      return 25;
    case "high":
      return 20;
    case "medium":
      return 15;
    case "low":
      return 10;
    default:
      return 10;
  }
};

export const FloodMap = ({ locations }: FloodMapProps) => {
  // Center of Sri Lanka
  const center: [number, number] = [7.8731, 80.7718];

  // Safety check
  if (!locations || !Array.isArray(locations)) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">No location data available</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={8}
      className="h-full w-full rounded-lg"
      style={{ background: "hsl(var(--muted))" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds locations={locations} />
      {locations.map((location) => {
        // Validate each location before rendering
        if (!location || !location.id || !location.coordinates || !Array.isArray(location.coordinates)) {
          return null;
        }
        
        return (
          <CircleMarker
            key={location.id}
            center={location.coordinates as [number, number]}
            radius={getSeverityRadius(location.severity)}
            fillColor={getSeverityColor(location.severity)}
            fillOpacity={0.6}
            color={getSeverityColor(location.severity)}
            weight={2}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-foreground mb-1">{location.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{location.district} District</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Severity:</span>
                    <span
                      className="font-medium capitalize"
                      style={{ color: getSeverityColor(location.severity) }}
                    >
                      {location.severity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Water Level:</span>
                    <span className="font-medium text-foreground">{location.waterLevel}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Affected Families:</span>
                    <span className="font-medium text-foreground">{location.affectedFamilies}</span>
                  </div>
                </div>
                {location.description && (
                  <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                    {location.description}
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};
