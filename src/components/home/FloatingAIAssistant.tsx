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

/* ── Comprehensive Agricultural Knowledge Base ── */
const kb: Record<string, Record<string, string>> = {
  wheat: {
    en: "🌾 **Wheat Cultivation Guide**\n\n• **Season:** Rabi (November–March)\n• **Soil:** Well-drained loamy, pH 6.0–7.5\n• **Seed rate:** 100–125 kg/hectare\n• **Irrigation:** 4–6 irrigations\n• **Fertiliser:** NPK 120:60:40 kg/ha\n• **Harvest:** 120–150 days after sowing\n• **Top varieties:** HD-2967, PBW-550, WH-1105\n\n💡 Sow before 25 November for best yields!",
    hi: "🌾 **गेहूं खेती गाइड**\n\n• **मौसम:** रबी (नवंबर–मार्च)\n• **मिट्टी:** दोमट, pH 6.0–7.5\n• **बीज:** 100–125 किग्रा/हेक्टेयर\n• **सिंचाई:** 4–6 बार\n• **उर्वरक:** NPK 120:60:40 किग्रा/हेक्टेयर\n\n💡 25 नवंबर से पहले बुवाई करें!",
    bn: "🌾 **গম চাষ গাইড**\n\n• **মৌসুম:** রবি (নভে–মার্চ)\n• **মাটি:** দোআঁশ, pH 6.0–7.5\n• **বীজ:** 100–125 কেজি/হেক্টর\n\n💡 নভেম্বরের আগে বপন করুন!",
    te: "🌾 **గోధుమ సాగు గైడ్**\n\n• **సీజన్:** రబీ\n• **నేల:** pH 6.0–7.5\n• **విత్తనం:** 100–125 కేజీ/హెక్టార్",
    ta: "🌾 **கோதுமை பயிர் வழிகாட்டி**\n\n• **பருவம்:** ரபி\n• **மண்:** pH 6.0–7.5\n• **விதை:** 100–125 கிகி/ஹெக்டேர்",
  },
  rice: {
    en: "🌾 **Rice Cultivation Guide**\n\n• **Season:** Kharif (June–October)\n• **Soil:** Clayey, water-retentive\n• **Seed rate:** 20–25 kg/ha (transplanting)\n• **Water:** Standing water 5 cm during tillering\n• **Fertiliser:** NPK 120:60:60 kg/ha\n• **Top varieties:** Pusa Basmati-1, IR-64, Swarna\n\n💡 Use SRI method for 20–30% higher yield!",
    hi: "🌾 **धान खेती गाइड**\n\n• **मौसम:** खरीफ (जून–अक्टूबर)\n• **मिट्टी:** चिकनी\n• **बीज:** 20–25 किग्रा/हेक्टेयर\n\n💡 SRI पद्धति से 20–30% अधिक उपज!",
    bn: "🌾 **ধান চাষ গাইড**\n\n• **মৌসুম:** খরিফ (জুন–অক্টো)\n• **মাটি:** এঁটেল\n\n💡 SRI পদ্ধতিতে 20–30% বেশি ফলন!",
    te: "🌾 **వరి సాగు గైడ్**\n\n• **సీజన్:** ఖరీఫ్\n\n💡 SRI పద్ధతి 20–30% ఎక్కువ దిగుబడి!",
    ta: "🌾 **நெல் பயிர் வழிகாட்டி**\n\n• **பருவம்:** காரிஃப்\n\n💡 SRI முறையில் 20–30% கூடுதல் விளைச்சல்!",
  },
  cotton: {
    en: "🧵 **Cotton Cultivation Guide**\n\n• **Season:** Kharif (April–May sowing)\n• **Soil:** Black cotton soil, well-drained\n• **Seed rate:** 15–20 kg/ha\n• **Spacing:** 60×30 cm or 90×45 cm\n• **Fertiliser:** NPK 120:60:60 kg/ha\n• **Major pests:** Bollworm, whitefly, jassid\n• **Top varieties:** Bt Cotton hybrids, Suraj, Anjali\n\n💡 Use pheromone traps for bollworm management!",
    hi: "🧵 **कपास खेती गाइड**\n\n• **मौसम:** खरीफ (अप्रैल–मई बुवाई)\n• **मिट्टी:** काली मिट्टी\n• **प्रमुख कीट:** बॉलवर्म, सफेद मक्खी\n\n💡 बॉलवर्म के लिए फेरोमोन ट्रैप लगाएं!",
  },
  sugarcane: {
    en: "🍬 **Sugarcane Cultivation Guide**\n\n• **Planting:** February–March (Spring), October (Autumn)\n• **Soil:** Well-drained loamy to clay loam\n• **Seed rate:** 40,000–45,000 setts/ha\n• **Fertiliser:** NPK 150:80:60 kg/ha\n• **Irrigation:** 8–10 irrigations\n• **Harvest:** 10–12 months\n• **Top varieties:** Co-0238, CoS-767\n\n💡 Intercrop with wheat or mustard for extra income!",
    hi: "🍬 **गन्ना खेती गाइड**\n\n• **बुवाई:** फरवरी–मार्च\n• **उर्वरक:** NPK 150:80:60 किग्रा/हेक्टेयर\n\n💡 गेहूं या सरसों के साथ अंतर-फसल करें!",
  },
  crop_general: {
    en: "🌾 **Crop Selection Guide**\n\n**Kharif (June–Oct):** Rice, Maize, Cotton, Soybean, Groundnut, Sugarcane\n**Rabi (Nov–Mar):** Wheat, Mustard, Chickpea, Barley, Pea, Lentil\n**Zaid (Mar–Jun):** Watermelon, Muskmelon, Cucumber, Moong Dal\n\nChoose based on your soil type, water availability, and local climate. Tell me your region for specific advice!",
    hi: "🌾 **फसल चयन गाइड**\n\n**खरीफ (जून–अक्टूबर):** धान, मक्का, कपास, सोयाबीन, मूंगफली\n**रबी (नवंबर–मार्च):** गेहूं, सरसों, चना, जौ, मटर\n**जायद (मार्च–जून):** तरबूज, खरबूजा, खीरा, मूंग\n\nअपनी मिट्टी और जलवायु के अनुसार चुनें।",
    bn: "🌾 **ফসল নির্বাচন গাইড**\n\n**খরিফ:** ধান, ভুট্টা, তুলা, সয়াবিন\n**রবি:** গম, সরিষা, ছোলা\n**জায়েদ:** তরমুজ, ক্ষীরা\n\nআপনার মাটি ও জলবায়ু অনুযায়ী নির্বাচন করুন।",
    te: "🌾 **పంట ఎంపిక గైడ్**\n\n**ఖరీఫ్:** వరి, మొక్కజొన్న, పత్తి\n**రబీ:** గోధుమ, ఆవాలు, శనగలు\n\nమీ నేల రకం ప్రకారం ఎంచుకోండి.",
    ta: "🌾 **பயிர் தேர்வு வழிகாட்டி**\n\n**காரிஃப்:** நெல், மக்காச்சோளம், பருத்தி\n**ரபி:** கோதுமை, கடுகு, கொண்டைக்கடலை\n\nமண் வகை படி தேர்வு செய்யுங்கள்.",
  },
  weather: {
    en: "🌤️ **Weather Tips for Farming**\n\n• Check daily forecasts before field work\n• Set alerts for frost, hail, and heavy rain\n• **Monsoon (Jun–Sep):** Plan drainage, avoid waterlogging\n• **Winter (Nov–Feb):** Protect crops from frost with mulching\n• **Summer (Mar–May):** Increase irrigation frequency\n\nSign in to access hyperlocal weather data for your area!",
    hi: "🌤️ **खेती के लिए मौसम टिप्स**\n\n• खेत में काम से पहले दैनिक पूर्वानुमान जांचें\n• पाला, ओला और भारी बारिश के लिए अलर्ट सेट करें\n• **मानसून:** जल-निकासी की योजना बनाएं\n• **सर्दी:** मल्चिंग से पाले से बचाव\n• **गर्मी:** सिंचाई बढ़ाएं",
    bn: "🌤️ **চাষের জন্য আবহাওয়া টিপস**\n\n• মাঠে কাজের আগে দৈনিক পূর্বাভাস দেখুন\n• তুষারপাত ও ভারী বৃষ্টির জন্য সতর্কতা সেট করুন",
    te: "🌤️ **వ్యవసాయానికి వాతావరణ చిట్కాలు**\n\n• పొలంలో పని ముందు రోజువారీ అంచనాలు తనిఖీ చేయండి",
    ta: "🌤️ **விவசாயத்திற்கு வானிலை குறிப்புகள்**\n\n• வயலில் வேலைக்கு முன் தினசரி முன்னறிவிப்புப் பாருங்கள்",
  },
  soil: {
    en: "🌍 **Soil Health Guide**\n\n• **Testing:** Visit your nearest Krishi Vigyan Kendra (KVK)\n• **pH:** Ideal range 6.0–7.5 for most crops\n• **Nutrients:** Check N, P, K, and micro-nutrients\n• **Organic matter:** Add compost, vermicompost, or green manure\n• **Soil types & best crops:**\n  - Alluvial → wheat, rice, sugarcane\n  - Black → cotton, soybean\n  - Red → groundnut, millets\n  - Laterite → tea, coffee, cashew\n\nTest at least twice a year — before Kharif and Rabi seasons.",
    hi: "🌍 **मिट्टी स्वास्थ्य गाइड**\n\n• **परीक्षण:** नजदीकी KVK में कराएं\n• **pH:** 6.0–7.5 आदर्श\n• **जैविक पदार्थ:** कम्पोस्ट, वर्मीकम्पोस्ट जोड़ें\n• **मिट्टी के प्रकार:**\n  - जलोढ़ → गेहूं, धान\n  - काली → कपास, सोयाबीन\n  - लाल → मूंगफली, बाजरा",
    bn: "🌍 **মাটি স্বাস্থ্য গাইড**\n\n• নিকটতম KVK-তে পরীক্ষা করান\n• pH: 6.0–7.5 আদর্শ\n• কম্পোস্ট ও ভার্মিকম্পোস্ট যোগ করুন",
  },
  pest: {
    en: "🐛 **Pest Management Guide (IPM)**\n\n**Step 1 — Prevention:**\n• Crop rotation and intercropping\n• Use resistant varieties\n• Clean field borders\n\n**Step 2 — Biological Control:**\n• Trichogramma cards for stem borer\n• Neem oil spray (5 ml/litre)\n• Pheromone traps\n\n**Step 3 — Chemical (last resort):**\n• Follow recommended dosage strictly\n• Spray early morning or evening\n• Maintain safe harvest interval\n\nOur AI Crop Scanner identifies pests from photos — sign in to try it!",
    hi: "🐛 **कीट प्रबंधन गाइड (IPM)**\n\n**चरण 1 — रोकथाम:**\n• फसल चक्र और अंतर-फसल\n• प्रतिरोधी किस्में उपयोग करें\n\n**चरण 2 — जैविक नियंत्रण:**\n• ट्राइकोग्रामा कार्ड\n• नीम तेल स्प्रे (5 ml/लीटर)\n\n**चरण 3 — रासायनिक (अंतिम उपाय):**\n• अनुशंसित मात्रा का पालन करें",
    bn: "🐛 **কীটপতঙ্গ ব্যবস্থাপনা (IPM)**\n\n• ফসল আবর্তন\n• নিম তেল স্প্রে (5 ml/লিটার)\n• ফেরোমোন ট্র্যাপ ব্যবহার করুন",
  },
  fertilizer: {
    en: "🧪 **Fertiliser Guide**\n\n**General NPK Recommendations:**\n• Wheat: 120:60:40 kg/ha\n• Rice: 120:60:60 kg/ha\n• Cotton: 120:60:60 kg/ha\n• Sugarcane: 150:80:60 kg/ha\n\n**Application Tips:**\n• Apply nitrogen in 2–3 split doses\n• Apply phosphorus and potash at sowing\n• Use soil test results for precise dosage\n• Consider organic alternatives: vermicompost, FYM, green manure\n\n⚠️ Always get soil tested first!",
    hi: "🧪 **उर्वरक गाइड**\n\n• गेहूं: NPK 120:60:40 किग्रा/हेक्टेयर\n• धान: NPK 120:60:60\n• नाइट्रोजन 2–3 बार में दें\n• बुवाई के समय फॉस्फोरस व पोटाश दें\n\n⚠️ पहले मिट्टी परीक्षण करवाएं!",
  },
  market: {
    en: "📈 **Market Price Tips**\n\n• Check current mandi prices before selling\n• Compare prices across 3–4 nearby mandis\n• **Best selling times:**\n  - Wheat: April–May\n  - Rice: November–December\n  - Cotton: December–February\n• Consider warehouse storage for better prices\n• Register on e-NAM for transparent trading\n• Government MSP ensures minimum prices\n\nSign in to see live mandi rates for your region!",
    hi: "📈 **बाजार भाव टिप्स**\n\n• बेचने से पहले मंडी भाव जांचें\n• 3–4 नजदीकी मंडियों के भाव तुलना करें\n• e-NAM पर पंजीकरण करें\n• MSP से नीचे न बेचें",
  },
  scheme: {
    en: "🏛️ **Government Schemes for Farmers**\n\n• **PM-KISAN:** ₹6,000/year direct income support\n• **PM Fasal Bima Yojana:** Crop insurance at low premium\n• **Kisan Credit Card:** Farm credit at 4% interest\n• **Soil Health Card:** Free soil testing\n• **PM Krishi Sinchai Yojana:** Irrigation subsidy\n• **e-NAM:** National online trading platform\n• **NABARD:** Rural development and refinancing\n\nSign in to check your eligibility and apply!",
    hi: "🏛️ **किसानों के लिए सरकारी योजनाएं**\n\n• **PM-KISAN:** ₹6,000/वर्ष सीधी सहायता\n• **PM फसल बीमा:** कम प्रीमियम पर बीमा\n• **किसान क्रेडिट कार्ड:** 4% ब्याज पर ऋण\n• **मृदा स्वास्थ्य कार्ड:** मुफ्त मिट्टी परीक्षण\n• **e-NAM:** ऑनलाइन ट्रेडिंग",
    bn: "🏛️ **কৃষকদের জন্য সরকারি প্রকল্প**\n\n• PM-KISAN: ₹6,000/বছর\n• PM ফসল বীমা: কম প্রিমিয়ামে বীমা\n• কিষাণ ক্রেডিট কার্ড: 4% সুদে ঋণ",
  },
  irrigation: {
    en: "💧 **Irrigation Guide**\n\n• **Drip irrigation:** Best for fruits, vegetables — saves 30–50% water\n• **Sprinkler:** Good for wheat, pulses\n• **Flood/Furrow:** Traditional, higher water usage\n\n**Water Management Tips:**\n• Irrigate early morning or evening\n• Use mulching to retain soil moisture\n• Monitor soil moisture before irrigating\n• Adopt rainwater harvesting\n\n💰 Subsidy up to 55% under PM Krishi Sinchai Yojana!",
    hi: "💧 **सिंचाई गाइड**\n\n• **ड्रिप:** फल, सब्जियों के लिए — 30–50% पानी बचत\n• **स्प्रिंकलर:** गेहूं, दालों के लिए\n• सुबह या शाम सिंचाई करें\n• मल्चिंग से नमी बनाए रखें\n\n💰 PM कृषि सिंचाई योजना से 55% तक सब्सिडी!",
  },
  organic: {
    en: "🌿 **Organic Farming Guide**\n\n• **Compost:** Prepare from crop residues + cow dung\n• **Vermicompost:** Use Eisenia fetida earthworms\n• **Green manure:** Grow dhaincha, sun hemp before main crop\n• **Bio-pesticides:** Neem oil, Trichoderma, Pseudomonas\n• **Certification:** Apply via APEDA/PGS-India\n\n**Benefits:**\n• Premium prices (20–30% higher)\n• Healthier soil in long term\n• Export opportunities\n\n💡 Start with one field and expand gradually!",
    hi: "🌿 **जैविक खेती गाइड**\n\n• **कम्पोस्ट:** फसल अवशेष + गोबर से तैयार करें\n• **वर्मीकम्पोस्ट:** केंचुआ खाद\n• **हरी खाद:** ढैंचा, सनई उगाएं\n• **जैव कीटनाशक:** नीम तेल, ट्राइकोडर्मा\n\n💡 एक खेत से शुरू करें और धीरे-धीरे बढ़ाएं!",
  },
  maize: {
    en: "🌽 **Maize Cultivation Guide**\n\n• **Season:** Kharif (June–July) or Spring (February)\n• **Soil:** Well-drained sandy loam, pH 5.5–7.5\n• **Seed rate:** 20–25 kg/ha\n• **Spacing:** 60×20 cm\n• **Fertiliser:** NPK 120:60:40 kg/ha\n• **Top varieties:** HQPM-1, Shaktiman, DHM-117\n\n💡 Maize-pulse intercropping boosts profitability!",
    hi: "🌽 **मक्का खेती गाइड**\n\n• **मौसम:** खरीफ (जून–जुलाई)\n• **बीज:** 20–25 किग्रा/हेक्टेयर\n• **उर्वरक:** NPK 120:60:40\n\n💡 मक्का-दाल अंतर-फसल से लाभ बढ़ता है!",
  },
  potato: {
    en: "🥔 **Potato Cultivation Guide**\n\n• **Season:** Rabi (October–November planting)\n• **Soil:** Sandy loam, well-drained, pH 5.5–6.5\n• **Seed rate:** 25–30 quintals/ha\n• **Spacing:** 60×20 cm\n• **Fertiliser:** NPK 150:80:100 kg/ha\n• **Major disease:** Late blight — use Mancozeb spray\n• **Top varieties:** Kufri Jyoti, Kufri Pukhraj\n\n💡 Use certified disease-free seed tubers!",
    hi: "🥔 **आलू खेती गाइड**\n\n• **मौसम:** रबी (अक्टूबर–नवंबर)\n• **प्रमुख रोग:** झुलसा — मैंकोज़ेब स्प्रे करें\n\n💡 प्रमाणित बीज आलू का उपयोग करें!",
  },
  tomato: {
    en: "🍅 **Tomato Cultivation Guide**\n\n• **Season:** Year-round (protected cultivation)\n• **Soil:** Sandy loam, pH 6.0–7.0\n• **Seed rate:** 400–500 g/ha (nursery)\n• **Spacing:** 60×45 cm\n• **Fertiliser:** NPK 120:80:80 kg/ha\n• **Major pests:** Fruit borer, whitefly\n• **Top varieties:** Pusa Ruby, Arka Vikas\n\n💡 Staking improves fruit quality and yield!",
    hi: "🍅 **टमाटर खेती गाइड**\n\n• **मौसम:** साल भर (संरक्षित खेती)\n• **प्रमुख कीट:** फल छेदक, सफेद मक्खी\n\n💡 सहारा देने से फल की गुणवत्ता बढ़ती है!",
  },
  soybean: {
    en: "🫘 **Soybean Cultivation Guide**\n\n• **Season:** Kharif (June–July sowing)\n• **Soil:** Well-drained loamy, pH 6.0–7.5\n• **Seed rate:** 65–75 kg/ha\n• **Spacing:** 45×5 cm\n• **Fertiliser:** NPK 20:80:20 kg/ha + Rhizobium culture\n• **Top varieties:** JS-335, JS-9560\n\n💡 Treat seeds with Rhizobium for natural nitrogen fixation!",
    hi: "🫘 **सोयाबीन खेती गाइड**\n\n• **मौसम:** खरीफ (जून–जुलाई)\n• **उर्वरक:** NPK 20:80:20 + राइज़ोबियम\n\n💡 राइज़ोबियम से बीज उपचार करें!",
  },
  mustard: {
    en: "🌼 **Mustard Cultivation Guide**\n\n• **Season:** Rabi (October–November sowing)\n• **Soil:** Sandy loam to loam, pH 6.0–7.5\n• **Seed rate:** 4–5 kg/ha\n• **Spacing:** 45×15 cm\n• **Fertiliser:** NPK 80:40:40 kg/ha + Sulphur 40 kg\n• **Top varieties:** Pusa Bold, RH-749\n\n💡 Apply sulphur for better oil content!",
    hi: "🌼 **सरसों खेती गाइड**\n\n• **मौसम:** रबी (अक्टूबर–नवंबर)\n• **उर्वरक:** NPK 80:40:40 + गंधक 40 किग्रा\n\n💡 गंधक से तेल की मात्रा बढ़ती है!",
  },
  thanks: {
    en: "🙏 You're welcome! I'm always here to help with your farming queries. Feel free to ask about any crop, weather, soil, pest, fertiliser, irrigation, or government scheme!",
    hi: "🙏 आपका स्वागत है! मैं हमेशा आपकी खेती संबंधी सवालों में मदद के लिए यहां हूं। कोई भी सवाल पूछें!",
    bn: "🙏 আপনাকে স্বাগতম! যেকোনো প্রশ্ন জিজ্ঞাসা করুন!",
    te: "🙏 స్వాగతం! ఏదైనా ప్రశ్న అడగండి!",
    ta: "🙏 நன்றி! எந்த கேள்வியும் கேளுங்கள்!",
  },
  default: {
    en: "🙏 **Namaste! I'm your Smart Crop Advisory AI!**\n\nI can help you with:\n\n🌾 **Crop Guides** — wheat, rice, cotton, sugarcane, maize, potato, tomato, soybean, mustard & more\n🌤️ **Weather** — seasonal farming tips\n🌍 **Soil Health** — testing & improvement\n🐛 **Pest Control** — IPM techniques\n🧪 **Fertiliser** — NPK recommendations\n📈 **Market Prices** — mandi rates & selling tips\n💧 **Irrigation** — water management & subsidies\n🏛️ **Government Schemes** — PM-KISAN, insurance & more\n🌿 **Organic Farming** — compost, bio-pesticides\n\nTry asking: *\"How to grow wheat?\"* or *\"Best fertiliser for rice\"* or *\"Government schemes for farmers\"*",
    hi: "🙏 **नमस्ते! मैं आपका स्मार्ट क्रॉप एडवाइजरी AI हूं!**\n\nमैं इसमें मदद कर सकता हूं:\n\n🌾 **फसल गाइड** — गेहूं, धान, कपास, गन्ना, मक्का, आलू, टमाटर, सोयाबीन, सरसों\n🌤️ **मौसम** — मौसमी खेती टिप्स\n🌍 **मिट्टी** — परीक्षण और सुधार\n🐛 **कीट नियंत्रण** — IPM तकनीकें\n🧪 **उर्वरक** — NPK अनुशंसाएं\n📈 **बाजार भाव** — मंडी दरें\n💧 **सिंचाई** — जल प्रबंधन\n🏛️ **योजनाएं** — PM-KISAN और अन्य\n🌿 **जैविक खेती** — कम्पोस्ट, जैव कीटनाशक\n\nपूछें: *\"गेहूं कैसे उगाएं?\"* या *\"धान के लिए उर्वरक\"*",
    bn: "🙏 **নমস্কার! আমি আপনার স্মার্ট ক্রপ অ্যাডভাইজরি AI!**\n\n🌾 ফসল গাইড\n🌤️ আবহাওয়া\n🌍 মাটি স্বাস্থ্য\n🐛 কীটপতঙ্গ নিয়ন্ত্রণ\n📈 বাজার দর\n🏛️ সরকারি প্রকল্প\n\nআপনার প্রশ্ন টাইপ করুন!",
    te: "🙏 **నమస్కారం! నేను మీ స్మార్ట్ క్రాప్ AI!**\n\n🌾 పంట గైడ్\n🌤️ వాతావరణం\n🌍 నేల ఆరోగ్యం\n🐛 తెగులు నియంత్రణ\n📈 మార్కెట్ ధరలు\n🏛️ ప్రభుత్వ పథకాలు\n\nమీ ప్రశ్న టైప్ చేయండి!",
    ta: "🙏 **வணக்கம்! நான் உங்கள் ஸ்மார்ட் க்ராப் AI!**\n\n🌾 பயிர் வழிகாட்டி\n🌤️ வானிலை\n🌍 மண் ஆரோக்கியம்\n🐛 பூச்சி கட்டுப்பாடு\n📈 சந்தை விலைகள்\n🏛️ அரசு திட்டங்கள்\n\nஉங்கள் கேள்வியைத் தட்டச்சு செய்யுங்கள்!",
  },
};

