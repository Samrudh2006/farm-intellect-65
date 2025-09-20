import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CloudRain,
  Thermometer,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface YieldPrediction {
  crop: string;
  predictedYield: number;
  confidence: number;
  factors: {
    weather: number;
    soil: number;
    management: number;
    genetics: number;
  };
  riskAssessment: 'low' | 'medium' | 'high';
  recommendations: string[];
}

const mockYieldData = [
  { month: 'Nov', expected: 35, actual: 0, weather: 85 },
  { month: 'Dec', expected: 40, actual: 0, weather: 90 },
  { month: 'Jan', expected: 42, actual: 0, weather: 88 },
  { month: 'Feb', expected: 45, actual: 0, weather: 92 },
  { month: 'Mar', expected: 48, actual: 0, weather: 85 },
  { month: 'Apr', expected: 50, actual: 0, weather: 80 }
];

const historicalYield = [
  { year: '2020', wheat: 42, rice: 65, cotton: 18, mustard: 15 },
  { year: '2021', wheat: 45, rice: 68, cotton: 20, mustard: 17 },
  { year: '2022', wheat: 43, rice: 70, cotton: 19, mustard: 16 },
  { year: '2023', wheat: 47, rice: 72, cotton: 22, mustard: 18 },
  { year: '2024', wheat: 49, rice: 75, cotton: 24, mustard: 20 }
];

const profitAnalysis = [
  { crop: 'Wheat', cost: 35000, revenue: 75000, profit: 40000 },
  { crop: 'Rice', cost: 45000, revenue: 90000, profit: 45000 },
  { crop: 'Cotton', cost: 50000, revenue: 120000, profit: 70000 },
  { crop: 'Mustard', cost: 25000, revenue: 80000, profit: 55000 }
];

const riskFactors = [
  { name: 'Weather Risk', value: 25, color: '#ef4444' },
  { name: 'Market Risk', value: 35, color: '#f59e0b' },
  { name: 'Disease Risk', value: 20, color: '#8b5cf6' },
  { name: 'Resource Risk', value: 20, color: '#06b6d4' }
];

const YieldPredictor = () => {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  
  const mockPrediction: YieldPrediction = {
    crop: 'Wheat (PBW 725)',
    predictedYield: 48.5,
    confidence: 87,
    factors: {
      weather: 85,
      soil: 92,
      management: 78,
      genetics: 88
    },
    riskAssessment: 'low',
    recommendations: [
      'Apply second dose of urea by Jan 15 for optimal tillering',
      'Monitor for yellow rust after first irrigation',
      'Plan harvest by April 15 to avoid heat stress',
      'Use weedicide at 30-35 DAS for maximum efficacy'
    ]
  };

  const riskColor = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50'
  };

  return (
    <div className="space-y-6">
      {/* Yield Prediction Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Yield</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockPrediction.predictedYield} q/ha</div>
            <p className="text-xs text-muted-foreground">
              {mockPrediction.confidence}% confidence level
            </p>
            <Progress value={mockPrediction.confidence} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
            {mockPrediction.riskAssessment === 'low' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${riskColor[mockPrediction.riskAssessment]}`}>
              {mockPrediction.riskAssessment}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall production risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹42,500</div>
            <p className="text-xs text-muted-foreground">
              Net profit per hectare
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+12% vs last year</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="prediction" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="prediction">Yield Prediction</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          <TabsTrigger value="profit">Profit Analysis</TabsTrigger>
          <TabsTrigger value="risks">Risk Factors</TabsTrigger>
        </TabsList>

        <TabsContent value="prediction" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Yield Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Yield Contributing Factors</CardTitle>
                <CardDescription>
                  AI analysis of factors affecting your crop yield
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Weather Conditions</span>
                    <span className="text-sm">{mockPrediction.factors.weather}%</span>
                  </div>
                  <Progress value={mockPrediction.factors.weather} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Soil Health</span>
                    <span className="text-sm">{mockPrediction.factors.soil}%</span>
                  </div>
                  <Progress value={mockPrediction.factors.soil} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Management Practices</span>
                    <span className="text-sm">{mockPrediction.factors.management}%</span>
                  </div>
                  <Progress value={mockPrediction.factors.management} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Seed Genetics</span>
                    <span className="text-sm">{mockPrediction.factors.genetics}%</span>
                  </div>
                  <Progress value={mockPrediction.factors.genetics} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Monthly Progression */}
            <Card>
              <CardHeader>
                <CardTitle>Yield Progression Forecast</CardTitle>
                <CardDescription>
                  Expected yield development over crop season
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mockYieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="expected" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>
                Actionable insights to maximize your yield potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPrediction.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Badge className="mt-0.5">{index + 1}</Badge>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Yield Trends</CardTitle>
              <CardDescription>
                5-year yield performance comparison across major crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalYield}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="wheat" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="rice" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="cotton" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="mustard" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crop Profitability Analysis</CardTitle>
              <CardDescription>
                Compare costs, revenue, and profit across different crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={profitAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="crop" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}`, '']} />
                  <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                  <Bar dataKey="profit" fill="#3b82f6" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {profitAnalysis.map((crop, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{crop.crop}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Production Cost:</span>
                    <span className="font-medium text-red-600">₹{crop.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Revenue:</span>
                    <span className="font-medium text-green-600">₹{crop.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Net Profit:</span>
                    <span className="text-primary">₹{crop.profit.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ROI: {((crop.profit / crop.cost) * 100).toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>
                  Analysis of various risk factors affecting crop production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskFactors}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {riskFactors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Mitigation Strategies</CardTitle>
                <CardDescription>
                  Recommended actions to minimize production risks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-l-red-500 bg-red-50">
                    <h4 className="font-medium text-red-800">Weather Risk</h4>
                    <p className="text-sm text-red-700">Use crop insurance and weather-based advisories</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-50">
                    <h4 className="font-medium text-yellow-800">Market Risk</h4>
                    <p className="text-sm text-yellow-700">Contract farming and price forecasting</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-l-purple-500 bg-purple-50">
                    <h4 className="font-medium text-purple-800">Disease Risk</h4>
                    <p className="text-sm text-purple-700">Regular monitoring and integrated pest management</p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50">
                    <h4 className="font-medium text-blue-800">Resource Risk</h4>
                    <p className="text-sm text-blue-700">Efficient resource planning and backup arrangements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YieldPredictor;