import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { FloodData } from "@/types/flood";

interface FloodTrendChartProps {
  floodData: FloodData;
}

// Generate historical trend data based on current data
const generateHistoricalData = (currentTotal: number) => {
  const days = ['Dec 12', 'Dec 13', 'Dec 14', 'Dec 15', 'Dec 16', 'Dec 17', 'Dec 18'];
  const baseValues = [820, 950, 1100, 980, 1050, 1120, currentTotal];
  
  return days.map((day, index) => ({
    date: day,
    families: baseValues[index],
    critical: Math.floor(baseValues[index] * 0.15),
    high: Math.floor(baseValues[index] * 0.35),
  }));
};

export const FloodTrendChart = ({ floodData }: FloodTrendChartProps) => {
  const trendData = generateHistoricalData(floodData.totalAffected);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          <p className="text-sm text-warning">
            Affected Families: <span className="font-medium">{payload[0].value}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-flood-high">
              High Risk: <span className="font-medium">{payload[1].value}</span>
            </p>
          )}
          {payload[2] && (
            <p className="text-sm text-flood-critical">
              Critical: <span className="font-medium">{payload[2].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base font-medium">
            Affected Families Trend
          </CardTitle>
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          7-day historical data
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFamilies" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(45, 90%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(45, 90%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(25, 90%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(25, 90%, 55%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="families"
                stroke="hsl(45, 90%, 60%)"
                strokeWidth={2}
                fill="url(#colorFamilies)"
                dot={{ fill: 'hsl(45, 90%, 60%)', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: 'hsl(45, 90%, 60%)' }}
              />
              <Area
                type="monotone"
                dataKey="high"
                stroke="hsl(25, 90%, 55%)"
                strokeWidth={2}
                fill="url(#colorHigh)"
                dot={{ fill: 'hsl(25, 90%, 55%)', strokeWidth: 0, r: 2 }}
                activeDot={{ r: 4, fill: 'hsl(25, 90%, 55%)' }}
              />
              <Area
                type="monotone"
                dataKey="critical"
                stroke="hsl(0, 84%, 60%)"
                strokeWidth={2}
                fill="url(#colorCritical)"
                dot={{ fill: 'hsl(0, 84%, 60%)', strokeWidth: 0, r: 2 }}
                activeDot={{ r: 4, fill: 'hsl(0, 84%, 60%)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-3 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-muted-foreground">Total Affected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-flood-high" />
            <span className="text-muted-foreground">High Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-flood-critical" />
            <span className="text-muted-foreground">Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
