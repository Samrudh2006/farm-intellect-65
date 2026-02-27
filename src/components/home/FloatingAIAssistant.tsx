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

const knowledgeBase: Record<string, Record<string, string>> = {
  // Crop-related queries
  crop_general: {
    en: "🌾 **Crop Selection Guide:**\n\n**Kharif (June–Oct):** Rice, Maize, Cotton, Soybean, Groundnut, Sugarcane\n**Rabi (Nov–Mar):** Wheat, Mustard, Chickpea, Barley, Pea, Lentil\n**Zaid (Mar–Jun):** Watermelon, Muskmelon, Cucumber, Moong Dal\n\nChoose based on your soil type, water availability, and local climate. Need specific advice? Tell me your region!",
    hi: "🌾 **फसल चयन गाइड:**\n\n**खरीफ (जून–अक्टूबर):** धान, मक्का, कपास, सोयाबीन, मूंगफली, गन्ना\n**रबी (नवंबर–मार्च):** गेहूं, सरसों, चना, जौ, मटर, मसूर\n**जायद (मार्च–जून):** तरबूज, खरबूजा, खीरा, मूंग दाल\n\nअपनी मिट्टी, पानी की उपलब्धता और जलवायु के अनुसार चुनें।",
    bn: "🌾 **ফসল নির্বাচন গাইড:**\n\n**খরিফ (জুন–অক্টো):** ধান, ভুট্টা, তুলা, সয়াবিন\n**রবি (নভে–মার্চ):** গম, সরিষা, ছোলা, যব\n**জায়েদ (মার্চ–জুন):** তরমুজ, ক্ষীরা\n\nআপনার মাটি ও জলবায়ু অনুযায়ী নির্বাচন করুন।",
    te: "🌾 **పంట ఎంపిక గైడ్:**\n\n**ఖరీఫ్:** వరి, మొక్కజొన్న, పత్తి\n**రబీ:** గోధుమ, ఆవాలు, శనగలు\n\nమీ నేల రకం ప్రకారం ఎంచుకోండి.",
    ta: "🌾 **பயிர் தேர்வு வழிகாட்டி:**\n\n**காரிஃப்:** நெல், மக்காச்சோளம், பருத்தி\n**ரபி:** கோதுமை, கடுகு, கொண்டைக்கடலை\n\nமண் வகை படி தேர்வு செய்யுங்கள்.",
  },
  wheat: {
    en: "🌾 **Wheat Cultivation Guide:**\n\n• **Season:** Rabi (November–March)\n• **Soil:** Well-drained loamy soil, pH 6.0–7.5\n• **Seed rate:** 100–125 kg/hectare\n• **Irrigation:** 4–6 irrigations needed\n• **Fertilizer:** NPK 120:60:40 kg/ha\n• **Harvest:** 120–150 days after sowing\n• **Top varieties:** HD-2967, PBW-550, WH-1105\n\nPro tip: Sow before November 25 for best yields!",
    hi: "🌾 **गेहूं खेती गाइड:**\n\n• **मौसम:** रबी (नवंबर–मार्च)\n• **मिट्टी:** दोमट, pH 6.0–7.5\n• **बीज:** 100–125 किग्रा/हेक्टेयर\n• **सिंचाई:** 4–6 बार\n• **उर्वरक:** NPK 120:60:40 किग्रा/हेक्टेयर\n\n25 नवंबर से पहले बुवाई करें!",
  },
  rice: {
    en: "🌾 **Rice Cultivation Guide:**\n\n• **Season:** Kharif (June–October)\n• **Soil:** Clayey, water-retentive soil\n• **Seed rate:** 20–25 kg/hectare (transplanting)\n• **Water:** Standing water 5cm during tillering\n• **Fertilizer:** NPK 120:60:60 kg/ha\n• **Harvest:** 120–140 days\n• **Top varieties:** Pusa Basmati-1, IR-64, Swarna\n\nPro tip: Use SRI (System of Rice Intensification) for 20–30% higher yield!",
    hi: "🌾 **धान खेती गाइड:**\n\n• **मौसम:** खरीफ (जून–अक्टूबर)\n• **मिट्टी:** चिकनी, जल-धारण वाली\n• **बीज:** 20–25 किग्रा/हेक्टेयर\n• **उर्वरक:** NPK 120:60:60 किग्रा/हेक्टेयर\n\nSRI पद्धति से 20–30% अधिक उपज!",
  },
  weather: {
    en: "🌤️ **Weather Tips for Farming:**\n\n• Check daily forecasts before field work\n• Set alerts for frost, hail, and heavy rain\n• **Monsoon (Jun–Sep):** Plan drainage, avoid waterlogging\n• **Winter (Nov–Feb):** Protect crops from frost with mulching\n• **Summer (Mar–May):** Increase irrigation frequency\n\nOur platform provides hyperlocal weather data for your exact location. Sign in to access!",
    hi: "🌤️ **खेती के लिए मौसम टिप्स:**\n\n• खेत में काम से पहले दैनिक पूर्वानुमान जांचें\n• पाला, ओला और भारी बारिश के लिए अलर्ट सेट करें\n• **मानसून:** जल-निकासी की योजना बनाएं\n• **सर्दी:** मल्चिंग से पाले से बचाव\n• **गर्मी:** सिंचाई बढ़ाएं",
    bn: "🌤️ **চাষের জন্য আবহাওয়া টিপস:**\n\n• মাঠে কাজের আগে দৈনিক পূর্বাভাস দেখুন\n• তুষারপাত ও ভারী বৃষ্টির জন্য সতর্কতা সেট করুন",
    te: "🌤️ **వ్యవసాయానికి వాతావరణ చిట్కాలు:**\n\n• పొలంలో పని ముందు రోజువారీ అంచనాలు తనిఖీ చేయండి",
    ta: "🌤️ **விவசாயத்திற்கு வானிலை குறிப்புகள்:**\n\n• வயலில் வேலைக்கு முன் தினசரி முன்னறிவிப்பைப் பாருங்கள்",
  },
  soil: {
    en: "🌍 **Soil Health Guide:**\n\n• **Testing:** Get tested at your nearest Krishi Vigyan Kendra (KVK)\n• **pH:** Ideal range 6.0–7.5 for most crops\n• **Nutrients:** Check N, P, K, and micronutrients\n• **Organic matter:** Add compost, vermicompost, or green manure\n• **Soil types:**\n  - Alluvial: Best for wheat, rice, sugarcane\n  - Black: Best for cotton, soybean\n  - Red: Best for groundnut, millets\n  - Laterite: Best for tea, coffee, cashew\n\nTest at least twice a year — before Kharif and Rabi seasons.",
    hi: "🌍 **मिट्टी स्वास्थ्य गाइड:**\n\n• **परीक्षण:** नजदीकी कृषि विज्ञान केंद्र (KVK) में कराएं\n• **pH:** 6.0–7.5 आदर्श\n• **जैविक पदार्थ:** कम्पोस्ट, वर्मीकम्पोस्ट जोड़ें\n• **मिट्टी के प्रकार:**\n  - जलोढ़: गेहूं, धान, गन्ने के लिए\n  - काली: कपास, सोयाबीन के लिए\n  - लाल: मूंगफली, बाजरा के लिए",
  },
  pest: {
    en: "🐛 **Pest Management Guide (IPM):**\n\n**Step 1 — Prevention:**\n• Crop rotation and intercropping\n• Use resistant varieties\n• Clean field borders\n\n**Step 2 — Biological Control:**\n• Trichogramma cards for stem borer\n• Neem oil spray (5ml/litre)\n• Pheromone traps\n\n**Step 3 — Chemical (last resort):**\n• Follow recommended dosage strictly\n• Spray early morning or evening\n• Maintain safe harvest interval\n\nOur AI Crop Scanner can identify pests from photos! Sign in to try it.",
    hi: "🐛 **कीट प्रबंधन गाइड (IPM):**\n\n**चरण 1 — रोकथाम:**\n• फसल चक्र और अंतर-फसल\n• प्रतिरोधी किस्में उपयोग करें\n\n**चरण 2 — जैविक नियंत्रण:**\n• ट्राइकोग्रामा कार्ड\n• नीम तेल स्प्रे (5ml/लीटर)\n\n**चरण 3 — रासायनिक (अंतिम उपाय):**\n• अनुशंसित मात्रा का पालन करें",
  },
  fertilizer: {
    en: "🧪 **Fertilizer Guide:**\n\n**General NPK Recommendations:**\n• Wheat: 120:60:40 kg/ha\n• Rice: 120:60:60 kg/ha\n• Cotton: 120:60:60 kg/ha\n• Sugarcane: 150:80:60 kg/ha\n\n**Application Tips:**\n• Apply nitrogen in 2–3 split doses\n• Apply phosphorus and potash at sowing\n• Use soil test results for precise dosage\n• Consider organic alternatives: vermicompost, FYM, green manure\n\n⚠️ Always get soil tested first for accurate recommendations!",
    hi: "🧪 **उर्वरक गाइड:**\n\n**सामान्य NPK अनुशंसा:**\n• गेहूं: 120:60:40 किग्रा/हेक्टेयर\n• धान: 120:60:60 किग्रा/हेक्टेयर\n\n**टिप्स:**\n• नाइट्रोजन 2–3 बार में दें\n• बुवाई के समय फॉस्फोरस व पोटाश दें\n• मिट्टी परीक्षण के आधार पर सही मात्रा दें",
  },
  market: {
    en: "📈 **Market Price Tips:**\n\n• Check current mandi prices before selling\n• Compare prices across 3–4 nearby mandis\n• **Best selling times:**\n  - Wheat: April–May (post-harvest peak)\n  - Rice: November–December\n  - Cotton: December–February\n• Consider warehousing for better prices\n• Register on e-NAM for transparent trading\n• Government MSP ensures minimum prices\n\nSign in to see live mandi rates for your region!",
    hi: "📈 **बाजार भाव टिप्स:**\n\n• बेचने से पहले मंडी भाव जांचें\n• 3–4 नजदीकी मंडियों के भाव तुलना करें\n• e-NAM पर पंजीकरण करें\n• MSP से नीचे न बेचें",
  },
  scheme: {
    en: "🏛️ **Government Schemes for Farmers:**\n\n• **PM-KISAN:** ₹6,000/year direct income support\n• **PM Fasal Bima Yojana:** Crop insurance at low premium\n• **Kisan Credit Card:** Easy farm credit at 4% interest\n• **Soil Health Card:** Free soil testing\n• **PM Krishi Sinchai Yojana:** Irrigation support\n• **e-NAM:** National online trading platform\n\nSign in to check your eligibility and apply directly!",
    hi: "🏛️ **किसानों के लिए सरकारी योजनाएं:**\n\n• **PM-KISAN:** ₹6,000/वर्ष सीधी आय सहायता\n• **PM फसल बीमा योजना:** कम प्रीमियम पर फसल बीमा\n• **किसान क्रेडिट कार्ड:** 4% ब्याज पर कृषि ऋण\n• **मृदा स्वास्थ्य कार्ड:** मुफ्त मिट्टी परीक्षण",
  },
  irrigation: {
    en: "💧 **Irrigation Guide:**\n\n• **Drip Irrigation:** Best for fruits, vegetables — saves 30–50% water\n• **Sprinkler:** Good for wheat, pulses\n• **Flood/Furrow:** Traditional, higher water usage\n\n**Water Management Tips:**\n• Irrigate early morning or evening to reduce evaporation\n• Use mulching to retain soil moisture\n• Monitor soil moisture before irrigating\n• Adopt rainwater harvesting\n\nSubsidy available under PM Krishi Sinchai Yojana — up to 55%!",
    hi: "💧 **सिंचाई गाइड:**\n\n• **ड्रिप सिंचाई:** फल, सब्जियों के लिए — 30–50% पानी बचत\n• **स्प्रिंकलर:** गेहूं, दालों के लिए\n• सुबह या शाम सिंचाई करें\n• मल्चिंग से नमी बनाए रखें\n\nPM कृषि सिंचाई योजना से 55% तक सब्सिडी!",
  },
  default: {
    en: "🙏 **Namaste! I'm your Smart Crop Advisory AI assistant!**\n\nI can help you with:\n\n🌾 **Crop Selection** — Best crops for your region & season\n🌤️ **Weather Guidance** — Farming weather tips\n🌍 **Soil Health** — Testing & improvement advice\n🐛 **Pest Control** — IPM techniques & solutions\n🧪 **Fertilizer** — NPK recommendations by crop\n📈 **Market Prices** — Mandi rates & selling tips\n💧 **Irrigation** — Water management & subsidies\n🏛️ **Government Schemes** — PM-KISAN, insurance & more\n\nJust type your question! For example: \"How to grow wheat?\" or \"Best fertilizer for rice\"",
    hi: "🙏 **नमस्ते! मैं आपका स्मार्ट क्रॉप एडवाइजरी AI सहायक हूं!**\n\nमैं इसमें मदद कर सकता हूं:\n\n🌾 **फसल चयन** — आपके क्षेत्र के लिए सर्वोत्तम फसलें\n🌤️ **मौसम मार्गदर्शन** — खेती मौसम टिप्स\n🌍 **मिट्टी स्वास्थ्य** — परीक्षण और सुधार\n🐛 **कीट नियंत्रण** — IPM तकनीकें\n🧪 **उर्वरक** — फसल अनुसार NPK\n📈 **बाजार भाव** — मंडी दरें\n💧 **सिंचाई** — जल प्रबंधन\n🏛️ **सरकारी योजनाएं** — PM-KISAN और अन्य\n\nबस अपना सवाल टाइप करें!",
    bn: "🙏 **নমস্কার! আমি আপনার স্মার্ট ক্রপ অ্যাডভাইজরি AI সহায়ক!**\n\nআমি সাহায্য করতে পারি:\n🌾 ফসল নির্বাচন\n🌤️ আবহাওয়া\n🌍 মাটি স্বাস্থ্য\n🐛 কীটপতঙ্গ নিয়ন্ত্রণ\n📈 বাজার দর\n\nআপনার প্রশ্ন টাইপ করুন!",
    te: "🙏 **నమస్కారం! నేను మీ స్మార్ట్ క్రాప్ అడ్వైజరీ AI సహాయకుడిని!**\n\nనేను సహాయం చేయగలను:\n🌾 పంట ఎంపిక\n🌤️ వాతావరణం\n🌍 నేల ఆరోగ్యం\n🐛 తెగులు నియంత్రణ\n📈 మార్కెట్ ధరలు\n\nమీ ప్రశ్న టైప్ చేయండి!",
    ta: "🙏 **வணக்கம்! நான் உங்கள் ஸ்மார்ட் க்ராப் அட்வைசரி AI உதவியாளர்!**\n\nநான் உதவ முடியும்:\n🌾 பயிர் தேர்வு\n🌤️ வானிலை\n🌍 மண் ஆரோக்கியம்\n🐛 பூச்சி கட்டுப்பாடு\n📈 சந்தை விலைகள்\n\nஉங்கள் கேள்வியை டைப் செய்யுங்கள்!",
  },
};

