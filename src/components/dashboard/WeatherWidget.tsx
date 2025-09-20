import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, CloudSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: "sunny" | "cloudy" | "rainy";
  forecast: Array<{
    day: string;
    temp: number;
    condition: "sunny" | "cloudy" | "rainy";
  }>;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
};

const mockWeatherData: WeatherData = {
  temperature: 24,
  humidity: 65,
  windSpeed: 8,
  condition: "sunny",
  forecast: [
    { day: "Today", temp: 24, condition: "sunny" },
    { day: "Tomorrow", temp: 22, condition: "cloudy" },
    { day: "Wed", temp: 19, condition: "rainy" },
    { day: "Thu", temp: 21, condition: "cloudy" },
    { day: "Fri", temp: 25, condition: "sunny" },
  ],
};

export const WeatherWidget = () => {
  const WeatherIcon = weatherIcons[mockWeatherData.condition];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-water" />
          Weather Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon className="h-8 w-8 text-harvest" />
            <div>
              <div className="text-2xl font-bold">{mockWeatherData.temperature}°C</div>
              <div className="text-sm text-muted-foreground capitalize">
                {mockWeatherData.condition}
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-water/10 text-water">
            Optimal for Growth
          </Badge>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <Droplets className="h-4 w-4 mx-auto mb-1 text-water" />
            <div className="text-sm font-medium">{mockWeatherData.humidity}%</div>
            <div className="text-xs text-muted-foreground">Humidity</div>
          </div>
          <div className="text-center">
            <Wind className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-medium">{mockWeatherData.windSpeed} km/h</div>
            <div className="text-xs text-muted-foreground">Wind</div>
          </div>
          <div className="text-center">
            <Thermometer className="h-4 w-4 mx-auto mb-1 text-destructive" />
            <div className="text-sm font-medium">Good</div>
            <div className="text-xs text-muted-foreground">Conditions</div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {mockWeatherData.forecast.map((day, index) => {
              const DayIcon = weatherIcons[day.condition];
              return (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                  <DayIcon className="h-4 w-4 mx-auto mb-1" />
                  <div className="text-xs font-medium">{day.temp}°</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};