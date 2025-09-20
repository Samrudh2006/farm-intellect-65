import { Brain, Droplets, Bug, Zap, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
  id: string;
  type: "irrigation" | "fertilizer" | "pest" | "planting";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  dueDate?: string;
  confidence: number;
}

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    type: "irrigation",
    priority: "high",
    title: "Increase Irrigation",
    description: "Soil moisture levels are below optimal for wheat growth. Recommend increasing irrigation by 15%.",
    action: "Apply 2.5L per square meter",
    dueDate: "Next 2 days",
    confidence: 92
  },
  {
    id: "2", 
    type: "fertilizer",
    priority: "medium",
    title: "Nitrogen Boost",
    description: "Corn crops would benefit from additional nitrogen during vegetative stage.",
    action: "Apply 45kg N/hectare",
    dueDate: "Within 1 week",
    confidence: 87
  },
  {
    id: "3",
    type: "pest",
    priority: "high", 
    title: "Monitor for Aphids",
    description: "Weather conditions favor aphid development. Implement preventive measures.",
    action: "Scout fields daily",
    dueDate: "Immediate",
    confidence: 78
  }
];

const typeIcons = {
  irrigation: Droplets,
  fertilizer: Zap,
  pest: Bug,
  planting: Calendar,
};

const typeColors = {
  irrigation: "text-water",
  fertilizer: "text-harvest",
  pest: "text-destructive",
  planting: "text-primary",
};

const priorityColors = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

export const AIRecommendations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecommendations.map((rec) => {
          const TypeIcon = typeIcons[rec.type];
          
          return (
            <div key={rec.id} className="space-y-3 p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <TypeIcon className={`h-5 w-5 ${typeColors[rec.type]}`} />
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={priorityColors[rec.priority] as any}>
                    {rec.priority} priority
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {rec.confidence}% confidence
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <div className="font-medium text-sm">{rec.action}</div>
                  {rec.dueDate && (
                    <div className="text-xs text-muted-foreground">Due: {rec.dueDate}</div>
                  )}
                </div>
                <Button size="sm" variant={rec.priority === "high" ? "default" : "outline"}>
                  Apply
                </Button>
              </div>
            </div>
          );
        })}
        
        <Button variant="outline" className="w-full">
          View All Recommendations
        </Button>
      </CardContent>
    </Card>
  );
};