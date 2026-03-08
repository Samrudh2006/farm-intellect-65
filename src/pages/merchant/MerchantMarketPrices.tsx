import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MandiPrice {
  crop: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  date?: string;
}

const MerchantMarketPrices = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const user = { name: "Merchant User", role: "merchant" };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("market-prices", {
        body: { state: "Punjab", district: "Ludhiana" },
      });
      if (error) throw error;
      setPrices(data?.prices || []);
    } catch (e) {
      toast({ title: "Could not fetch prices", description: "Using cached data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrices(); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} notificationCount={3} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole={user.role} />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gradient-saffron-navy">📈 Market Price Analytics</h1>
              <p className="text-muted-foreground text-lg mt-2">Live mandi prices for smart purchasing decisions</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPrices} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Prices
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : prices.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>No price data available. Try refreshing.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {prices.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.crop}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.market}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        ₹{item.modalPrice.toLocaleString("en-IN")}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.unit}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Min: ₹{item.minPrice.toLocaleString("en-IN")}</span>
                      <span className="text-muted-foreground">Max: ₹{item.maxPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Market Insights — dark-mode safe */}
          <Card>
            <CardHeader><CardTitle>Market Insights</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <h4 className="font-medium text-primary mb-2">📈 Rising Trends</h4>
                  <p className="text-muted-foreground">
                    Onion prices showing strong upward momentum due to reduced supply from key growing regions. Wheat maintaining steady growth with consistent demand.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                  <h4 className="font-medium text-destructive mb-2">📉 Declining Trends</h4>
                  <p className="text-muted-foreground">
                    Potato prices under pressure due to increased harvest from northern states. Monitor closely for potential buying opportunities.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                  <h4 className="font-medium text-accent-foreground mb-2">💡 Trading Recommendations</h4>
                  <p className="text-muted-foreground">
                    Consider increasing wheat and onion inventory. Wait for further price corrections in potato market. Cotton prices stable — good time for consistent procurement.
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
