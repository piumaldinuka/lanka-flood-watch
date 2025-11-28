import { FloodData, FloodLocation } from "@/types/flood";

// Mock data - In production, this would come from the Disaster Management Center API
export const mockFloodLocations: FloodLocation[] = [
  {
    id: "1",
    name: "Colombo",
    district: "Colombo",
    coordinates: [6.9271, 79.8612],
    severity: "medium",
    waterLevel: 1.2,
    affectedFamilies: 45,
    lastUpdated: new Date().toISOString(),
    description: "Flooding in low-lying areas near Kelani River"
  },
  {
    id: "2",
    name: "Gampaha",
    district: "Gampaha",
    coordinates: [7.0840, 80.0098],
    severity: "high",
    waterLevel: 2.1,
    affectedFamilies: 120,
    lastUpdated: new Date().toISOString(),
    description: "Severe flooding affecting multiple neighborhoods"
  },
  {
    id: "3",
    name: "Kalutara",
    district: "Kalutara",
    coordinates: [6.5854, 79.9607],
    severity: "critical",
    waterLevel: 3.5,
    affectedFamilies: 250,
    lastUpdated: new Date().toISOString(),
    description: "Critical flooding - evacuation recommended"
  },
  {
    id: "4",
    name: "Ratnapura",
    district: "Ratnapura",
    coordinates: [6.6828, 80.4034],
    severity: "high",
    waterLevel: 2.8,
    affectedFamilies: 180,
    lastUpdated: new Date().toISOString(),
    description: "Heavy rainfall causing rapid water level rise"
  },
  {
    id: "5",
    name: "Kegalle",
    district: "Kegalle",
    coordinates: [7.2523, 80.3436],
    severity: "medium",
    waterLevel: 1.5,
    affectedFamilies: 65,
    lastUpdated: new Date().toISOString(),
    description: "Moderate flooding in agricultural areas"
  },
  {
    id: "6",
    name: "Galle",
    district: "Galle",
    coordinates: [6.0535, 80.2210],
    severity: "low",
    waterLevel: 0.8,
    affectedFamilies: 20,
    lastUpdated: new Date().toISOString(),
    description: "Minor flooding in coastal areas"
  },
  {
    id: "7",
    name: "Matara",
    district: "Matara",
    coordinates: [5.9549, 80.5550],
    severity: "medium",
    waterLevel: 1.4,
    affectedFamilies: 55,
    lastUpdated: new Date().toISOString(),
    description: "Flooding affecting southern coastal regions"
  },
  {
    id: "8",
    name: "Kurunegala",
    district: "Kurunegala",
    coordinates: [7.4863, 80.3623],
    severity: "low",
    waterLevel: 0.6,
    affectedFamilies: 15,
    lastUpdated: new Date().toISOString(),
    description: "Light flooding in rural areas"
  },
  {
    id: "9",
    name: "Anuradhapura",
    district: "Anuradhapura",
    coordinates: [8.3114, 80.4037],
    severity: "medium",
    waterLevel: 1.3,
    affectedFamilies: 70,
    lastUpdated: new Date().toISOString(),
    description: "Tank overflow causing localized flooding"
  },
  {
    id: "10",
    name: "Batticaloa",
    district: "Batticaloa",
    coordinates: [7.7310, 81.6747],
    severity: "high",
    waterLevel: 2.3,
    affectedFamilies: 140,
    lastUpdated: new Date().toISOString(),
    description: "Significant flooding in eastern coastal areas"
  }
];

export const getFloodData = (): FloodData => {
  const criticalAreas = mockFloodLocations.filter(loc => loc.severity === "critical").length;
  const totalAffected = mockFloodLocations.reduce((sum, loc) => sum + loc.affectedFamilies, 0);

  return {
    locations: mockFloodLocations,
    lastSync: new Date().toISOString(),
    totalAffected,
    criticalAreas
  };
};
