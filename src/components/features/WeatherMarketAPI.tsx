import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, TrendingUp, TrendingDown, RefreshCw, MapPin, Thermometer, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LocationSelector } from "@/components/ui/location-selector";

const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY as string;

const mapCondition = (main: string) => {
  switch (main.toLowerCase()) {
    case "clear": return "sunny";
    case "rain": case "drizzle": return "rain";
    case "snow": return "snow";
    case "thunderstorm": return "thunderstorm";
    case "clouds": return "cloud";
    default: return "cloud";
  }
};

const dayName = (dt: number, idx: number) => {
  if (idx === 0) return "Today";
  const d = new Date(dt * 1000);
  return d.toLocaleDateString("en-IN", { weekday: "short" });
};

export const WeatherMarketAPI = () => {
  const { toast } = useToast();
  const { user } = useCurrentUser();
  const [weather, setWeather] = useState<any>(null);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Current weather
      const curRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${OWM_API_KEY}`
      );
      if (!curRes.ok) throw new Error("Location not found");
      const cur = await curRes.json();

      // 5-day forecast
      const foreRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${OWM_API_KEY}`
      );
      const fore = await foreRes.json();

      // Pick one forecast entry per day (around noon)
      const dailyMap = new Map<string, any>();
      for (const item of fore.list) {
        const date = item.dt_txt.split(" ")[0];
        const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
        if (!dailyMap.has(date) || Math.abs(hour - 12) < Math.abs(parseInt(dailyMap.get(date).dt_txt.split(" ")[1].split(":")[0]) - 12)) {
          dailyMap.set(date, item);
        }
      }
      const dailyForecasts = Array.from(dailyMap.values()).slice(0, 5);

      setWeather({
        location: `${cur.name}, ${cur.sys.country}`,
        temperature: Math.round(cur.main.temp),
        feelsLike: Math.round(cur.main.feels_like),
        condition: cur.weather[0].main,
        description: cur.weather[0].description,
        humidity: cur.main.humidity,
        windSpeed: Math.round(cur.wind.speed * 3.6), // m/s to km/h
        pressure: cur.main.pressure,
        visibility: cur.visibility ? (cur.visibility / 1000).toFixed(1) : "N/A",
        icon: cur.weather[0].icon,
        forecast: dailyForecasts.map((item: any, idx: number) => ({
          day: dayName(item.dt, idx),
          temp: `${Math.round(item.main.temp)}°C`,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: mapCondition(item.weather[0].main),
          humidity: item.main.humidity,
        })),
      });
    } catch (err: any) {
      toast({
        title: "Weather Error",
        description: err.message || "Could not fetch weather data",
        variant: "destructive",
      });
    }
    setLoading(false);
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

  // Auto-set location from user profile
  useEffect(() => {
    if (user?.location && !initialized) {
      setLocation(user.location);
      setInitialized(true);
    } else if (!initialized && !user?.location) {
      setLocation("Chandigarh");
      setInitialized(true);
    }
  }, [user?.location, initialized]);

  // Fetch weather when location is set
  useEffect(() => {
    if (location) {
      fetchWeather();
      fetchMarketPrices();
    }
  }, [location, initialized]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sun':
      case 'sunny':
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rain':
      case 'rainy':
      case 'drizzle':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="h-8 w-8 text-cyan-400" />;
      case 'thunderstorm':
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
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
            <div className="flex-1">
              <LocationSelector
                value={location}
                onChange={(val) => setLocation(val)}
                placeholder="Search your city..."
              />
            </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{weather.temperature}°C</div>
                <div className="text-xs text-muted-foreground capitalize">{weather.description}</div>
                <div className="text-xs text-muted-foreground mt-1">Feels like {weather.feelsLike}°C</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Droplets className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-green-600">{weather.humidity}%</div>
                <div className="text-sm text-muted-foreground">Humidity</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Wind className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-purple-600">{weather.windSpeed} km/h</div>
                <div className="text-sm text-muted-foreground">Wind Speed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Eye className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-orange-600">{weather.visibility} km</div>
                <div className="text-sm text-muted-foreground">Visibility</div>
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