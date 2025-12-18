import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Users, Droplet, MapPin, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface FloodStatsProps {
  totalLocations: number;
  totalAffected: number;
  criticalAreas: number;
  lastUpdated: string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export const FloodStats = ({
  totalLocations,
  totalAffected,
  criticalAreas,
  lastUpdated,
  dateRange,
  onDateRangeChange,
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
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    
    return date.toLocaleString("en-LK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-4">
      {/* Date Range Picker */}
      <Card className="shadow-md border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Data Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal text-xs sm:text-sm",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <span className="truncate">
                      {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                    </span>
                  ) : (
                    format(dateRange.from, "MMM d, yyyy")
                  )
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={1}
                disabled={(date) => date > new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-md">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="shadow-md border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base">Last Updated</CardTitle>
            <Droplet className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base sm:text-lg font-semibold text-primary">
            {formatTime(lastUpdated)}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
            Live monitoring • Auto-refresh enabled
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
