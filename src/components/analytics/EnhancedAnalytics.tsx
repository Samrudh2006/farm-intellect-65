import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Scan, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  PieChart,
  Activity,
  Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, LineChart, Line } from "recharts";

export const EnhancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [analytics, setAnalytics] = useState({
    users: {
      farmers: 1234,
      merchants: 234,
      experts: 45,
      growth: 12.5
    },
    scans: {
      total: 5678,
      diseaseDetected: 1234,
      healthy: 4444,
      accuracy: 94.5
    },
    diseases: [
      { name: "Leaf Blight", count: 345, percentage: 28 },
      { name: "Powdery Mildew", count: 234, percentage: 19 },
      { name: "Rust", count: 198, percentage: 16 },
      { name: "Bacterial Spot", count: 156, percentage: 13 },
      { name: "Others", count: 301, percentage: 24 }
    ],
    yieldPredictions: [
      { crop: "Rice", predicted: 4.2, actual: 4.0, accuracy: 95 },
      { crop: "Wheat", predicted: 3.8, actual: 3.9, accuracy: 97 },
      { crop: "Maize", predicted: 5.1, actual: 4.8, accuracy: 94 },
      { crop: "Cotton", predicted: 2.3, actual: 2.2, accuracy: 96 }
    ],
    monthlyActivity: [
      { month: "Jan", scans: 456, users: 123 },
      { month: "Feb", scans: 567, users: 145 },
      { month: "Mar", scans: 678, users: 167 },
      { month: "Apr", scans: 789, users: 189 },
      { month: "May", scans: 890, users: 212 },
      { month: "Jun", scans: 987, users: 234 }
    ]
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, icon: Icon, trend, subtitle }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex flex-col items-end">
            <Icon className="h-8 w-8 text-muted-foreground" />
            {trend && (
              <div className={`flex items-center mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.users.farmers + analytics.users.merchants + analytics.users.experts}
          icon={Users}
          trend={analytics.users.growth}
          subtitle={`${analytics.users.farmers} farmers, ${analytics.users.merchants} merchants, ${analytics.users.experts} experts`}
        />
        <StatCard
          title="Crop Scans"
          value={analytics.scans.total.toLocaleString()}
          icon={Scan}
          trend={15.3}
          subtitle={`${analytics.scans.accuracy}% accuracy rate`}
        />
        <StatCard
          title="Disease Detection Rate"
          value={`${Math.round((analytics.scans.diseaseDetected / analytics.scans.total) * 100)}%`}
          icon={AlertTriangle}
          subtitle={`${analytics.scans.diseaseDetected} cases detected`}
        />
        <StatCard
          title="Avg Yield Accuracy"
          value="95.5%"
          icon={Target}
          trend={2.1}
          subtitle="Prediction vs Actual"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Common Diseases Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.diseases.map((disease, index) => (
                <div key={disease.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{disease.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{disease.count}</span>
                    <Badge variant="secondary">{disease.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Yield Prediction Accuracy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Yield Prediction Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.yieldPredictions.map((crop) => (
                <div key={crop.crop} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{crop.crop}</span>
                    <span className="text-sm text-muted-foreground">
                      {crop.accuracy}% accurate
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Predicted: {crop.predicted}t/ha</span>
                    <span>Actual: {crop.actual}t/ha</span>
                  </div>
                  <Progress value={crop.accuracy} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monthly Activity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <BarChart width={800} height={300} data={analytics.monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="scans" fill="#8884d8" name="Crop Scans" />
              <Bar dataKey="users" fill="#82ca9d" name="New Users" />
            </BarChart>
          </div>
        </CardContent>
      </Card>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Punjab</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Farmers</span>
                  <span className="text-sm font-medium">456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Scans</span>
                  <span className="text-sm font-medium">2,134</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Yield</span>
                  <span className="text-sm font-medium">4.2 t/ha</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Haryana</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Farmers</span>
                  <span className="text-sm font-medium">312</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Scans</span>
                  <span className="text-sm font-medium">1,876</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Yield</span>
                  <span className="text-sm font-medium">3.9 t/ha</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Uttar Pradesh</h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Farmers</span>
                  <span className="text-sm font-medium">678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Scans</span>
                  <span className="text-sm font-medium">3,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg Yield</span>
                  <span className="text-sm font-medium">3.7 t/ha</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};