/* ── Smart keyword matching ── */
const getSmartResponse = (input: string, lang: string): string => {
  const lower = input.toLowerCase().trim();

  // Specific crop matching
  const cropMap: [RegExp, string][] = [
    [/wheat|गेहूं|গম|గోధుమ|கோதுமை|gehun/, "wheat"],
    [/rice|paddy|धान|ধান|వరి|நெல்|dhan|chawal/, "rice"],
    [/cotton|कपास|তুলা|పత్తి|பருத்தி|kapas/, "cotton"],
    [/sugarcane|गन्ना|আখ|చెరకు|கரும்பு|ganna/, "sugarcane"],
    [/maize|corn|मक्का|ভুট্টা|మొక్కజొన్న|மக்காச்சோளம்|makka/, "maize"],
    [/potato|आलू|আলু|బంగాళాదుంప|உருளைக்கிழங்கு|aloo/, "potato"],
    [/tomato|टमाटर|টমেটো|టమాటో|தக்காளி|tamatar/, "tomato"],
    [/soybean|soya|सोयाबीन|সয়াবিন|సోయాబీన్/, "soybean"],
    [/mustard|सरसों|সরিষা|ఆవాలు|கடுகு|sarson/, "mustard"],
  ];

  for (const [regex, key] of cropMap) {
    if (regex.test(lower)) {
      return kb[key]?.[lang] || kb[key]?.en || kb.default.en;
    }
  }

  // Topic matching
  const topicMap: [RegExp, string][] = [
    [/crop|फसल|ফসল|పంట|பயிர்|seed|बीज|sow|बुवाई|harvest|कटाई|ugana|ugao|fasal/, "crop_general"],
    [/weather|rain|मौसम|बारिश|আবহাওয়া|বৃষ্টি|వాతావరణ|வானிலை|frost|पाला|monsoon|barish|varsha/, "weather"],
    [/soil|मिट्टी|মাটি|నేల|மண்|ph |organic matter|compost|mitti/, "soil"],
    [/pest|insect|कीट|कीड़ा|disease|रोग|blight|fungus|পোকা|పురుగు|பூச்சி|keeda|rog/, "pest"],
    [/fertili[sz]er|उर्वरक|खाद|npk|urea|dap|সার|ఎరువు|உரம்|khad|urvarak/, "fertilizer"],
    [/market|price|mandi|भाव|मंडी|बाजार|sell|বাজার|మార్కెట్|சந்தை|bazaar|bechna/, "market"],
    [/scheme|government|sarkari|योजना|सरकार|pm.kisan|kisan|subsidy|সরকার|ప్రభుత్వ|அரசு|insurance|बीमा|yojana/, "scheme"],
    [/irrigat|water|सिंचाई|पानी|drip|sprinkler|জল|সেচ|నీటి|நீர்|sinchai|paani/, "irrigation"],
    [/organic|जैविक|bio|vermicompost|compost|कम्पोस्ट|জৈব|ఆర్గానిక్|இயற்கை|jaivik/, "organic"],
  ];

  for (const [regex, key] of topicMap) {
    if (regex.test(lower)) {
      return kb[key]?.[lang] || kb[key]?.en || kb.default.en;
    }
  }

  // Gratitude
  if (/thank|dhanyavad|धन्यवाद|shukriya|শুকরিয়া|நன்றி|ధన్యవాదాలు/.test(lower)) {
    return kb.thanks[lang] || kb.thanks.en;
  }

  // Greeting
  if (/^(hi|hello|hey|namaste|namaskar|vanakkam|नमस्ते|নমস্কার|வணக்கம்|నమస్కారం|jai hind|bharat)/.test(lower)) {
    return kb.default[lang] || kb.default.en;
  }

  // Fallback with helpful nudge
  const fallback: Record<string, string> = {
    en: "I'm not sure about that specific topic. I specialise in Indian agriculture — try asking about:\n\n🌾 Crops (wheat, rice, cotton, potato, tomato…)\n🐛 Pest management\n🧪 Fertilisers\n📈 Market prices\n🏛️ Government schemes\n💧 Irrigation\n🌿 Organic farming\n\nHow can I help you?",
    hi: "इस विषय के बारे में मुझे जानकारी नहीं है। मैं भारतीय कृषि में विशेषज्ञ हूं। पूछें:\n\n🌾 फसलें\n🐛 कीट प्रबंधन\n🧪 उर्वरक\n📈 बाजार भाव\n🏛️ सरकारी योजनाएं\n💧 सिंचाई",
  };
  return fallback[lang] || fallback.en;
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
    }, 500 + Math.random() * 500);
  };

  const quickQuestions = language === "hi"
    ? ["गेहूं कैसे उगाएं?", "सरकारी योजनाएं", "कीट प्रबंधन"]
    : ["How to grow wheat?", "Government schemes", "Pest management"];

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
            className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-accent to-primary text-white flex items-center gap-3">
              <AshokaChakra size={28} className="[&_circle]:fill-white [&_line]:stroke-white" />
              <div>
                <h3 className="font-bold text-sm font-heading">{t("ai.title")}</h3>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Smart Crop Advisory
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[360px]">
              {messages.length === 0 && (
                <div className="text-center py-4 space-y-3">
                  <AshokaChakra size={40} className="mx-auto" />
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {t("ai.greeting")}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
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
