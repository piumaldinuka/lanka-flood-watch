import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FloodLegend = () => {
  const severityLevels = [
    { level: "Critical", color: "flood-critical", description: "Evacuation recommended" },
    { level: "High", color: "flood-high", description: "Severe flooding" },
    { level: "Medium", color: "flood-medium", description: "Moderate flooding" },
    { level: "Low", color: "flood-low", description: "Minor flooding" },
  ] as const;

  const colorClass = {
    "flood-critical": "bg-flood-critical",
    "flood-high": "bg-flood-high",
    "flood-medium": "bg-flood-medium",
    "flood-low": "bg-flood-low",
  } as const;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Flood Severity Levels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {severityLevels.map((item) => (
          <div key={item.level} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${colorClass[item.color]}`} />
            <div className="flex-1">
              <div className="font-medium text-sm">{item.level}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

