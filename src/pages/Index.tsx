import { useQuery } from "@tanstack/react-query";
import { FloodMap } from "@/components/FloodMap";
import { FloodLegend } from "@/components/FloodLegend";
import { FloodStats } from "@/components/FloodStats";
import { getFloodData } from "@/lib/mockFloodData";
import { Waves, Activity, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [isLive, setIsLive] = useState(true);
  
  const { data, isLoading, isError, dataUpdatedAt, isFetching } = useQuery({
    queryKey: ["floodData"],
    queryFn: async () => await getFloodData(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes for more real-time feel
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (dataUpdatedAt && dataUpdatedAt > 0) {
      toast.success("Flood data updated", {
        description: "Latest information from Disaster Management Center",
        duration: 2000,
      });
    }
  }, [dataUpdatedAt]);
  
  // Simulate live indicator pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Waves className="w-16 h-16 text-primary mx-auto animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading flood data...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">Error loading flood data</p>
          <p className="text-sm text-muted-foreground">
            Please check your connection and try again
          </p>
        </div>
      </div>
    );
  }

  // Additional safety check for data structure
  if (!data.locations || !Array.isArray(data.locations) || data.locations.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Waves className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-lg text-foreground">No flood data available</p>
          <p className="text-sm text-muted-foreground">
            Data from Disaster Management Center is currently unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Waves className="w-8 h-8 text-primary animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    Real-time Flood Map
                  </h1>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 border-green-500 text-green-500"
                  >
                    <Activity 
                      className={`w-3 h-3 ${isLive ? 'text-green-500' : 'text-green-300'}`} 
                    />
                    <span className="text-xs">LIVE</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  Sri Lanka Disaster Management Center 🇱🇰
                  {isFetching && (
                    <span className="flex items-center gap-1 text-primary">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span className="text-xs">Updating...</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Stats and Legend */}
          <aside className="lg:col-span-1 space-y-6">
            <FloodStats
              totalLocations={data.locations.length}
              totalAffected={data.totalAffected}
              criticalAreas={data.criticalAreas}
              lastUpdated={data.lastSync}
            />
            <FloodLegend />
          </aside>

          {/* Main Map Area */}
          <section className="lg:col-span-3">
            <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden shadow-lg border border-border">
              <FloodMap locations={data.locations} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4 bg-card">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-1">
            <Activity className="w-4 h-4 text-green-500" />
            <span>Data updates automatically every 5 minutes</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Official data from Disaster Management Centre of Sri Lanka
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
