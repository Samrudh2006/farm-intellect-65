import { useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload,
  Camera,
  Scan,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Activity,
  FileImage,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AICropScanner = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [cropType, setCropType] = useState("");
  const { toast } = useToast();
  
  const user = {
    name: "Dr. Agricultural Expert",
    role: "expert",
  };

  const aiStats = {
    totalScans: 1247,
    diseasesDetected: 89,
    accuracy: 94.2,
    preventionTips: 156
  };

  const recentScans = [
    {
      id: "SC001",
      farmer: "Rajesh Kumar", 
      crop: "Wheat",
      disease: "Leaf Rust",
      confidence: 92,
      status: "treated",
      timestamp: "2 hours ago"
    },
    {
      id: "SC002", 
      farmer: "Priya Singh",
      crop: "Rice", 
      disease: "Blast Disease",
      confidence: 87,
      status: "pending",
      timestamp: "4 hours ago"
    },
    {
      id: "SC003",
      farmer: "Mohan Patel",
      crop: "Cotton",
      disease: "Bollworm",
      confidence: 95,
      status: "treated", 
      timestamp: "1 day ago"
    }
  ];

  const handleImageSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, [toast]);

  const handleScan = async () => {
    if (!selectedImage || !cropType) {
      toast({
        title: "Missing information",
        description: "Please select an image and specify crop type",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockResult = {
        disease: "Late Blight",
        confidence: 89,
        severity: "medium",
        description: "Fungal infection causing dark spots on leaves with white fungal growth on undersides.",
        treatment: {
          immediate: "Apply copper-based fungicide (Bordeaux mixture) within 24 hours",
          followup: "Repeat treatment every 7-10 days for 3 weeks",
          prevention: "Improve air circulation, avoid overhead watering"
        },
        medicines: [
          { name: "Copper Oxychloride 50% WP", dosage: "2-3 gm/liter", type: "Fungicide" },
          { name: "Metalaxyl + Mancozeb", dosage: "2.5 gm/liter", type: "Systemic Fungicide" },
          { name: "Bordeaux Mixture", dosage: "5 gm/liter", type: "Protective Fungicide" }
        ]
      };
      
      setScanResults(mockResult);
      setScanning(false);
      
      toast({
        title: "Scan completed",
        description: "Disease detected with 89% confidence",
      });
    }, 3000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setScanResults(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={5}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
      />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                AI Crop Disease Scanner
              </h2>
              <p className="text-muted-foreground">
                Advanced AI-powered crop disease detection and treatment recommendations
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Expert Mode
            </Badge>
          </div>

          {/* AI Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                <Scan className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.totalScans}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Diseases Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.diseasesDetected}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-orange-600">+8%</span> this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.accuracy}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+1.2%</span> improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prevention Tips</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{aiStats.preventionTips}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-blue-600">+25</span> new this week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Scanner Interface */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Disease Scanner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="crop-type">Crop Type</Label>
                      <Input
                        id="crop-type"
                        placeholder="e.g. Wheat, Rice, Cotton"
                        value={cropType}
                        onChange={(e) => setCropType(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="image-upload">Upload Crop Image</Label>
                      <div className="relative">
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Select Image
                        </Button>
                      </div>
                    </div>
                  </div>

                  {previewUrl && (
                    <div className="relative">
                      <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                        <img
                          src={previewUrl}
                          alt="Crop image preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <Button 
                    onClick={handleScan}
                    disabled={!selectedImage || !cropType || scanning}
                    className="w-full"
                    size="lg"
                  >
                    {scanning ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Scan for Diseases
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Scan Results */}
              {scanResults && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Scan Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <h3 className="font-semibold text-lg">{scanResults.disease}</h3>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {scanResults.confidence}% • Severity: {scanResults.severity}
                        </p>
                      </div>
                      <Badge variant={scanResults.severity === 'high' ? 'destructive' : 'secondary'}>
                        {scanResults.severity} risk
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{scanResults.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommended Treatment</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Immediate:</strong> {scanResults.treatment.immediate}</p>
                        <p><strong>Follow-up:</strong> {scanResults.treatment.followup}</p>
                        <p><strong>Prevention:</strong> {scanResults.treatment.prevention}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recommended Medicines</h4>
                      <div className="space-y-2">
                        {scanResults.medicines.map((medicine, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium text-sm">{medicine.name}</p>
                              <p className="text-xs text-muted-foreground">{medicine.type}</p>
                            </div>
                            <Badge variant="outline">{medicine.dosage}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Scans
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{scan.farmer}</p>
                        <p className="text-xs text-muted-foreground">{scan.crop}</p>
                      </div>
                      <Badge 
                        variant={scan.status === 'treated' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {scan.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-600">{scan.disease}</p>
                      <p className="text-xs text-muted-foreground">
                        {scan.confidence}% confidence • {scan.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AICropScanner;