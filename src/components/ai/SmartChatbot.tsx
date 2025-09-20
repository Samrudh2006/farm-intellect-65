import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    suggestions?: string[];
    imageAnalysis?: boolean;
  };
}

export const SmartChatbot = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI agricultural assistant. You can ask me anything about crop diseases, fertilizers, farming techniques, or upload images for crop analysis. How can I help you today?",
      timestamp: new Date(),
      metadata: { confidence: 100 }
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock knowledge base for responses
  const knowledgeBase = {
    diseases: {
      "leaf blight": {
        treatment: "Apply copper-based fungicides. Ensure proper drainage and avoid overhead watering.",
        prevention: "Use resistant varieties, proper spacing, and crop rotation.",
        urgency: "high"
      },
      "powdery mildew": {
        treatment: "Apply sulfur-based fungicides or neem oil. Improve air circulation.",
        prevention: "Avoid overhead watering, provide good air circulation.",
        urgency: "medium"
      },
      "rust": {
        treatment: "Apply systemic fungicides containing propiconazole or tebuconazole.",
        prevention: "Use resistant varieties and avoid excessive nitrogen fertilization.",
        urgency: "medium"
      }
    },
    fertilizers: {
      "tomato": "Use balanced NPK 10-10-10 during vegetative growth, then switch to high potassium during fruiting.",
      "wheat": "Apply urea at tillering stage, and DAP at sowing time.",
      "rice": "Use 40kg urea per acre in 3 splits - tillering, panicle initiation, and grain filling."
    },
    general: {
      "irrigation": "Water deeply but less frequently. Early morning is the best time for irrigation.",
      "soil testing": "Test soil pH every 2-3 years. Most crops prefer pH 6.0-7.0.",
      "crop rotation": "Rotate legumes with cereals to maintain soil nitrogen levels."
    }
  };

  const generateResponse = (userInput: string): { content: string; metadata: any } => {
    const input = userInput.toLowerCase();
    
    // Disease-related queries
    if (input.includes('disease') || input.includes('spot') || input.includes('blight') || input.includes('mildew')) {
      for (const [disease, info] of Object.entries(knowledgeBase.diseases)) {
        if (input.includes(disease)) {
          return {
            content: `I detected you're asking about **${disease}**. Here's what I recommend:\n\n**Treatment:** ${info.treatment}\n\n**Prevention:** ${info.prevention}\n\nThis is a ${info.urgency} priority issue. Would you like me to connect you with a local expert?`,
            metadata: { 
              confidence: 95, 
              suggestions: ["Connect with expert", "Show prevention tips", "Upload crop image"] 
            }
          };
        }
      }
      return {
        content: "I can help with crop diseases! Please describe the symptoms you're seeing, or upload an image of the affected plant for better analysis.",
        metadata: { confidence: 80, suggestions: ["Upload image", "Describe symptoms"] }
      };
    }

    // Fertilizer queries
    if (input.includes('fertilizer') || input.includes('nutrient')) {
      for (const [crop, recommendation] of Object.entries(knowledgeBase.fertilizers)) {
        if (input.includes(crop)) {
          return {
            content: `For **${crop}** cultivation, here's my fertilizer recommendation:\n\n${recommendation}\n\nAlways conduct a soil test before applying fertilizers for best results.`,
            metadata: { confidence: 90, suggestions: ["Soil testing guide", "Organic alternatives"] }
          };
        }
      }
      return {
        content: "I can help with fertilizer recommendations! Which crop are you growing? Also, have you done a recent soil test?",
        metadata: { confidence: 85, suggestions: ["Rice fertilizer", "Wheat fertilizer", "Tomato fertilizer"] }
      };
    }

    // General farming queries
    for (const [topic, advice] of Object.entries(knowledgeBase.general)) {
      if (input.includes(topic)) {
        return {
          content: `Here's my advice on **${topic}**:\n\n${advice}\n\nWould you like more specific information about this topic?`,
          metadata: { confidence: 88, suggestions: ["More details", "Related topics"] }
        };
      }
    }

    // Crop-specific queries
    const crops = ["tomato", "wheat", "rice", "maize", "cotton", "potato"];
    const mentionedCrop = crops.find(crop => input.includes(crop));
    if (mentionedCrop) {
      return {
        content: `I can help with **${mentionedCrop}** cultivation! Are you looking for information about:\n\n• Disease management\n• Fertilizer recommendations\n• Irrigation schedule\n• Harvest timing\n• Market prices\n\nWhat specific aspect would you like to know about?`,
        metadata: { 
          confidence: 85, 
          suggestions: [`${mentionedCrop} diseases`, `${mentionedCrop} fertilizer`, `${mentionedCrop} irrigation`] 
        }
      };
    }

    // Default response
    return {
      content: "I'm here to help with all your agricultural questions! You can ask me about:\n\n🌱 **Crop diseases and treatments**\n🧪 **Fertilizer recommendations**\n💧 **Irrigation and water management**\n🌾 **Crop selection and rotation**\n📊 **Market prices and trends**\n📸 **Image analysis for disease detection**\n\nWhat would you like to know?",
      metadata: { 
        confidence: 75, 
        suggestions: ["Disease identification", "Fertilizer guide", "Upload crop image"] 
      }
    };
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: selectedImage ? `[Image uploaded] ${input}` : input,
      timestamp: new Date(),
      metadata: selectedImage ? { imageAnalysis: true } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      let responseData;
      
      if (selectedImage) {
        // Mock image analysis response
        responseData = {
          content: "I've analyzed your crop image. I can see signs of **leaf blight** with 92% confidence. The yellowing and brown spots on the leaves are characteristic symptoms.\n\n**Immediate Actions:**\n1. Remove affected leaves immediately\n2. Apply copper-based fungicide\n3. Improve drainage around plants\n4. Increase air circulation\n\n**Prevention:**\n- Water at soil level, not on leaves\n- Apply preventive fungicide spray\n- Use disease-resistant varieties next season",
          metadata: { 
            confidence: 92, 
            suggestions: ["Show treatment products", "Connect with expert", "Prevention guide"],
            imageAnalysis: true
          }
        };
      } else {
        responseData = generateResponse(input);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseData.content,
        timestamp: new Date(),
        metadata: responseData.metadata
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setInput("");
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      toast({
        title: "Image Selected",
        description: `${file.name} is ready for analysis`
      });
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak your question now"
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Please try again or type your question",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Please type your question",
        variant: "destructive"
      });
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to Clipboard",
      description: "Message content copied successfully"
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Agricultural Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'bot' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      {message.content.split('\n').map((line, index) => (
                        <p key={index} className="mb-1 last:mb-0">
                          {line.includes('**') ? (
                            line.split('**').map((part, i) => 
                              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                            )
                          ) : line}
                        </p>
                      ))}
                    </div>
                    
                    {message.metadata?.imageAnalysis && (
                      <Badge variant="outline" className="mt-2">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Image Analysis
                      </Badge>
                    )}
                  </div>
                  
                  {message.metadata?.confidence && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Confidence: {message.metadata.confidence}%
                    </div>
                  )}
                  
                  {message.metadata?.suggestions && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {message.metadata.suggestions.map((suggestion: string, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setInput(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {message.type === 'bot' && (
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center order-1">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          {selectedImage && (
            <div className="mb-3 p-2 bg-muted rounded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">{selectedImage.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove
              </Button>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about crops, diseases, fertilizers..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={startVoiceRecognition}
              disabled={isListening}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button onClick={handleSend} disabled={isLoading || (!input.trim() && !selectedImage)}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};