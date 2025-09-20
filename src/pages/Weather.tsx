import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { 
  CloudSun, 
  MapPin, 
  Calendar,
  TrendingUp,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Thermometer,
  Eye
} from "lucide-react";

const mockWeatherAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Heavy Rain Expected",
    description: "25-35mm rainfall expected tomorrow. Consider postponing field operations.",
    validUntil: "2024-09-19",
    severity: "medium"
  },
  {
    id: 2,
    type: "advisory",
    title: "Optimal Spraying Conditions",
    description: "Low wind speeds (2-5 km/h) ideal for pesticide application this evening.",
    validUntil: "2024-09-18",
    severity: "low"
  }
];

const mockForecast = [
  { date: "2024-09-18", temp: { min: 12, max: 24 }, condition: "sunny", rain: 0, wind: 8, humidity: 65 },
  { date: "2024-09-19", temp: { min: 15, max: 22 }, condition: "rainy", rain: 28, wind: 12, humidity: 85 },
  { date: "2024-09-20", temp: { min: 14, max: 20 }, condition: "cloudy", rain: 5, wind: 15, humidity: 78 },
  { date: "2024-09-21", temp: { min: 11, max: 23 }, condition: "sunny", rain: 0, wind: 6, humidity: 58 },
  { date: "2024-09-22", temp: { min: 13, max: 25 }, condition: "sunny", rain: 0, wind: 4, humidity: 52 },
  { date: "2024-09-23", temp: { min: 16, max: 27 }, condition: "cloudy", rain: 2, wind: 9, humidity: 68 },
  { date: "2024-09-24", temp: { min: 18, max: 26 }, condition: "sunny", rain: 0, wind: 7, humidity: 61 }
];

const conditionIcons = {
  sunny: Sun,
  cloudy: CloudSun,
  rainy: CloudRain,
};

const Weather = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Main Farm");

  const user = {
    name: "John Farmer",
    role: "farmer",
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
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
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Weather Station</h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {selectedLocation} • Real-time weather monitoring
              </p>
            </div>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Change Location
            </Button>
          </div>

          {/* Current Weather & Alerts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeatherWidget />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-harvest" />
                    Weather Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockWeatherAlerts.map((alert) => (
                    <div key={alert.id} className="space-y-2 p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Valid until {new Date(alert.validUntil).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  
                  {mockWeatherAlerts.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No active weather alerts</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 7-Day Detailed Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                7-Day Detailed Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockForecast.map((day, index) => {
                  const ConditionIcon = conditionIcons[day.condition as keyof typeof conditionIcons];
                  const isToday = index === 0;
                  
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        isToday ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[80px]">
                          <div className="font-medium">
                            {isToday ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        
                        <ConditionIcon className="h-8 w-8 text-harvest" />
                        
                        <div className="text-center min-w-[100px]">
                          <div className="font-medium">
                            {day.temp.max}° / {day.temp.min}°
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {day.condition}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4 text-water" />
                          <span>{day.rain}mm</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="h-4 w-4 text-muted-foreground" />
                          <span>{day.wind} km/h</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-water/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-water" />
                          </div>
                          <span>{day.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Historical Data */}
          <Card>
            <CardHeader>
              <CardTitle>Historical Weather Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CloudSun className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Historical Data</h3>
                <p className="text-muted-foreground">
                  Access detailed historical weather patterns and trends for better crop planning
                </p>
                <Button variant="outline" className="mt-4">
                  View Historical Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Weather;