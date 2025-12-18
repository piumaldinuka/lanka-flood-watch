import { useQuery } from "@tanstack/react-query";
import { FloodMap } from "@/components/FloodMap";
import { FloodLegend } from "@/components/FloodLegend";
import { FloodStats } from "@/components/FloodStats";
import { FloodRiskAnalyzer } from "@/components/FloodRiskAnalyzer";
import { getFloodData } from "@/lib/mockFloodData";
import { Waves, Activity, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const Index = () => {
  const [isLive, setIsLive] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 11, 17), // Dec 17, 2025
    to: new Date(2025, 11, 18),   // Dec 18, 2025
  });
  
  const { data, isLoading, isError, dataUpdatedAt, isFetching, refetch } = useQuery({
    queryKey: ["floodData", dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      const startDate = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined;
      const endDate = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : startDate;
      return await getFloodData(startDate, endDate);
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
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
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Waves className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                    Real-time Flood Map
                  </h1>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 border-green-500 text-green-500 flex-shrink-0"
                  >
                    <Activity 
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${isLive ? 'text-green-500' : 'text-green-300'}`} 
                    />
                    <span className="text-[10px] sm:text-xs">LIVE</span>
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="truncate">Sri Lanka DMC 🇱🇰</span>
                  {isFetching && (
                    <span className="flex items-center gap-1 text-primary flex-shrink-0">
                      <RefreshCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
                      <span className="text-[10px] sm:text-xs">Updating...</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Stats and Legend - Stack on mobile, sidebar on desktop */}
          <aside className="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
            <FloodStats
              totalLocations={data.locations.length}
              totalAffected={data.totalAffected}
              criticalAreas={data.criticalAreas}
              lastUpdated={data.lastSync}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
              <FloodLegend />
              <FloodRiskAnalyzer floodData={data} />
            </div>
          </aside>

          {/* Main Map Area - Full width on mobile, show first */}
          <section className="lg:col-span-3 order-1 lg:order-2">
            <div className="h-[50vh] sm:h-[60vh] lg:h-[calc(100vh-200px)] min-h-[300px] rounded-lg overflow-hidden shadow-lg border border-border">
              <FloodMap locations={data.locations} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-6 sm:mt-8 py-3 sm:py-4 bg-card">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
            <span>Data updates every 5 minutes</span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Official data from Disaster Management Centre of Sri Lanka
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
