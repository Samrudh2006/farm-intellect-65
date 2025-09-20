import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Recycle,
  Award,
  TrendingUp,
  Calculator,
  Target,
  CheckCircle,
  Trees,
  Wind,
  Sun
} from "lucide-react";

interface CarbonCalculation {
  category: string;
  current: number;
  optimized: number;
  savings: number;
  unit: string;
}

interface CarbonReport {
  totalFootprint: number;
  reductionPotential: number;
  carbonCredits: number;
  sustainabilityScore: number;
  recommendations: string[];
  calculations: CarbonCalculation[];
}

export const CarbonFootprintCalculator = () => {
  const [farmSize, setFarmSize] = useState("5");
  const [cropType, setCropType] = useState("wheat");
  const [irrigationType, setIrrigationType] = useState("drip");
  const [fertilizerUsage, setFertilizerUsage] = useState("medium");
  const [powerSource, setPowerSource] = useState("grid");
  const [transportDistance, setTransportDistance] = useState("50");
  const [report, setReport] = useState<CarbonReport | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const farmingPractices = {
    organic: { factor: 0.7, label: "Organic Farming" },
    conventional: { factor: 1.0, label: "Conventional" },
    precision: { factor: 0.8, label: "Precision Agriculture" },
    conservation: { factor: 0.6, label: "Conservation Tillage" }
  };

  const calculateCarbonFootprint = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const fieldSize = parseFloat(farmSize);
      const transport = parseFloat(transportDistance);
      
      // Base emissions per hectare (tons CO2e)
      const baseEmissions = {
        wheat: 2.8,
        rice: 4.2,
        maize: 2.4,
        cotton: 5.1,
        soybean: 1.9
      };
      
      const cropEmissions = baseEmissions[cropType as keyof typeof baseEmissions] * fieldSize;
      
      // Irrigation emissions
      const irrigationEmissions = {
        flood: 1.2,
        sprinkler: 0.8,
        drip: 0.4
      };
      const waterEmissions = irrigationEmissions[irrigationType as keyof typeof irrigationEmissions] * fieldSize;
      
      // Fertilizer emissions
      const fertilizerEmissions = {
        low: 0.5,
        medium: 1.0,
        high: 1.8
      };
      const nutrientEmissions = fertilizerEmissions[fertilizerUsage as keyof typeof fertilizerEmissions] * fieldSize;
      
      // Energy emissions
      const energyEmissions = {
        solar: 0.2,
        grid: 1.5,
        diesel: 2.1
      };
      const powerEmissions = energyEmissions[powerSource as keyof typeof energyEmissions] * fieldSize;
      
      // Transportation emissions
      const transportEmissions = (transport * 0.12 * fieldSize) / 100; // kg CO2 per km per ton
      
      const calculations: CarbonCalculation[] = [
        {
          category: "Crop Production",
          current: cropEmissions,
          optimized: cropEmissions * 0.8,
          savings: cropEmissions * 0.2,
          unit: "tons CO2e"
        },
        {
          category: "Irrigation",
          current: waterEmissions,
          optimized: waterEmissions * 0.6,
          savings: waterEmissions * 0.4,
          unit: "tons CO2e"
        },
        {
          category: "Fertilizers",
          current: nutrientEmissions,
          optimized: nutrientEmissions * 0.5,
          savings: nutrientEmissions * 0.5,
          unit: "tons CO2e"
        },
        {
          category: "Energy Use",
          current: powerEmissions,
          optimized: powerEmissions * 0.3,
          savings: powerEmissions * 0.7,
          unit: "tons CO2e"
        },
        {
          category: "Transportation",
          current: transportEmissions,
          optimized: transportEmissions * 0.7,
          savings: transportEmissions * 0.3,
          unit: "tons CO2e"
        }
      ];
      
      const totalCurrent = calculations.reduce((sum, calc) => sum + calc.current, 0);
      const totalOptimized = calculations.reduce((sum, calc) => sum + calc.optimized, 0);
      const totalSavings = totalCurrent - totalOptimized;
      
      const carbonCredits = Math.round(totalSavings * 1.2); // Credits per ton CO2e saved
      const sustainabilityScore = Math.min(100, Math.max(0, 100 - (totalOptimized / fieldSize) * 10));
      
      setReport({
        totalFootprint: Math.round(totalCurrent * 100) / 100,
        reductionPotential: Math.round(totalSavings * 100) / 100,
        carbonCredits,
        sustainabilityScore: Math.round(sustainabilityScore),
        recommendations: [
          "Switch to drip irrigation to reduce water emissions by 60%",
          "Adopt precision agriculture for 20% fertilizer reduction",
          "Install solar panels to cut energy emissions by 70%",
          "Implement cover cropping for soil carbon sequestration",
          "Use organic fertilizers to reduce chemical emissions"
        ],
        calculations
      });
      
      setIsCalculating(false);
    }, 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Carbon Footprint Calculator & Optimizer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Calculate your farm's carbon footprint and earn carbon credits
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="report">Carbon Report</TabsTrigger>
            <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                <Input
                  id="farmSize"
                  type="number"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  min="0.1"
                  step="0.1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cropType">Primary Crop</Label>
                <select 
                  id="cropType"
                  className="w-full p-2 border rounded"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                >
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="maize">Maize</option>
                  <option value="cotton">Cotton</option>
                  <option value="soybean">Soybean</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="irrigation">Irrigation Type</Label>
                <select 
                  id="irrigation"
                  className="w-full p-2 border rounded"
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                >
                  <option value="drip">Drip Irrigation</option>
                  <option value="sprinkler">Sprinkler</option>
                  <option value="flood">Flood Irrigation</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fertilizer">Fertilizer Usage</Label>
                <select 
                  id="fertilizer"
                  className="w-full p-2 border rounded"
                  value={fertilizerUsage}
                  onChange={(e) => setFertilizerUsage(e.target.value)}
                >
                  <option value="low">Low (Organic/Minimal)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="high">High (Intensive)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="power">Power Source</Label>
                <select 
                  id="power"
                  className="w-full p-2 border rounded"
                  value={powerSource}
                  onChange={(e) => setPowerSource(e.target.value)}
                >
                  <option value="solar">Solar Energy</option>
                  <option value="grid">Grid Electricity</option>
                  <option value="diesel">Diesel Generator</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transport">Transport Distance (km)</Label>
                <Input
                  id="transport"
                  type="number"
                  value={transportDistance}
                  onChange={(e) => setTransportDistance(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            
            <Button 
              onClick={calculateCarbonFootprint}
              disabled={isCalculating}
              className="w-full"
              size="lg"
            >
              {isCalculating ? (
                <>
                  <Calculator className="h-4 w-4 mr-2 animate-spin" />
                  Calculating Carbon Footprint...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Carbon Footprint
                </>
              )}
            </Button>
            
            {isCalculating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Analyzing farming practices...</span>
                </div>
                <Progress value={33} className="w-full" />
                
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Calculating water and irrigation impact...</span>
                </div>
                <Progress value={66} className="w-full" />
                
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Processing energy consumption data...</span>
                </div>
                <Progress value={90} className="w-full" />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="report" className="space-y-6">
            {report && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Leaf className="h-6 w-6 mx-auto mb-2 text-red-500" />
                      <p className="text-sm text-muted-foreground">Current Footprint</p>
                      <p className="text-xl font-bold text-red-600">{report.totalFootprint} tons CO2e</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-muted-foreground">Reduction Potential</p>
                      <p className="text-xl font-bold text-green-600">{report.reductionPotential} tons CO2e</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Award className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Carbon Credits</p>
                      <p className="text-xl font-bold text-blue-600">{report.carbonCredits} credits</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Sustainability Score</p>
                      <p className={`text-xl font-bold ${getScoreColor(report.sustainabilityScore)}`}>
                        {report.sustainabilityScore}/100
                      </p>
                      <p className={`text-xs ${getScoreColor(report.sustainabilityScore)}`}>
                        {getScoreLabel(report.sustainabilityScore)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Detailed Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Emissions Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {report.calculations.map((calc, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{calc.category}</span>
                            <Badge variant="outline">
                              -{Math.round((calc.savings / calc.current) * 100)}% potential reduction
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Current</p>
                              <p className="font-semibold text-red-600">
                                {calc.current.toFixed(2)} {calc.unit}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Optimized</p>
                              <p className="font-semibold text-green-600">
                                {calc.optimized.toFixed(2)} {calc.unit}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Savings</p>
                              <p className="font-semibold text-blue-600">
                                {calc.savings.toFixed(2)} {calc.unit}
                              </p>
                            </div>
                          </div>
                          
                          <Progress 
                            value={(calc.savings / calc.current) * 100} 
                            className="w-full h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Optimization Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {report.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="credits" className="space-y-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Credit Program</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Award className="h-8 w-8 mx-auto mb-2 text-gold-500" />
                      <p className="font-semibold">Verified Credits</p>
                      <p className="text-2xl font-bold text-green-600">
                        {report?.carbonCredits || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Available for trading</p>
                    </div>
                    
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="font-semibold">Market Value</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{report ? (report.carbonCredits * 120).toLocaleString() : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">₹120 per credit</p>
                    </div>
                    
                    <div className="text-center">
                      <Recycle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <p className="font-semibold">CO2 Offset</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {report ? report.reductionPotential.toFixed(1) : 0}
                      </p>
                      <p className="text-sm text-muted-foreground">tons CO2 equivalent</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Button className="w-full">
                      <Award className="h-4 w-4 mr-2" />
                      Apply for Credits
                    </Button>
                    <Button variant="outline" className="w-full">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trade Credits
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sustainable Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: Trees, title: "Agroforestry", credits: "2-5 credits/hectare", desc: "Tree planting and forest conservation" },
                      { icon: Droplets, title: "Water Conservation", credits: "1-3 credits/hectare", desc: "Efficient irrigation and rainwater harvesting" },
                      { icon: Leaf, title: "Organic Farming", credits: "3-7 credits/hectare", desc: "Reduced chemical inputs and soil health" },
                      { icon: Sun, title: "Renewable Energy", credits: "5-10 credits/system", desc: "Solar panels and wind energy adoption" }
                    ].map((practice, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <practice.icon className="h-5 w-5 text-green-500" />
                          <span className="font-medium">{practice.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{practice.desc}</p>
                        <p className="text-sm font-medium text-blue-600">{practice.credits}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};