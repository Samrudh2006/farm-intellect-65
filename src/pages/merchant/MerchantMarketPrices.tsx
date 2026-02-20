import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MerchantMarketPrices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: "Merchant User",
    role: "merchant",
  };

  const marketPrices = [
    {
      crop: "Wheat",
      currentPrice: "₹2,150",
      previousPrice: "₹2,100",
      change: "+2.4%",
      trend: "up",
      unit: "per quintal",
      market: "Ludhiana Mandi"
    },
    {
      crop: "Rice (Basmati)",
      currentPrice: "₹3,800",
      previousPrice: "₹3,850",
      change: "-1.3%",
      trend: "down",
      unit: "per quintal",
      market: "Amritsar Mandi"
    },
    {
      crop: "Cotton",
      currentPrice: "₹6,200",
      previousPrice: "₹6,200",
      change: "0.0%",
      trend: "stable",
      unit: "per quintal",
      market: "Bathinda Mandi"
    },
    {
      crop: "Sugarcane",
      currentPrice: "₹380",
      previousPrice: "₹375",
      change: "+1.3%",
      trend: "up",
      unit: "per quintal",
      market: "Jalandhar Mandi"
    },
    {
      crop: "Potato",
      currentPrice: "₹1,850",
      previousPrice: "₹1,920",
      change: "-3.6%",
      trend: "down",
      unit: "per quintal",
      market: "Chandigarh Mandi"
    },
    {
      crop: "Onion",
      currentPrice: "₹2,200",
      previousPrice: "₹2,050",
      change: "+7.3%",
      trend: "up",
      unit: "per quintal",
      market: "Patiala Mandi"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={3}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
      />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-saffron-navy">
                📈 Market Price Analytics
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Real-time crop prices for smart purchasing decisions
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Prices
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {marketPrices.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.crop}</CardTitle>
                    {getTrendIcon(item.trend)}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.market}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {item.currentPrice}
                    </div>
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Previous: {item.previousPrice}
                    </span>
                    <Badge 
                      variant={item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {item.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">📈 Rising Trends</h4>
                  <p className="text-green-700">
                    Onion prices showing strong upward momentum (+7.3%) due to reduced supply from key growing regions.
                    Wheat maintaining steady growth with consistent demand.
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">📉 Declining Trends</h4>
                  <p className="text-red-700">
                    Potato prices under pressure (-3.6%) due to increased harvest from northern states.
                    Monitor closely for potential buying opportunities.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Trading Recommendations</h4>
                  <p className="text-blue-700">
                    Consider increasing wheat and onion inventory. Wait for further price corrections in potato market.
                    Cotton prices stable - good time for consistent procurement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MerchantMarketPrices;