import { useQuery } from "@tanstack/react-query";
import { FloodMap } from "@/components/FloodMap";
import { FloodLegend } from "@/components/FloodLegend";
import { FloodStats } from "@/components/FloodStats";
import { getFloodData } from "@/lib/mockFloodData";
import { Waves } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["floodData"],
    queryFn: getFloodData,
    refetchInterval: 30 * 60 * 1000, // 30 minutes
    staleTime: 29 * 60 * 1000, // Consider data stale after 29 minutes
  });

  useEffect(() => {
    if (dataUpdatedAt) {
      toast.success("Flood data updated", {
        description: "Latest information from Disaster Management Center",
      });
    }
  }, [dataUpdatedAt]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Waves className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sri Lanka Flood Monitoring System
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time data from Disaster Management Center 🇱🇰
              </p>
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
      <footer className="border-t border-border mt-8 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Data provided by Disaster Management Center of Sri Lanka | Updated
            every 30 minutes
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
