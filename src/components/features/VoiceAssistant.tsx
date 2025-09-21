import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VoiceAssistant = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'hi-IN'; // Hindi
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleVoiceQuery(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Could not understand. Please try again.",
          variant: "destructive"
        });
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      setTranscript("");
      recognition.start();
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Voice recognition is not supported in this browser",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleVoiceQuery = (query: string) => {
    // Mock AI responses in Hindi/Punjabi
    const responses = {
      "weather": "आज का मौसम अच्छा है। तापमान 25 डिग्री है और बारिश की संभावना कम है।",
      "crop": "गेहूं की बुआई के लिए यह सही समय है। मिट्टी तैयार करें और बीज उपचार करें।",
      "price": "आज गेहूं का भाव 2500 रुपये प्रति क्विंटल है। कपास 6200 रुपये में बिक रहा है।",
      "fertilizer": "यूरिया का उपयोग करें। 50 किलो प्रति एकड़ की दर से डालें।",
      "disease": "पत्तियों पर दाग हैं तो फंगीसाइड का छिड़काव करें। नीम का तेल भी उपयोगी है।"
    };

    let aiResponse = "मैं आपकी मदद करने के लिए यहाँ हूँ। कृपया अपना सवाल दोहराएं।";
    
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("मौसम") || lowerQuery.includes("weather")) {
      aiResponse = responses.weather;
    } else if (lowerQuery.includes("फसल") || lowerQuery.includes("crop")) {
      aiResponse = responses.crop;
    } else if (lowerQuery.includes("भाव") || lowerQuery.includes("price")) {
      aiResponse = responses.price;
    } else if (lowerQuery.includes("खाद") || lowerQuery.includes("fertilizer")) {
      aiResponse = responses.fertilizer;
    } else if (lowerQuery.includes("बीमारी") || lowerQuery.includes("disease")) {
      aiResponse = responses.disease;
    }

    setResponse(aiResponse);
    speakResponse(aiResponse);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Assistant (आवाज सहायक)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="w-32"
            >
              {isListening ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Listen
                </>
              )}
            </Button>
            
            <Button
              onClick={isSpeaking ? stopSpeaking : () => speakResponse(response)}
              variant={isSpeaking ? "destructive" : "outline"}
              size="lg"
              className="w-32"
              disabled={!response}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-5 w-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="h-5 w-5 mr-2" />
                  Speak
                </>
              )}
            </Button>
          </div>

          {isListening && (
            <div className="animate-pulse text-red-500 font-semibold">
              🎤 Listening... (सुन रहा हूँ...)
            </div>
          )}
        </div>

        {transcript && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-700">You said:</div>
            <div className="text-blue-600">{transcript}</div>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-700">AI Response:</div>
            <div className="text-green-600">{response}</div>
          </div>
        )}

        <div className="text-sm text-muted-foreground text-center">
          <p>Try asking:</p>
          <ul className="mt-2 space-y-1">
            <li>"आज का मौसम कैसा है?" (Weather)</li>
            <li>"गेहूं का भाव क्या है?" (Crop prices)</li>
            <li>"फसल में बीमारी है" (Disease diagnosis)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};