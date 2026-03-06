import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LocationSelector } from "@/components/ui/location-selector";
import { 
  CloudSun, 
  MapPin, 
  TrendingUp,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Thermometer,
  RefreshCw,
  Loader2
} from "lucide-react";

const OWM_API_KEY = "78051f5076fcad307688c63cca247dce";

interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  visibility: number;
  pressure: number;
  condition: string;
  description: string;
  icon: string;
  location: string;
}

interface ForecastDay {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  description: string;
  rain: number;
  wind: number;
  humidity: number;
}

const getConditionIcon = (condition: string, size = "h-8 w-8") => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className={`${size} text-yellow-500`} />;
    case "rain":
    case "drizzle":
      return <CloudRain className={`${size} text-blue-500`} />;
    case "snow":
      return <CloudSnow className={`${size} text-cyan-400`} />;
    case "thunderstorm":
      return <CloudLightning className={`${size} text-purple-500`} />;
    case "clouds":
      return <Cloud className={`${size} text-gray-500`} />;
    default:
      return <CloudSun className={`${size} text-orange-400`} />;
  }
};

const getFarmCondition = (temp: number, humidity: number, wind: number, condition: string) => {
  const condLower = condition.toLowerCase();
  if (condLower.includes("thunder") || wind > 40) return { label: "Poor", color: "text-red-600", bg: "bg-red-50" };
  if (condLower.includes("rain") || condLower.includes("snow") || humidity > 90) return { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50" };
  if (temp > 10 && temp < 40 && humidity > 30 && humidity < 80) return { label: "Optimal for Growth", color: "text-green-600", bg: "bg-green-50" };
  return { label: "Good", color: "text-green-600", bg: "bg-green-50" };
};

const getMostCommon = (arr: string[]): string => {
  const counts: Record<string, number> = {};
  arr.forEach((v) => { counts[v] = (counts[v] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || arr[0];
};

const Weather = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useCurrentUser();
  const [location, setLocation] = useState(user?.location || "Chandigarh");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [alerts, setAlerts] = useState<{ title: string; description: string; severity: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  useEffect(() => {
    if (user?.location) {
      setLocation(user.location);
    }
  }, [user?.location]);

  const fetchWeatherData = async (city: string) => {
    if (!city) return;
    setLoading(true);
    try {
      const curRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OWM_API_KEY}`
      );
      if (!curRes.ok) throw new Error("Location not found");
      const cur = await curRes.json();

      setCurrentWeather({
        temp: Math.round(cur.main.temp),
        feelsLike: Math.round(cur.main.feels_like),
        humidity: cur.main.humidity,
        wind: Math.round(cur.wind.speed * 3.6),
        visibility: cur.visibility ? parseFloat((cur.visibility / 1000).toFixed(1)) : 10,
        pressure: cur.main.pressure,
        condition: cur.weather[0].main,
        description: cur.weather[0].description,
        icon: cur.weather[0].icon,
        location: `${cur.name}, ${cur.sys.country}`,
      });

      const foreRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OWM_API_KEY}`
      );
      const fore = await foreRes.json();

      const dailyMap = new Map<string, { temps: number[]; conditions: string[]; descriptions: string[]; rain: number; winds: number[]; humidities: number[] }>();
      for (const item of fore.list) {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { temps: [], conditions: [], descriptions: [], rain: 0, winds: [], humidities: [] });
        }
        const day = dailyMap.get(date)!;
        day.temps.push(item.main.temp);
        day.conditions.push(item.weather[0].main);
        day.descriptions.push(item.weather[0].description);
        day.rain += (item.rain?.["3h"] || 0);
        day.winds.push(item.wind.speed * 3.6);
        day.humidities.push(item.main.humidity);
      }

      const forecastDays: ForecastDay[] = [];
      let i = 0;
      for (const [date, data] of dailyMap) {
        const d = new Date(date);
        forecastDays.push({
          date,
          dayName: i === 0 ? "Today" : d.toLocaleDateString("en-IN", { weekday: "short" }),
          tempMax: Math.round(Math.max(...data.temps)),
          tempMin: Math.round(Math.min(...data.temps)),
          condition: getMostCommon(data.conditions),
          description: getMostCommon(data.descriptions),
          rain: Math.round(data.rain),
          wind: Math.round(data.winds.reduce((a, b) => a + b, 0) / data.winds.length),
          humidity: Math.round(data.humidities.reduce((a, b) => a + b, 0) / data.humidities.length),
        });
        i++;
      }
      setForecast(forecastDays);

      // Smart alerts from real data
      const smartAlerts: { title: string; description: string; severity: string }[] = [];
      for (const day of forecastDays.slice(0, 3)) {
        if (day.rain > 20) {
          smartAlerts.push({ title: `Heavy Rain Expected (${day.dayName})`, description: `${day.rain}mm rainfall expected. Consider postponing field operations.`, severity: "high" });
        } else if (day.rain > 5) {
          smartAlerts.push({ title: `Light Rain Expected (${day.dayName})`, description: `${day.rain}mm rainfall expected. Plan irrigation accordingly.`, severity: "medium" });
        }
        if (day.tempMax > 42) {
          smartAlerts.push({ title: `Heat Wave Alert (${day.dayName})`, description: `Temperature may reach ${day.tempMax}°C. Ensure adequate irrigation.`, severity: "high" });
        }
        if (day.wind > 30) {
          smartAlerts.push({ title: `Strong Winds (${day.dayName})`, description: `Wind speeds up to ${day.wind} km/h. Avoid spraying pesticides.`, severity: "medium" });
        }
      }
      if (smartAlerts.length === 0) {
        const lowWindDay = forecastDays.find(d => d.wind < 10 && d.rain === 0);
        if (lowWindDay) {
          smartAlerts.push({ title: `Optimal Spraying Conditions (${lowWindDay.dayName})`, description: `Low wind (${lowWindDay.wind} km/h), no rain — ideal for pesticide/fertilizer application.`, severity: "low" });
        }
      }
      setAlerts(smartAlerts);
    } catch (err) {
      console.error("Weather fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (location) fetchWeatherData(location);
  }, [location]);

  const handleLocationChange = (val: string) => {
    setLocation(val);
    setShowLocationPicker(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const farmCondition = currentWeather
    ? getFarmCondition(currentWeather.temp, currentWeather.humidity, currentWeather.wind, currentWeather.condition)
    : { label: "Loading...", color: "text-gray-500", bg: "bg-gray-50" };

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
          {/* Page Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Weather Station</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {currentWeather?.location || location} • Real-time weather monitoring
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowLocationPicker(!showLocationPicker)}>
                <MapPin className="h-4 w-4 mr-2" />
                Change Location
              </Button>
              <Button variant="outline" onClick={() => fetchWeatherData(location)} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {showLocationPicker && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Search for a city across India:</p>
                <div className="max-w-md">
                  <LocationSelector value={location} onChange={handleLocationChange} placeholder="Search city..." />
                </div>
              </CardContent>
            </Card>
          )}

          {loading && !currentWeather && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {currentWeather && (
            <>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getConditionIcon(currentWeather.condition, "h-5 w-5")}
                        Weather Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">{currentWeather.temp}°C</div>
                          <div className="text-xs text-muted-foreground capitalize">{currentWeather.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">Feels like {currentWeather.feelsLike}°C</div>
                        </div>
                        <div className={`text-center p-4 ${farmCondition.bg} rounded-lg`}>
                          <div className={`text-2xl font-bold ${farmCondition.color}`}>{farmCondition.label}</div>
                          <div className="text-sm text-muted-foreground">Farm Conditions</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Droplets className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-green-600">{currentWeather.humidity}%</div>
                          <div className="text-sm text-muted-foreground">Humidity</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <Wind className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                          <div className="text-2xl font-bold text-purple-600">{currentWeather.wind} km/h</div>
                          <div className="text-sm text-muted-foreground">Wind</div>
                        </div>
                      </div>
                      <h4 className="font-semibold mb-3">5-Day Forecast</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {forecast.slice(0, 5).map((day, idx) => (
                          <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium">{day.dayName}</div>
                            <div className="my-2 flex justify-center">{getConditionIcon(day.condition)}</div>
                            <div className="text-sm font-bold">{day.tempMax}°</div>
                            <div className="text-xs text-muted-foreground capitalize">{day.description}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-orange-500" />
                        Weather Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {alerts.map((alert, idx) => (
                        <div key={idx} className="space-y-2 p-3 rounded-lg border border-border">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">{alert.title}</h4>
                            <Badge variant={getSeverityColor(alert.severity) as "destructive" | "secondary" | "outline"}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{alert.description}</p>
                        </div>
                      ))}
                      {alerts.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No active weather alerts</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Detailed Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Detailed Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {forecast.map((day, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          index === 0 ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[80px]">
                            <div className="font-medium">{day.dayName}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(day.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                            </div>
                          </div>
                          {getConditionIcon(day.condition)}
                          <div className="text-center min-w-[100px]">
                            <div className="font-medium">{day.tempMax}° / {day.tempMin}°</div>
                            <div className="text-sm text-muted-foreground capitalize">{day.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span>{day.rain}mm</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="h-4 w-4 text-muted-foreground" />
                            <span>{day.wind} km/h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                            </div>
                            <span>{day.humidity}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Weather;