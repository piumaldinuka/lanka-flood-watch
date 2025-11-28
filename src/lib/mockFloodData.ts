import { FloodData } from "@/types/flood";
import { supabase } from "@/integrations/supabase/client";

export const getFloodData = async (): Promise<FloodData> => {
  try {
    console.log('Fetching flood data from DMC API via edge function...');
    
    const { data, error } = await supabase.functions.invoke('fetch-dmc-data');

    if (error) {
      console.error('Error fetching from edge function:', error);
      throw new Error(`Edge function error: ${error.message}`);
    }

    // Check if data has an error property (error response from edge function)
    if (data && typeof data === 'object' && 'error' in data) {
      console.error('Edge function returned error:', data.error);
      throw new Error(`DMC API error: ${data.error}`);
    }

    // Validate data structure
    if (!data || !data.locations || !Array.isArray(data.locations)) {
      console.error('Invalid data structure received:', data);
      throw new Error('Invalid data format received from server');
    }

    console.log('Successfully fetched data:', data);
    return data as FloodData;
  } catch (error) {
    console.error('Failed to fetch flood data:', error);
    throw error;
  }
};
