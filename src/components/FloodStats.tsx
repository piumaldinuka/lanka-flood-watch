import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, Droplet, MapPin } from "lucide-react";

interface FloodStatsProps {
  totalLocations: number;
  totalAffected: number;
  criticalAreas: number;
  lastUpdated: string;
}

export const FloodStats = ({
  totalLocations,
  totalAffected,
  criticalAreas,
  lastUpdated,
}: FloodStatsProps) => {
  const stats = [
    {
      title: "Active Locations",
      value: totalLocations,
      icon: MapPin,
      color: "text-info",
    },
    {
      title: "Affected Families",
      value: totalAffected,
      icon: Users,
      color: "text-warning",
    },
    {
      title: "Critical Areas",
      value: criticalAreas,
      icon: AlertTriangle,
      color: "text-flood-critical",
    },
  ];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-LK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-10 h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Last Updated</CardTitle>
            <Droplet className="w-5 h-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {formatTime(lastUpdated)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Auto-refreshes every 30 minutes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
