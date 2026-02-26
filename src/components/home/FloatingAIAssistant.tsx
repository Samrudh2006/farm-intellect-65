import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Simple local AI responses for the homepage assistant (no backend needed)
const getLocalResponse = (input: string, lang: string): string => {
  const lower = input.toLowerCase();
  
  const responses: Record<string, Record<string, string>> = {
    crop: {
      en: "🌾 For crop selection, consider your soil type, climate zone, and water availability. Popular Kharif crops include Rice, Maize, and Cotton. Rabi crops include Wheat, Mustard, and Chickpea. Would you like specific advice for your region?",
      hi: "🌾 फसल चयन के लिए, अपनी मिट्टी का प्रकार, जलवायु क्षेत्र, और पानी की उपलब्धता पर विचार करें। लोकप्रिय खरीफ फसलों में धान, मक्का और कपास शामिल हैं।",
      bn: "🌾 ফসল নির্বাচনের জন্য, আপনার মাটির ধরন, জলবায়ু অঞ্চল এবং জলের প্রাপ্যতা বিবেচনা করুন।",
      te: "🌾 పంట ఎంపిక కోసం, మీ నేల రకం, వాతావరణ మండలం మరియు నీటి లభ్యతను పరిగణించండి.",
      ta: "🌾 பயிர் தேர்வுக்கு, உங்கள் மண் வகை, காலநிலை மண்டலம் மற்றும் நீர் கிடைக்கும் தன்மையை கருத்தில் கொள்ளுங்கள்.",
    },
    weather: {
      en: "🌤️ Weather monitoring is crucial for farming. I recommend checking daily forecasts and setting up alerts for extreme weather. Our platform provides hyperlocal weather data for your exact field location!",
      hi: "🌤️ खेती के लिए मौसम निगरानी बहुत महत्वपूर्ण है। मैं दैनिक पूर्वानुमान जांचने और चरम मौसम के लिए अलर्ट सेट करने की सलाह देता हूं।",
      bn: "🌤️ চাষের জন্য আবহাওয়া পর্যবেক্ষণ অত্যন্ত গুরুত্বপূর্ণ।",
      te: "🌤️ వ్యవసాయానికి వాతావరణ పర్యవేక్షణ చాలా ముఖ్యం.",
      ta: "🌤️ விவசாயத்திற்கு வானிலை கண்காணிப்பு மிக முக்கியம்.",
    },
    soil: {
      en: "🌍 Soil health is the foundation of good farming. Get your soil tested for pH, nitrogen, phosphorus, and potassium levels. We recommend testing at least twice a year - before Kharif and Rabi seasons.",
      hi: "🌍 मिट्टी का स्वास्थ्य अच्छी खेती की नींव है। pH, नाइट्रोजन, फॉस्फोरस और पोटैशियम स्तरों के लिए अपनी मिट्टी की जांच कराएं।",
      bn: "🌍 মাটির স্বাস্থ্য ভালো চাষের ভিত্তি।",
      te: "🌍 నేల ఆరోగ్యం మంచి వ్యవసాయానికి పునాది.",
      ta: "🌍 மண் ஆரோக்கியம் நல்ல விவசாயத்தின் அடித்தளம்.",
    },
    pest: {
      en: "🐛 For pest management, use Integrated Pest Management (IPM) techniques. Start with biological controls, use neem-based organic pesticides, and resort to chemical pesticides only as a last option. Our AI Scanner can identify pests from photos!",
      hi: "🐛 कीट प्रबंधन के लिए, एकीकृत कीट प्रबंधन (IPM) तकनीकों का उपयोग करें।",
      bn: "🐛 কীটপতঙ্গ ব্যবস্থাপনার জন্য, সমন্বিত কীটপতঙ্গ ব্যবস্থাপনা (IPM) কৌশল ব্যবহার করুন।",
      te: "🐛 తెగులు నిర్వహణ కోసం, సమగ్ర తెగులు నిర్వహణ (IPM) పద్ధతులను ఉపయోగించండి.",
      ta: "🐛 பூச்சி மேலாண்மைக்கு, ஒருங்கிணைந்த பூச்சி மேலாண்மை (IPM) நுட்பங்களைப் பயன்படுத்துங்கள்.",
    },
    default: {
      en: "🙏 I'm your Smart Crop Advisory AI assistant! I can help with:\n\n🌾 **Crop Selection** - Best crops for your region\n🌤️ **Weather Guidance** - Farming weather tips\n🌍 **Soil Health** - Testing & improvement\n🐛 **Pest Control** - IPM techniques\n📈 **Market Prices** - Current mandi rates\n\nSign in to access the full AI-powered dashboard!",
      hi: "🙏 मैं आपका स्मार्ट क्रॉप एडवाइजरी AI सहायक हूं! मैं इसमें मदद कर सकता हूं:\n\n🌾 **फसल चयन**\n🌤️ **मौसम मार्गदर्शन**\n🌍 **मिट्टी स्वास्थ्य**\n🐛 **कीट नियंत्रण**\n📈 **बाजार भाव**",
      bn: "🙏 আমি আপনার স্মার্ট ক্রপ অ্যাডভাইজরি AI সহায়ক!",
      te: "🙏 నేను మీ స్మార్ట్ క్రాప్ అడ్వైజరీ AI సహాయకుడిని!",
      ta: "🙏 நான் உங்கள் ஸ்மார்ட் க்ராப் அட்வைசரி AI உதவியாளர்!",
    },
  };

  let key = "default";
  if (lower.includes("crop") || lower.includes("फसल") || lower.includes("பயிர்") || lower.includes("పంట") || lower.includes("ফসল")) key = "crop";
  else if (lower.includes("weather") || lower.includes("मौसम") || lower.includes("வானிலை") || lower.includes("వాతావరణ") || lower.includes("আবহাওয়া")) key = "weather";
  else if (lower.includes("soil") || lower.includes("मिट्टी") || lower.includes("மண்") || lower.includes("నేల") || lower.includes("মাটি")) key = "soil";
  else if (lower.includes("pest") || lower.includes("कीट") || lower.includes("பூச்சி") || lower.includes("తెగులు") || lower.includes("কীট")) key = "pest";

  return responses[key]?.[lang] || responses[key]?.en || responses.default.en;
};

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getLocalResponse(userMsg.content, language);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-accent to-primary text-white hover:shadow-2xl"
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Bot className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-accent/30 pointer-events-none" />
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-accent to-primary text-white flex items-center gap-3">
              <AshokaChakra size={28} className="[&_circle]:fill-white [&_line]:stroke-white" />
              <div>
                <h3 className="font-bold text-sm">{t('ai.title')}</h3>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Smart Crop Advisory
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[320px]">
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <AshokaChakra size={40} className="mx-auto" />
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{t('ai.greeting')}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 px-4 py-3 bg-muted rounded-2xl rounded-bl-md w-fit">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('ai.placeholder')}
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
