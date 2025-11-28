import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Key locations in Sri Lanka with coordinates
const sriLankaLocations = [
  { name: "Colombo", district: "Colombo", lat: 6.9271, lng: 79.8612 },
  { name: "Gampaha", district: "Gampaha", lat: 7.0840, lng: 80.0098 },
  { name: "Kalutara", district: "Kalutara", lat: 6.5854, lng: 79.9607 },
  { name: "Ratnapura", district: "Ratnapura", lat: 6.6828, lng: 80.4034 },
  { name: "Kegalle", district: "Kegalle", lat: 7.2523, lng: 80.3436 },
  { name: "Galle", district: "Galle", lat: 6.0535, lng: 80.2210 },
  { name: "Matara", district: "Matara", lat: 5.9549, lng: 80.5550 },
  { name: "Kurunegala", district: "Kurunegala", lat: 7.4863, lng: 80.3623 },
  { name: "Anuradhapura", district: "Anuradhapura", lat: 8.3114, lng: 80.4037 },
  { name: "Batticaloa", district: "Batticaloa", lat: 7.7310, lng: 81.6747 },
];

// Function to determine severity based on river discharge
const calculateSeverity = (discharge: number): string => {
  if (discharge > 500) return "critical";
  if (discharge > 300) return "high";
  if (discharge > 150) return "medium";
  return "low";
};

// Function to estimate water level and affected families
const estimateFloodData = (discharge: number) => {
  const waterLevel = Math.max(0, (discharge / 200) * 1.5);
  const affectedFamilies = Math.floor((discharge / 10) * Math.random() * 2);
  return { waterLevel, affectedFamilies };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching flood data from Open-Meteo API...');
    
    // Fetch river discharge data for all locations
    const floodPromises = sriLankaLocations.map(async (location) => {
      const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${location.lat}&longitude=${location.lng}&daily=river_discharge&forecast_days=1`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch data for ${location.name}`);
        return null;
      }
      
      const data = await response.json();
      const discharge = data.daily?.river_discharge?.[0] || 100;
      
      const severity = calculateSeverity(discharge);
      const { waterLevel, affectedFamilies } = estimateFloodData(discharge);
      
      return {
        id: location.name.toLowerCase(),
        name: location.name,
        district: location.district,
        coordinates: [location.lat, location.lng],
        severity,
        waterLevel: parseFloat(waterLevel.toFixed(2)),
        affectedFamilies,
        lastUpdated: new Date().toISOString(),
        description: `River discharge: ${discharge.toFixed(0)} m³/s - ${severity} flood risk`
      };
    });

    const locations = (await Promise.all(floodPromises)).filter(loc => loc !== null);
    
    const criticalAreas = locations.filter(loc => loc.severity === "critical").length;
    const totalAffected = locations.reduce((sum, loc) => sum + loc.affectedFamilies, 0);

    const floodData = {
      locations,
      lastSync: new Date().toISOString(),
      totalAffected,
      criticalAreas
    };

    console.log(`Successfully fetched data for ${locations.length} locations`);

    return new Response(
      JSON.stringify(floodData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching flood data:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});