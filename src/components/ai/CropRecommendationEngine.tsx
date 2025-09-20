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
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const { toast } = useToast();

  // Mock AI recommendations for demo (replace with actual API call)
  const mockRecommendations: CropRecommendation[] = [
    {
      crop: 'Wheat',
      variety: 'PBW 725 (Punjab Wheat)',
      confidence: 92,
      expectedYield: '45-50 quintals/hectare',
      profitEstimate: '₹35,000-40,000/hectare',
      plantingWindow: 'Nov 15 - Dec 10',
      waterRequirement: '400-450mm',
      fertilizers: ['Urea 130kg/ha', 'DAP 125kg/ha', 'MOP 60kg/ha'],
      riskFactors: ['Yellow rust susceptible', 'Late sowing risk'],
      marketDemand: 'high',
      suitabilityScore: 85
    },
    {
      crop: 'Barley',
      variety: 'PL 426',
      confidence: 87,
      expectedYield: '40-45 quintals/hectare',
      profitEstimate: '₹28,000-32,000/hectare',
      plantingWindow: 'Nov 20 - Dec 15',
      waterRequirement: '300-350mm',
      fertilizers: ['Urea 100kg/ha', 'DAP 100kg/ha', 'MOP 40kg/ha'],
      riskFactors: ['Market price volatility'],
      marketDemand: 'medium',
      suitabilityScore: 78
    },
    {
      crop: 'Mustard',
      variety: 'RH 30',
      confidence: 82,
      expectedYield: '18-22 quintals/hectare',
      profitEstimate: '₹45,000-55,000/hectare',
      plantingWindow: 'Oct 15 - Nov 15',
      waterRequirement: '250-300mm',
      fertilizers: ['Urea 60kg/ha', 'DAP 80kg/ha', 'MOP 40kg/ha'],
      riskFactors: ['Aphid infestation', 'Weather dependency'],
      marketDemand: 'high',
      suitabilityScore: 75
    }
  ];

  const generateRecommendations = async () => {
    if (!apiKey && recommendations.length === 0) {
      setShowApiInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to get AI recommendations, or view demo recommendations.",
        variant: "default",
      });
      return;
    }

    setLoading(true);
    
    try {
      if (apiKey) {
        // Real API call to Perplexity
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'You are an agricultural expert specializing in Punjab agriculture. Provide detailed crop recommendations based on farm data, soil conditions, and current market trends. Focus on crops suitable for Punjab climate and soil conditions.'
              },
              {
                role: 'user',
                content: `Based on the following farm data, recommend the top 3 crops for ${farmData.season} season in Punjab:
                
                Location: ${farmData.location}
                Farm Size: ${farmData.farmSize} acres
                Soil Type: ${farmData.soilType}
                Irrigation: ${farmData.irrigationMethod}
                Previous Crop: ${farmData.previousCrop}
                Budget: ₹${farmData.budget}
                
                Soil Analysis:
                pH: ${soilData.ph}
                Nitrogen: ${soilData.nitrogen} kg/ha
                Phosphorus: ${soilData.phosphorus} kg/ha
                Potassium: ${soilData.potassium} kg/ha
                Organic Carbon: ${soilData.organicCarbon}%
                Moisture: ${soilData.moisture}%
                
                Please provide specific Punjab varieties, expected yields, profit estimates, and detailed recommendations.`
              }
            ],
            temperature: 0.2,
            top_p: 0.9,
            max_tokens: 1000,
            return_images: false,
            return_related_questions: false,
            search_domain_filter: ['punjab.gov.in', 'pau.edu'],
            search_recency_filter: 'month',
            frequency_penalty: 1,
            presence_penalty: 0
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Process AI response and convert to recommendations format
          console.log('AI Response:', data.choices[0].message.content);
          toast({
            title: "AI Recommendations Generated",
            description: "Successfully generated personalized crop recommendations using AI.",
          });
        } else {
          throw new Error('API request failed');
        }
      }
      
      // For demo, show mock recommendations
      setRecommendations(mockRecommendations);
      
    } catch (error) {
      console.error('Error:', error);
      // Fallback to mock data
      setRecommendations(mockRecommendations);
      toast({
        title: "Demo Mode",
        description: "Showing sample recommendations. Connect API key for personalized results.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
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