const getSmartResponse = (input: string, lang: string): string => {
  const lower = input.toLowerCase();

  // Specific crop queries
  if (lower.includes("wheat") || lower.includes("गेहूं") || lower.includes("গম") || lower.includes("గోధుమ") || lower.includes("கோதுமை")) {
    return knowledgeBase.wheat[lang] || knowledgeBase.wheat.en;
  }
  if (lower.includes("rice") || lower.includes("paddy") || lower.includes("धान") || lower.includes("ধান") || lower.includes("వరి") || lower.includes("நெல்")) {
    return knowledgeBase.rice[lang] || knowledgeBase.rice.en;
  }

  // Topic matching
  const topics: [string[], string][] = [
    [["crop", "फसल", "ফসল", "పంట", "பயிர்", "seed", "बीज", "sow", "बुवाई", "harvest", "कटाई"], "crop_general"],
    [["weather", "rain", "मौसम", "बारिश", "আবহাওয়া", "বৃষ্টি", "వాతావరణ", "வானிலை", "frost", "पाला", "monsoon"], "weather"],
    [["soil", "मिट्टी", "মাটি", "నేల", "மண்", "ph", "organic", "compost"], "soil"],
    [["pest", "insect", "कीट", "कीड़ा", "disease", "रोग", "blight", "fungus", "পোকা", "তেগুলু", "பூச்சி"], "pest"],
    [["fertilizer", "fertiliser", "उर्वरक", "खाद", "npk", "urea", "dap", "সার", "ఎరువు", "உரம்"], "fertilizer"],
    [["market", "price", "mandi", "भाव", "मंडी", "बाजार", "sell", "বাজার", "మార్కెట్", "சந்தை", "msm"], "market"],
    [["scheme", "government", "sarkari", "योजना", "सरकार", "pm-kisan", "kisan", "subsidy", "সরকার", "ప్రభుత్వ", "அரசு", "insurance", "बीमा"], "scheme"],
    [["irrigation", "water", "सिंचाई", "पानी", "drip", "sprinkler", "জল", "সেচ", "నీటి", "நீர்"], "irrigation"],
  ];

  for (const [keywords, topic] of topics) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return knowledgeBase[topic]?.[lang] || knowledgeBase[topic]?.en || knowledgeBase.default.en;
    }
  }

  // Greeting detection
  if (lower.match(/^(hi|hello|hey|namaste|namaskar|vanakkam|नमस्ते|নমস্কার|வணக்கம்|నమస్కారం)/)) {
    return knowledgeBase.default[lang] || knowledgeBase.default.en;
  }

  return knowledgeBase.default[lang] || knowledgeBase.default.en;
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

    setTimeout(() => {
      const response = getSmartResponse(userMsg.content, language);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <>
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
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-accent/30 pointer-events-none" />
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-accent to-primary text-white flex items-center gap-3">
              <AshokaChakra size={28} className="[&_circle]:fill-white [&_line]:stroke-white" />
              <div>
                <h3 className="font-bold text-sm">{t("ai.title")}</h3>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Smart Crop Advisory
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[260px] max-h-[340px]">
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <AshokaChakra size={40} className="mx-auto" />
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {t("ai.greeting")}
                  </p>
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

            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("ai.placeholder")}
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
