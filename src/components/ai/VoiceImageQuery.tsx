import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  Camera, 
  Upload, 
  MicOff,
  Eye,
  Leaf,
  Bug,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";

interface DetectionResult {
  type: 'disease' | 'pest' | 'nutrient' | 'healthy';
  confidence: number;
  title: string;
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
}

export const VoiceImageQuery = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [voiceQuery, setVoiceQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock analysis function
  const analyzeImage = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults: DetectionResult[] = [
      {
        type: 'disease',
        confidence: 92,
        title: 'Late Blight Detected',
        description: 'Phytophthora infestans infection identified on leaf tissue',
        recommendation: 'Apply copper-based fungicide immediately. Remove affected leaves.',
        severity: 'high'
      },
      {
        type: 'pest',
        confidence: 87,
        title: 'Aphid Infestation',
        description: 'Green aphids detected on leaf surface',
        recommendation: 'Spray with neem oil solution or introduce ladybugs.',
        severity: 'medium'
      },
      {
        type: 'nutrient',
        confidence: 85,
        title: 'Nitrogen Deficiency',
        description: 'Yellowing indicates insufficient nitrogen levels',
        recommendation: 'Apply nitrogen-rich fertilizer (urea 20kg/hectare).',
        severity: 'medium'
      },
      {
        type: 'healthy',
        confidence: 95,
        title: 'Healthy Plant',
        description: 'No disease or pest issues detected',
        recommendation: 'Continue current care routine. Monitor regularly.',
        severity: 'low'
      }
    ];
    
    setDetectionResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
    setIsAnalyzing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Start recording logic here
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Mock recording for 5 seconds
    setTimeout(() => {
      setIsRecording(false);
      clearInterval(interval);
      setVoiceQuery("मेरे गेहूं के पत्तों पर पीले धब्बे दिख रहे हैं। क्या करना चाहिए?");
    }, 5000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'disease': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pest': return <Bug className="h-5 w-5 text-orange-500" />;
      case 'nutrient': return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Leaf className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Voice + Image Based Query
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="voice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="voice">Voice Query</TabsTrigger>
            <TabsTrigger value="image">Image Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="relative">
                <Button
                  size="lg"
                  className={`w-32 h-32 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isAnalyzing}
                >
                  {isRecording ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                {isRecording && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <Badge variant="destructive">
                      Recording: {recordingTime}s
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {isRecording 
                  ? "Listening... Speak in Hindi, Punjabi, or English" 
                  : "Tap to start recording your question"
                }
              </div>

              {voiceQuery && (
                <div className="p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-medium mb-2">Voice Query Transcribed:</h4>
                  <p className="text-sm">{voiceQuery}</p>
                  <div className="mt-3">
                    <Badge variant="outline">Hindi detected</Badge>
                  </div>
                </div>
              )}

              {voiceQuery && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">AI Response:</h4>
                  <p className="text-sm text-muted-foreground">
                    गेहूं के पत्तों पर पीले धब्बे आमतौर पर फंगल संक्रमण या पोषक तत्वों की कमी का संकेत होते हैं। 
                    तुरंत प्रभावित पत्तियों को हटाएं और कॉपर सल्फेट का छिड़काव करें। 
                    यदि समस्या बनी रहती है तो नजदीकी कृषि विशेषज्ञ से संपर्क करें।
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="space-y-4">
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Upload a photo of crop, leaf, or soil for AI analysis
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAnalyzing}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" disabled={isAnalyzing}>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded crop image"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedImage(null);
                        setDetectionResult(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>

                  {!detectionResult && !isAnalyzing && (
                    <Button onClick={analyzeImage} className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      Analyze Image
                    </Button>
                  )}

                  {isAnalyzing && (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Analyzing image with AI...</span>
                    </div>
                  )}

                  {detectionResult && (
                    <div className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getResultIcon(detectionResult.type)}
                          <h4 className="font-medium">{detectionResult.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityColor(detectionResult.severity) as any}>
                            {detectionResult.severity}
                          </Badge>
                          <Badge variant="outline">
                            {detectionResult.confidence}% confident
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {detectionResult.description}
                      </p>
                      
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <h5 className="font-medium text-sm mb-1">Recommendation:</h5>
                        <p className="text-sm">{detectionResult.recommendation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};