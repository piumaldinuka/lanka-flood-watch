import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { FloodLocation } from "@/types/flood";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface FloodMapProps {
  locations: FloodLocation[];
}

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

// Component to handle map resize
const MapResizeHandler = () => {
  const map = useMap();
  
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    // Initial invalidate to ensure proper sizing
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  return null;
};

export const FloodMap = ({ locations }: FloodMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
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
    <div ref={containerRef} className="h-full w-full">
      <MapContainer
        center={center}
        zoom={7}
        className="h-full w-full rounded-lg"
        style={{ background: "hsl(var(--muted))" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => {
        // Validate each location before rendering
        if (!location || !location.id || !location.coordinates || !Array.isArray(location.coordinates)) {
          return null;
        }
        
        const [lat, lng] = location.coordinates;
        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return null;
        }
        
        return (
          <CircleMarker
            key={location.id}
            center={[lat, lng]}
            radius={getSeverityRadius(location.severity || 'low')}
            fillColor={getSeverityColor(location.severity || 'low')}
            fillOpacity={0.6}
            color={getSeverityColor(location.severity || 'low')}
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
      <MapResizeHandler />
    </MapContainer>
    </div>
  );
};
