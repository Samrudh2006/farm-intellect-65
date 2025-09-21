import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, Sun, CloudRain, TrendingUp, TrendingDown, RefreshCw, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const WeatherMarketAPI = () => {
  const { toast } = useToast();
  const [weather, setWeather] = useState<any>(null);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [location, setLocation] = useState("Chandigarh, Punjab");
  const [loading, setLoading] = useState(false);

  // Mock weather data (replace with actual API call)
  const fetchWeather = async () => {
    setLoading(true);
    
    // Mock API response
    setTimeout(() => {
      const mockWeather = {
        location: location,
        temperature: 28,
        condition: "Partly Cloudy",
        humidity: 65,
        windSpeed: 12,
        forecast: [
          { day: "Today", temp: "28°C", condition: "Cloudy", icon: "cloud" },
          { day: "Tomorrow", temp: "30°C", condition: "Sunny", icon: "sun" },
          { day: "Day 3", temp: "26°C", condition: "Rain", icon: "rain" },
          { day: "Day 4", temp: "29°C", condition: "Sunny", icon: "sun" },
          { day: "Day 5", temp: "27°C", condition: "Cloudy", icon: "cloud" }
        ]
      };
      setWeather(mockWeather);
      setLoading(false);
    }, 1500);
  };

  // Mock market prices data (replace with actual Agmarknet API)
  const fetchMarketPrices = async () => {
    const mockPrices = [
      { 
        crop: "Wheat (गेहूं)", 
        price: 2500, 
        change: +50, 
        market: "Chandigarh Mandi",
        unit: "per quintal"
      },
      { 
        crop: "Rice (धान)", 
        price: 2800, 
        change: -30, 
        market: "Ludhiana Mandi",
        unit: "per quintal"
      },
      { 
        crop: "Cotton (कपास)", 
        price: 6200, 
        change: +120, 
        market: "Bathinda Mandi",
        unit: "per quintal"
      },
      { 
        crop: "Mustard (सरसों)", 
        price: 6800, 
        change: +80, 
        market: "Patiala Mandi",
        unit: "per quintal"
      },
      { 
        crop: "Sugarcane (गन्ना)", 
        price: 380, 
        change: +5, 
        market: "Jalandhar Mandi",
        unit: "per quintal"
      }
    ];
    setMarketPrices(mockPrices);
  };

  useEffect(() => {
    fetchWeather();
    fetchMarketPrices();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sun':
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const refreshData = () => {
    fetchWeather();
    fetchMarketPrices();
    toast({
      title: "Data Refreshed",
      description: "Weather and market data has been updated"
    });
  };

  return (
    <div className="space-y-6">
      {/* Location and Refresh */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Weather & Market Data
            </div>
            <Button onClick={refreshData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={fetchWeather} disabled={loading}>
              {loading ? "Loading..." : "Update"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weather Section */}
      {weather && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Current Weather - {weather.location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{weather.temperature}°C</div>
                <div className="text-sm text-muted-foreground">{weather.condition}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{weather.humidity}%</div>
                <div className="text-sm text-muted-foreground">Humidity</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{weather.windSpeed} km/h</div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">Good</div>
                <div className="text-sm text-muted-foreground">Farm Conditions</div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div>
              <h4 className="font-semibold mb-3">5-Day Forecast</h4>
              <div className="grid grid-cols-5 gap-2">
                {weather.forecast.map((day: any, index: number) => (
                  <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="my-2 flex justify-center">
                      {getWeatherIcon(day.icon)}
                    </div>
                    <div className="text-sm">{day.temp}</div>
                    <div className="text-xs text-muted-foreground">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Prices Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Live Mandi Prices (Today)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marketPrices.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">{item.crop}</div>
                  <div className="text-sm text-muted-foreground">{item.market}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{item.price}</div>
                  <div className="text-sm text-muted-foreground">{item.unit}</div>
                </div>
                <div className={`flex items-center gap-1 ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {item.change >= 0 ? '+' : ''}₹{item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> Prices updated every hour from government mandis. 
              Best selling time is usually morning hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};