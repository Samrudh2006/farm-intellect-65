import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Map,
  Layers,
  Satellite,
  Navigation,
  Zap,
  Droplets,
  Thermometer,
  Activity,
  Plus,
  Settings
} from "lucide-react";

const mockFields = [
  {
    id: 1,
    name: "Field A",
    area: "12.5 hectares",
    crop: "Winter Wheat",
    coordinates: [
      { lat: 40.7128, lng: -74.0060 },
      { lat: 40.7130, lng: -74.0058 },
      { lat: 40.7135, lng: -74.0055 },
      { lat: 40.7133, lng: -74.0062 }
    ],
    sensors: [
      { type: "soil_moisture", value: 42, status: "optimal" },
      { type: "temperature", value: 24.5, status: "optimal" }
    ],
    health: 85,
    lastUpdated: "2024-09-18T14:30:00Z"
  },
  {
    id: 2,
    name: "Field B", 
    area: "8.2 hectares",
    crop: "Corn",
    coordinates: [
      { lat: 40.7125, lng: -74.0065 },
      { lat: 40.7127, lng: -74.0063 },
      { lat: 40.7130, lng: -74.0068 },
      { lat: 40.7128, lng: -74.0070 }
    ],
    sensors: [
      { type: "ph", value: 6.8, status: "warning" },
      { type: "soil_moisture", value: 28, status: "low" }
    ],
    health: 67,
    lastUpdated: "2024-09-18T13:15:00Z"
  },
  {
    id: 3,
    name: "Field C",
    area: "6.8 hectares", 
    crop: "Soybeans",
    coordinates: [
      { lat: 40.7135, lng: -74.0055 },
      { lat: 40.7137, lng: -74.0052 },
      { lat: 40.7140, lng: -74.0058 },
      { lat: 40.7138, lng: -74.0060 }
    ],
    sensors: [
      { type: "npk", value: 185, status: "optimal" }
    ],
    health: 92,
    lastUpdated: "2024-09-18T14:25:00Z"
  }
];

const sensorIcons = {
  soil_moisture: Droplets,
  temperature: Thermometer,
  ph: Activity,
  npk: Zap,
};

const sensorColors = {
  soil_moisture: "text-water",
  temperature: "text-harvest", 
  ph: "text-primary",
  npk: "text-earth",
};

const statusColors = {
  optimal: "default",
  warning: "secondary",
  low: "destructive",
  high: "destructive",
};

const FieldMap = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [mapView, setMapView] = useState<"satellite" | "terrain">("satellite");

  const user = {
    name: "John Farmer",
    role: "farmer",
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-primary";
    if (health >= 60) return "text-harvest";
    return "text-destructive";
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
              <h2 className="text-3xl font-bold text-foreground">Field Map</h2>
              <p className="text-muted-foreground">
                Interactive field mapping and sensor data visualization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={mapView === "satellite" ? "default" : "outline"}
                size="sm"
                onClick={() => setMapView("satellite")}
              >
                <Satellite className="h-4 w-4 mr-1" />
                Satellite
              </Button>
              <Button 
                variant={mapView === "terrain" ? "default" : "outline"}
                size="sm"
                onClick={() => setMapView("terrain")}
              >
                <Layers className="h-4 w-4 mr-1" />
                Terrain
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Map and Field Details */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Interactive Map Placeholder */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-primary" />
                    Interactive Field Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <div className="relative w-full h-full bg-earth/10 rounded-lg border-2 border-dashed border-earth/30 flex flex-col items-center justify-center">
                    <Map className="h-16 w-16 text-earth/40 mb-4" />
                    <h3 className="text-lg font-medium text-earth/60 mb-2">Interactive Map</h3>
                    <p className="text-sm text-earth/50 text-center max-w-md">
                      Integration with mapping services (Google Maps, Mapbox) would display your fields, 
                      sensor locations, and real-time data overlays here.
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                      {mockFields.map((field) => (
                        <Button
                          key={field.id}
                          variant={selectedField === field.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedField(field.id)}
                          className="h-auto p-3"
                        >
                          <div>
                            <div className="font-medium">{field.name}</div>
                            <div className="text-xs opacity-70">{field.crop}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Field Details Sidebar */}
            <div className="space-y-6">
              {/* Field Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    Field Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockFields.map((field) => (
                    <Button
                      key={field.id}
                      variant={selectedField === field.id ? "default" : "outline"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setSelectedField(field.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{field.name}</div>
                        <div className="text-sm opacity-70">{field.crop} • {field.area}</div>
                      </div>
                    </Button>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Field
                  </Button>
                </CardContent>
              </Card>

              {/* Selected Field Details */}
              {selectedField && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {mockFields.find(f => f.id === selectedField)?.name} Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const field = mockFields.find(f => f.id === selectedField);
                      if (!field) return null;
                      
                      return (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Crop</span>
                              <span className="font-medium">{field.crop}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Area</span>
                              <span className="font-medium">{field.area}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Health Score</span>
                              <span className={`font-medium ${getHealthColor(field.health)}`}>
                                {field.health}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Active Sensors</h4>
                            {field.sensors.map((sensor, index) => {
                              const SensorIcon = sensorIcons[sensor.type as keyof typeof sensorIcons];
                              return (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                                  <div className="flex items-center gap-2">
                                    <SensorIcon className={`h-4 w-4 ${sensorColors[sensor.type as keyof typeof sensorColors]}`} />
                                    <span className="text-sm capitalize">
                                      {sensor.type.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{sensor.value}</span>
                                    <Badge variant={statusColors[sensor.status as keyof typeof statusColors] as any} className="text-xs">
                                      {sensor.status}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Last updated: {new Date(field.lastUpdated).toLocaleString()}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1">
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sensor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="h-4 w-4 mr-2" />
                    Field Boundaries
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Navigation className="h-4 w-4 mr-2" />
                    GPS Tracking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FieldMap;