import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cropsData, getSeasonalCrops, getCropsByRegion, CropInfo } from "@/data/cropsData";
import { 
  Search, 
  Filter, 
  Droplets, 
  Calendar, 
  MapPin, 
  TrendingUp,
  Clock,
  Thermometer,
  DollarSign,
  Leaf
} from "lucide-react";

export const SeasonalCropGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  const filteredCrops = cropsData.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         crop.hindi.includes(searchTerm) ||
                         crop.punjabi.includes(searchTerm);
    const matchesSeason = selectedSeason === "all" || crop.season === selectedSeason;
    const matchesRegion = selectedRegion === "all" || crop.region.includes(selectedRegion);
    const matchesDifficulty = selectedDifficulty === "all" || crop.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSeason && matchesRegion && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getWaterColor = (water: string) => {
    switch (water) {
      case 'Low': return 'text-blue-400';
      case 'Medium': return 'text-blue-600';
      case 'High': return 'text-blue-800';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Seasonal Crop Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger>
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Seasons</SelectItem>
                <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="perennial">Perennial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Haryana">Haryana</SelectItem>
                <SelectItem value="UP">Uttar Pradesh</SelectItem>
                <SelectItem value="MP">Madhya Pradesh</SelectItem>
                <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedSeason("all");
              setSelectedRegion("all");
              setSelectedDifficulty("all");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crop Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <div className="relative overflow-hidden rounded-t-lg">
              <img 
                src={crop.image} 
                alt={crop.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-3 left-3">
                <Badge className={getDifficultyColor(crop.difficulty)}>
                  {crop.difficulty}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-white/90">
                  {crop.season}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-4">
              <div className="space-y-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {crop.name}
                  <TrendingUp className={`h-4 w-4 ${getProfitabilityColor(crop.profitability)}`} />
                </CardTitle>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>{crop.hindi}</span>
                  <span>•</span>
                  <span>{crop.punjabi}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{crop.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className={`h-4 w-4 ${getWaterColor(crop.waterRequirement)}`} />
                  <span>{crop.waterRequirement} Water</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{crop.marketPrice.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{crop.avgYield}</span>
                </div>
              </div>

              {/* Planting & Harvest */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Planting:</span>
                  <span className="font-medium">{crop.plantingTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harvest:</span>
                  <span className="font-medium">{crop.harvestTime}</span>
                </div>
              </div>

              {/* Regions */}
              <div className="flex flex-wrap gap-1">
                {crop.region.slice(0, 3).map((region) => (
                  <Badge key={region} variant="outline" className="text-xs">
                    {region}
                  </Badge>
                ))}
                {crop.region.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{crop.region.length - 3} more
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {crop.description}
              </p>

              {/* Action Button */}
              <Button className="w-full" size="sm">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No crops found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};