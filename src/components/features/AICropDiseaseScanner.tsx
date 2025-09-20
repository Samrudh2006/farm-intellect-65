import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  Leaf, 
  Bug,
  Droplets,
  Thermometer,
  Upload,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface DiseaseResult {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  treatment: string;
  prevention: string;
}

export const AICropDiseaseScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockDiseases = [
    {
      disease: "Wheat Rust",
      confidence: 94,
      severity: "high" as const,
      treatment: "Apply fungicide immediately. Use Propiconazole-based products.",
      prevention: "Use resistant varieties, avoid overhead irrigation, ensure proper spacing."
    },
    {
      disease: "Rice Blast",
      confidence: 87,
      severity: "medium" as const,
      treatment: "Apply Tricyclazole or Carbendazim. Remove infected leaves.",
      prevention: "Use certified seeds, balanced fertilization, proper water management."
    },
    {
      disease: "Cotton Bollworm",
      confidence: 91,
      severity: "high" as const,
      treatment: "Apply Bt spray or Chlorantraniliprole. Monitor daily.",
      prevention: "Use pheromone traps, crop rotation, encourage natural predators."
    },
    {
      disease: "Healthy Plant",
      confidence: 96,
      severity: "low" as const,
      treatment: "No treatment needed. Continue current care routine.",
      prevention: "Maintain good practices: proper watering, fertilization, and monitoring."
    }
  ];

  const simulateAIScan = () => {
    setIsScanning(true);
    setResult(null);
    
    setTimeout(() => {
      const randomResult = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      setResult(randomResult);
      setIsScanning(false);
      toast("AI Analysis Complete!");
    }, 3000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast("Image uploaded! Click scan to analyze.");
      };
      reader.readAsDataURL(file);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return AlertTriangle;
      case "medium": return Bug;
      case "low": return CheckCircle;
      default: return Leaf;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-primary" />
          AI Crop Disease Scanner
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload or capture crop images for instant AI disease detection
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload Image
          </Button>
          <Button
            onClick={() => {
              // Simulate camera capture
              setUploadedImage("/api/placeholder/300/200");
              toast("Camera image captured!");
            }}
            variant="outline"
            size="sm"
          >
            <Camera className="h-4 w-4 mr-1" />
            Take Photo
          </Button>
          <Button
            onClick={() => {
              setUploadedImage(null);
              setResult(null);
            }}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Image Preview */}
        {uploadedImage && (
          <div className="space-y-3">
            <img
              src={uploadedImage}
              alt="Crop for analysis"
              className="w-full max-w-md h-48 object-cover rounded-lg border"
            />
            
            <Button
              onClick={simulateAIScan}
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Scan className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Start AI Analysis
                </>
              )}
            </Button>
          </div>
        )}

        {/* Scanning Progress */}
        {isScanning && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Analyzing image quality...</span>
            </div>
            <Progress value={33} className="w-full" />
            
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-500" />
              <span className="text-sm">Detecting plant features...</span>
            </div>
            <Progress value={66} className="w-full" />
            
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Identifying diseases/pests...</span>
            </div>
            <Progress value={90} className="w-full" />
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{result.disease}</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={getSeverityColor(result.severity)}
                >
                  {result.severity.toUpperCase()}
                </Badge>
                <Badge variant="secondary">
                  {result.confidence}% confident
                </Badge>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Confidence Level</span>
                <span>{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} className="w-full" />
            </div>

            {/* Treatment */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Treatment</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {result.treatment}
              </p>
            </div>

            {/* Prevention */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Prevention</span>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {result.prevention}
              </p>
            </div>

            <Button className="w-full" size="sm">
              Save to Crop Diary
            </Button>
          </div>
        )}

        {/* Info */}
        {!uploadedImage && (
          <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">AI Disease Detection</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a photo of your crop to get instant AI-powered disease detection and treatment recommendations
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>• 95%+ Accuracy</span>
              <span>• Instant Results</span>
              <span>• 50+ Diseases</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};