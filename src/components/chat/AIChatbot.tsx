import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Trash2,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface AIResponse {
  suggestions?: string[];
  confidence?: number;
  sources?: string[];
}

export const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage: Message = {
    id: "welcome",
    content: "Hello! I'm your AI farming assistant. I can help you with crop management, pest control, weather advice, market prices, and more. What would you like to know?",
    type: "assistant",
    timestamp: new Date()
  };

  useEffect(() => {
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Mock AI response generation based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('insect')) {
      return "For pest control, I recommend integrated pest management (IPM). First, identify the specific pest affecting your crops. Common solutions include:\n\n🌱 **Organic methods**: Neem oil, beneficial insects, companion planting\n🧪 **Chemical control**: Use targeted insecticides only when necessary\n📊 **Monitoring**: Regular field inspections and pheromone traps\n\nWhat specific pest are you dealing with? I can provide more targeted advice.";
    }
    
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
      return "Fertilizer management is crucial for optimal crop growth. Here's my recommendation:\n\n🧪 **Soil Testing**: Always start with soil analysis to understand nutrient levels\n📊 **NPK Balance**: Most crops need Nitrogen (N), Phosphorus (P), and Potassium (K)\n🌱 **Organic Options**: Compost, manure, and bio-fertilizers improve soil health\n⏰ **Timing**: Apply based on crop growth stages\n\nWhat crop are you growing? I can suggest specific fertilizer schedules.";
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('drought')) {
      return "Weather management is essential for successful farming:\n\n🌧️ **Rainfall**: Monitor forecasts and plan irrigation accordingly\n☀️ **Temperature**: Protect crops from extreme heat or cold\n💨 **Wind**: Use windbreaks to protect delicate crops\n📱 **Technology**: Use weather apps and local meteorological data\n\nWould you like specific advice for weather protection strategies?";
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
      return "Crop selection and management tips:\n\n🌾 **Season Planning**: Choose crops suitable for your climate and season\n🚰 **Water Management**: Ensure proper irrigation based on crop requirements\n🌱 **Spacing**: Follow recommended plant spacing for optimal growth\n📅 **Schedule**: Plan planting and harvesting calendar\n\nWhat specific crops are you interested in growing? I can provide detailed guidance.";
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('sell')) {
      return "Market insights and pricing strategies:\n\n📈 **Price Tracking**: Monitor daily market rates in your area\n🏪 **Direct Sales**: Consider farmers' markets and direct-to-consumer sales\n📊 **Quality**: Higher quality crops command better prices\n⏰ **Timing**: Plan harvest timing based on market demand\n\nWould you like current market price information for specific crops?";
    }
    
    return "I understand you're asking about farming. While I can help with many agricultural topics including:\n\n• Crop management and planning\n• Pest and disease control\n• Fertilizer and soil management\n• Weather-related advice\n• Market information\n• Irrigation strategies\n\nCould you please be more specific about what you'd like to know? This helps me provide more accurate and useful advice.";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      type: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: "typing",
      content: "AI is thinking...",
      type: "assistant",
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = await generateAIResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        type: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => prev.filter(m => m.id !== "typing").concat(assistantMessage));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
        type: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => prev.filter(m => m.id !== "typing").concat(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([initialMessage]);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const quickQuestions = [
    "How to control pests in wheat crop?",
    "Best fertilizer for tomatoes?", 
    "When to plant rice in monsoon season?",
    "Current market prices for vegetables?",
    "How to improve soil fertility?"
  ];

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Farming Assistant</CardTitle>
              <CardDescription>
                Get expert advice on crops, pests, weather, and more
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="h-8 w-8 p-0"
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] space-y-2 ${message.type === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span className="text-sm">{message.content}</span>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                
                {!message.isTyping && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.type === 'assistant' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(message.content)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-muted/30">
            <h4 className="text-sm font-medium mb-2">Quick Questions:</h4>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(question)}
                  className="text-xs"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about farming..."
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsListening(!isListening)}
                disabled={isLoading}
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <Badge variant="secondary" className="text-xs">
              AI Assistant
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};