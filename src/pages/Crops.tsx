import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SeasonalCropGuide } from "@/components/crops/SeasonalCropGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wheat, 
  Plus, 
  Search,
  Calendar,
  MapPin,
  TrendingUp,
  Droplets,
  AlertTriangle,
  BookOpen
} from "lucide-react";

const mockCrops = [
  {
    id: 1,
    name: "Winter Wheat",
    variety: "Hard Red Winter",
    field: "Field A",
    area: "12.5 hectares",
    plantedDate: "2024-10-15",
    expectedHarvest: "2025-06-20",
    stage: "Flowering",
    health: 85,
    status: "healthy"
  },
  {
    id: 2,
    name: "Corn",
    variety: "Sweet Corn",
    field: "Field B", 
    area: "8.2 hectares",
    plantedDate: "2024-05-20",
    expectedHarvest: "2024-09-15",
    stage: "Vegetative",
    health: 92,
    status: "healthy"
  },
  {
    id: 3,
    name: "Soybeans",
    variety: "Early Maturity",
    field: "Field C",
    area: "6.8 hectares", 
    plantedDate: "2024-05-10",
    expectedHarvest: "2024-10-05",
    stage: "Germination",
    health: 67,
    status: "warning"
  }
];

const Crops = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const user = {
    name: "John Farmer",
    role: "farmer",
  };

  const filteredCrops = mockCrops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || crop.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-primary";
      case "warning": return "text-harvest";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy": return "default";
      case "warning": return "secondary";
      case "critical": return "destructive";
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
              <h2 className="text-3xl font-bold text-foreground">My Crops</h2>
              <p className="text-muted-foreground">
                Manage and monitor your crop plantings
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Crop
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Crops Section with Tabs */}
          <Tabs defaultValue="my-crops" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-crops">My Crops</TabsTrigger>
              <TabsTrigger value="crop-guide">Crop Guide</TabsTrigger>
            </TabsList>

            <TabsContent value="my-crops" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCrops.map((crop) => (
                  <Card key={crop.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wheat className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{crop.name}</CardTitle>
                        </div>
                        <Badge variant={getStatusBadge(crop.status) as any}>
                          {crop.stage}
                        </Badge>
                      </div>
                      <CardDescription>{crop.variety}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{crop.field} - {crop.area}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Planted: {new Date(crop.plantedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span>Harvest: {new Date(crop.expectedHarvest).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Health Score</span>
                          <span className={`font-medium ${getStatusColor(crop.status)}`}>
                            {crop.health}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              crop.status === "healthy" ? "bg-primary" :
                              crop.status === "warning" ? "bg-harvest" : "bg-destructive"
                            }`}
                            style={{ width: `${crop.health}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Droplets className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCrops.length === 0 && (
                <div className="text-center py-12">
                  <Wheat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No crops found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="crop-guide">
              <SeasonalCropGuide />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Crops;