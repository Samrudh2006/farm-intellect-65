import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, ChevronDown, ChevronUp,
  Droplets, Thermometer, Bug, IndianRupee, Sparkles, Calendar
} from "lucide-react";

const insights = [
  {
    type: "alert" as const,
    icon: AlertTriangle,
    title: "Frost Warning — Wheat Field A",
    description: "Temperature dropping to 2°C tonight. Apply light irrigation to protect wheat at tillering stage.",
    priority: "high",
    category: "Weather",
    timeAgo: "Just now",
  },
  {
    type: "opportunity" as const,
    icon: TrendingUp,
    title: "Mustard prices rising +12%",
    description: "Mandi prices for mustard have been climbing for 5 consecutive days. Consider selling within 48 hours for peak returns.",
    priority: "medium",
    category: "Market",
    timeAgo: "2h ago",
  },
  {
    type: "recommendation" as const,
    icon: Droplets,
    title: "Reduce irrigation — Field B",
    description: "Soil moisture at 78% capacity. Skip tomorrow's irrigation cycle to save water and prevent waterlogging.",
    priority: "low",
    category: "Smart Irrigation",
    timeAgo: "4h ago",
  },
  {
    type: "alert" as const,
    icon: Bug,
    title: "Aphid risk detected — Chickpea",
    description: "Humidity and temperature conditions favour aphid infestation. Apply neem oil spray (5ml/L) as a preventive measure.",
    priority: "high",
    category: "Pest Alert",
    timeAgo: "6h ago",
  },
  {
    type: "opportunity" as const,
    icon: IndianRupee,
    title: "PM-KISAN instalment due",
    description: "Your next ₹2,000 instalment is expected this week. Verify your e-KYC status to avoid delays.",
    priority: "medium",
    category: "Schemes",
    timeAgo: "1d ago",
  },
];

const priorityColor = {
  high: "destructive" as const,
  medium: "secondary" as const,
  low: "outline" as const,
};

const typeColor = {
  alert: "text-destructive",
  opportunity: "text-accent",
  recommendation: "text-primary",
};

export const SmartInsights = () => {
  const [expanded, setExpanded] = useState(false);
  const visibleInsights = expanded ? insights : insights.slice(0, 3);

  return (
    <Card className="tricolor-card overflow-visible">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Brain className="h-5 w-5 text-accent" />
            </motion.div>
            AI Farm Insights
            <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] ml-1">
              <Sparkles className="h-3 w-3 mr-0.5" /> LIVE
            </Badge>
          </CardTitle>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Weekly Report
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <AnimatePresence mode="popLayout">
          {visibleInsights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors group cursor-default"
            >
              <div className={`mt-0.5 flex-shrink-0 ${typeColor[insight.type]}`}>
                <insight.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-foreground">{insight.title}</span>
                  <Badge variant={priorityColor[insight.priority]} className="text-[10px] px-1.5 py-0">
                    {insight.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {insight.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {insight.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{insight.timeAgo}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {insights.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <>Show less <ChevronUp className="h-3 w-3 ml-1" /></>
            ) : (
              <>Show {insights.length - 3} more insights <ChevronDown className="h-3 w-3 ml-1" /></>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
