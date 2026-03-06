import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Leaf,
  TrendingUp,
  DollarSign,
  Calendar,
  Droplets,
  Thermometer,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { getRecommendationBySoil, getHighProfitCrops } from "@/data/cropRecommendations";

interface CropRecommendation {
  crop: string;
  variety: string;
  confidence: number;
  expectedYield: string;
  profitEstimate: string;
  plantingWindow: string;
  waterRequirement: string;
  fertilizers: string[];
  riskFactors: string[];
  marketDemand: 'high' | 'medium' | 'low';
  suitabilityScore: number;
}

interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
}

const CropRecommendationEngine = () => {
  const [loading, setLoading] = useState(false);
  const [farmData, setFarmData] = useState({
    location: '',
    farmSize: '',
    soilType: '',
    irrigationMethod: '',
    previousCrop: '',
    budget: '',
    season: 'rabi'
  });
  
  const [soilData, setSoilData] = useState<SoilData>({
    ph: 7.2,
    nitrogen: 280,
    phosphorus: 45,
    potassium: 320,
    organicCarbon: 0.8,
    moisture: 25
  });

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [showApiInput] = useState(false);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setLoading(true);

    // Use real dataset: score crops by soil parameters
    await new Promise(r => setTimeout(r, 800));
    
    const results = getRecommendationBySoil(
      soilData.nitrogen,
      soilData.phosphorus,
      soilData.potassium,
      soilData.ph,
      25,      // default temp — could add to form
      60,      // default humidity
      farmData.season === 'kharif' ? 1200 : 400  // rainfall estimate by season
    );

    if (results.length > 0) {
      const mapped: CropRecommendation[] = results.slice(0, 4).map(r => {
        const c = r.crop;
        const variety = c.bestVarieties[0];
        return {
          crop: c.crop,
          variety: variety?.name || c.crop,
          confidence: r.score,
          expectedYield: `${c.avgYield.value} ${c.avgYield.unit}`,
          profitEstimate: `₹${c.profitPerHectare.min.toLocaleString()}–${c.profitPerHectare.max.toLocaleString()}/hectare`,
          plantingWindow: `${c.sowingWindow?.start || "Season start"}`,
          waterRequirement: `${c.waterRequirement.value} ${c.waterRequirement.unit}`,
          fertilizers: [...c.fertilizers.basal.slice(0, 2), ...c.fertilizers.topDressing.slice(0, 1)],
          riskFactors: c.rotationCrops.length > 0 ? [`Rotate with: ${c.rotationCrops.slice(0, 2).join(", ")}`] : ["Monitor for common pests"],
          marketDemand: c.profitPerHectare.max > 80000 ? 'high' : c.profitPerHectare.max > 40000 ? 'medium' : 'low',
          suitabilityScore: r.score
        };
      });
      setRecommendations(mapped);
      toast({ title: "Recommendations Ready", description: `${mapped.length} crops matched your soil parameters from ICAR dataset.` });
    } else {
      // Fallback: high-profit crops
      const high = getHighProfitCrops().slice(0, 3);
      const mapped: CropRecommendation[] = high.map(c => ({
        crop: c.crop,
        variety: c.bestVarieties[0]?.name || c.crop,
        confidence: 60,
        expectedYield: `${c.avgYield.value} ${c.avgYield.unit}`,
        profitEstimate: `₹${c.profitPerHectare.min.toLocaleString()}–${c.profitPerHectare.max.toLocaleString()}/hectare`,
        plantingWindow: `${c.season} season`,
        waterRequirement: `${c.waterRequirement.value} ${c.waterRequirement.unit}`,
        fertilizers: c.fertilizers.basal.slice(0, 2),
        riskFactors: ["Adjust soil parameters for better match"],
        marketDemand: 'high',
        suitabilityScore: 60
      }));
      setRecommendations(mapped);
      toast({ title: "General Recommendation", description: "Showing high-profit crops. Adjust soil data for precise results.", variant: "default" });
    }
    setLoading(false);
  };

  const demandColors = {
    high: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-red-100 text-red-700'
  };

  return (
    <div className="space-y-6">
      {/* AI API Configuration */}
      {showApiInput && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Configuration
            </CardTitle>
            <CardDescription>
              Enter your Perplexity API key for real-time AI recommendations, or continue with demo mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Perplexity API Key (Optional)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="pplx-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={generateRecommendations} disabled={!apiKey}>
                Use AI Mode
              </Button>
              <Button variant="outline" onClick={() => {
                setShowApiInput(false);
                generateRecommendations();
              }}>
                Continue with Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Farm Data Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Farm Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location (District)</Label>
            <Select value={farmData.location} onValueChange={(value) => setFarmData({...farmData, location: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ludhiana">Ludhiana</SelectItem>
                <SelectItem value="amritsar">Amritsar</SelectItem>
                <SelectItem value="jalandhar">Jalandhar</SelectItem>
                <SelectItem value="patiala">Patiala</SelectItem>
                <SelectItem value="bathinda">Bathinda</SelectItem>
                <SelectItem value="ferozepur">Ferozepur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm-size">Farm Size (acres)</Label>
            <Input
              id="farm-size"
              value={farmData.farmSize}
              onChange={(e) => setFarmData({...farmData, farmSize: e.target.value})}
              placeholder="e.g., 5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil-type">Soil Type</Label>
            <Select value={farmData.soilType} onValueChange={(value) => setFarmData({...farmData, soilType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alluvial">Alluvial</SelectItem>
                <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
                <SelectItem value="clay-loam">Clay Loam</SelectItem>
                <SelectItem value="sandy">Sandy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="irrigation">Irrigation Method</Label>
            <Select value={farmData.irrigationMethod} onValueChange={(value) => setFarmData({...farmData, irrigationMethod: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select irrigation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tube-well">Tube Well</SelectItem>
                <SelectItem value="canal">Canal</SelectItem>
                <SelectItem value="drip">Drip Irrigation</SelectItem>
                <SelectItem value="sprinkler">Sprinkler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous-crop">Previous Crop</Label>
            <Input
              id="previous-crop"
              value={farmData.previousCrop}
              onChange={(e) => setFarmData({...farmData, previousCrop: e.target.value})}
              placeholder="e.g., Rice, Cotton"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Available Budget (₹)</Label>
            <Input
              id="budget"
              value={farmData.budget}
              onChange={(e) => setFarmData({...farmData, budget: e.target.value})}
              placeholder="e.g., 50000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Soil Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Soil Health Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>pH Level: {soilData.ph}</Label>
            <Progress value={(soilData.ph / 14) * 100} className="h-2" />
            <Badge variant={soilData.ph >= 6.5 && soilData.ph <= 7.5 ? "default" : "destructive"}>
              {soilData.ph >= 6.5 && soilData.ph <= 7.5 ? "Optimal" : "Needs Attention"}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label>Nitrogen: {soilData.nitrogen} kg/ha</Label>
            <Progress value={Math.min((soilData.nitrogen / 400) * 100, 100)} className="h-2" />
            <Badge variant={soilData.nitrogen >= 250 ? "default" : "destructive"}>
              {soilData.nitrogen >= 250 ? "Good" : "Low"}
            </Badge>
          </div>

          <div className="space-y-2">
            <Label>Phosphorus: {soilData.phosphorus} kg/ha</Label>
            <Progress value={Math.min((soilData.phosphorus / 60) * 100, 100)} className="h-2" />
            <Badge variant={soilData.phosphorus >= 25 ? "default" : "destructive"}>
              {soilData.phosphorus >= 25 ? "Good" : "Low"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Generate Recommendations Button */}
      <div className="text-center">
        <Button 
          onClick={generateRecommendations} 
          size="lg" 
          disabled={loading}
          className="min-w-[200px]"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Get AI Recommendations
            </>
          )}
        </Button>
      </div>

      {/* Recommendations Display */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">AI-Generated Crop Recommendations</h3>
          
          {recommendations.map((rec, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        #{index + 1}
                      </Badge>
                      {rec.crop} - {rec.variety}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className={demandColors[rec.marketDemand]}>
                        {rec.marketDemand} demand
                      </Badge>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{rec.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{rec.profitEstimate}</div>
                    <div className="text-sm text-muted-foreground">Expected profit</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Expected Yield:</span>
                      <span>{rec.expectedYield}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Planting Window:</span>
                      <span>{rec.plantingWindow}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Water Requirement:</span>
                      <span>{rec.waterRequirement}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Recommended Fertilizers:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.fertilizers.map((fertilizer, idx) => (
                          <Badge key={idx} variant="outline">{fertilizer}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {rec.riskFactors.length > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Risk Factors:</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {rec.riskFactors.map((risk, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1">
                    Select This Crop
                  </Button>
                  <Button variant="outline">
                    Get Detailed Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropRecommendationEngine;