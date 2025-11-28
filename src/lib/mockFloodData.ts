import { FloodData } from "@/types/flood";
import { supabase } from "@/integrations/supabase/client";

export const getFloodData = async (): Promise<FloodData> => {
  try {
    console.log('Fetching flood data from DMC API via edge function...');
    
    const { data, error } = await supabase.functions.invoke('fetch-dmc-data');

    if (error) {
      console.error('Error fetching from edge function:', error);
      throw error;
    }

    console.log('Successfully fetched data:', data);
    return data as FloodData;
  } catch (error) {
    console.error('Failed to fetch flood data:', error);
    throw error;
  }
};
