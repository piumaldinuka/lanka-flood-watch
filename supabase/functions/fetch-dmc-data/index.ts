import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching data from DMC API...');
    
    // DMC API endpoint - https://www.dmc.gov.lk/
    // Note: You'll need to replace this with the actual DMC API endpoint
    const dmcApiUrl = 'https://www.dmc.gov.lk/api/flood-data'; // Replace with actual endpoint
    
    const response = await fetch(dmcApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`DMC API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched DMC data');

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching DMC data:', error);
    
    // Return mock data as fallback for now
    console.log('Returning mock data as fallback');
    const mockData = {
      locations: [
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
        }
      ],
      lastSync: new Date().toISOString(),
      totalAffected: 45,
      criticalAreas: 0
    };

    return new Response(
      JSON.stringify(mockData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
