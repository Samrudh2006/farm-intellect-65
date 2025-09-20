import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon?: LucideIcon;
  className?: string;
  variant?: "default" | "primary" | "earth" | "water" | "harvest";
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/20 bg-primary/5",
  earth: "border-earth/20 bg-earth/5",
  water: "border-water/20 bg-water/5",
  harvest: "border-harvest/20 bg-harvest/5",
};

const iconStyles = {
  default: "text-muted-foreground",
  primary: "text-primary",
  earth: "text-earth",
  water: "text-water", 
  harvest: "text-harvest",
};

export const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  variant = "default"
}: StatCardProps) => {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className={cn("h-4 w-4", iconStyles[variant])} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={cn(
            "text-xs",
            change.trend === "up" && "text-primary",
            change.trend === "down" && "text-destructive",
            change.trend === "neutral" && "text-muted-foreground"
          )}>
            {change.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
};