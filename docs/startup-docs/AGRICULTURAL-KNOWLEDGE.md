# Farm Intellect — Agricultural Knowledge Base

## Curated Dataset Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AGRICULTURAL DATA ARCHITECTURE                     │
│                                                                       │
│  Farm Intellect ships with 12 curated agricultural datasets         │
│  embedded in the frontend. These serve as:                          │
│  1. Offline-first data (works without API/internet)                 │
│  2. AI context enrichment (augments Sarvam LLM responses)           │
│  3. Fallback when AI API is unavailable                             │
│                                                                       │
│  ┌──────────────────────────┬──────────┬──────────────────────────┐ │
│  │ File                     │ Records  │ Domain                    │ │
│  ├──────────────────────────┼──────────┼──────────────────────────┤ │
│  │ cropsData.ts             │ 60+      │ Crop profiles             │ │
│  │ cropDiseases.ts          │ 50+      │ Disease encyclopedia      │ │
│  │ cropCalendar.ts          │ 1500+    │ Seasonal activities       │ │
│  │ cropRecommendations.ts   │ 30+      │ Soil/season mappings     │ │
│  │ cropProduction.ts        │ 28+      │ State-wise production    │ │
│  │ mandiPrices.ts           │ 50+      │ Market prices             │ │
│  │ pestData.ts              │ 30+      │ Pest profiles             │ │
│  │ soilHealth.ts            │ 12       │ Soil parameters           │ │
│  │ satelliteData.ts         │ varies   │ Remote sensing sample    │ │
│  │ indianLocations.ts       │ 700+     │ Geography hierarchy      │ │
│  │ kisanCallCenter.ts       │ 28+      │ Helpline directory       │ │
│  │ cropProduction.ts        │ 28+      │ Historical yields        │ │
│  └──────────────────────────┴──────────┴──────────────────────────┘ │
│                                                                       │
│  TOTAL: ~2500+ curated data points, ZERO API calls needed          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Crop Database (cropsData.ts)

```
┌─────────────────────────────────────────────────────────────────────┐
│  60+ INDIAN CROPS                                                    │
│                                                                       │
│  Data Structure per crop:                                            │
│  {                                                                   │
│    name: "Wheat (गेहूँ / ਕਣਕ)",                                     │
│    scientificName: "Triticum aestivum",                             │
│    season: "Rabi (Oct-Mar)",                                        │
│    soilType: ["alluvial", "loamy", "clay-loam"],                    │
│    waterReq: "moderate",                                            │
│    duration: "120-150 days",                                        │
│    yieldPerHectare: "4.0-5.5 tonnes",                               │
│    msp: "₹2,275/quintal (2025-26)",                                │
│    states: ["Punjab", "Haryana", "UP", "MP", "Rajasthan"],         │
│    varieties: ["HD-3086", "PBW-343", "WH-1105"],                   │
│    keyPractices: ["sowing depth 5cm", "irrigation at CRI stage"],  │
│    marketDemand: "high"                                             │
│  }                                                                   │
│                                                                       │
│  CROP CATEGORIES:                                                    │
│  ┌───────────────────┬────────────────────────────────────────────┐ │
│  │ Category          │ Crops                                      │ │
│  ├───────────────────┼────────────────────────────────────────────┤ │
│  │ Cereals (15+)     │ Wheat, Rice, Maize, Bajra, Jowar, Ragi,  │ │
│  │                   │ Barley, Oats                               │ │
│  ├───────────────────┼────────────────────────────────────────────┤ │
│  │ Pulses (10+)      │ Moong, Urad, Chana, Arhar, Masoor,       │ │
│  │                   │ Lentil, Soybean                            │ │
│  ├───────────────────┼────────────────────────────────────────────┤ │
│  │ Oilseeds (8+)     │ Mustard, Groundnut, Sunflower, Sesame,   │ │
│  │                   │ Castor, Linseed                            │ │
│  ├───────────────────┼────────────────────────────────────────────┤ │
│  │ Cash Crops (8+)   │ Cotton, Sugarcane, Jute, Tobacco, Tea,   │ │
│  │                   │ Coffee, Rubber                             │ │
│  ├───────────────────┼────────────────────────────────────────────┤ │
│  │ Vegetables (12+)  │ Potato, Tomato, Onion, Cauliflower,      │ │
│  │                   │ Brinjal, Okra, Peas, Carrot               │ │
│  ├───────────────────┼────────────────────────────────────────────┤ │
│  │ Fruits (8+)       │ Mango, Banana, Guava, Apple, Papaya,     │ │
│  │                   │ Pomegranate, Citrus                        │ │
│  └───────────────────┴────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Disease Database (cropDiseases.ts)

```
┌─────────────────────────────────────────────────────────────────────┐
│  50+ CROP DISEASES                                                   │
│                                                                       │
│  Data Structure per disease:                                         │
│  {                                                                   │
│    crop: "Rice",                                                    │
│    disease: "Brown Spot (भूरा धब्बा)",                              │
│    pathogen: "Bipolaris oryzae (fungal)",                           │
│    symptoms: [                                                       │
│      "Small, oval brown spots on leaves",                           │
│      "Spots enlarge with grey centers",                             │
│      "Seedling blight in severe cases"                              │
│    ],                                                                │
│    severity: "moderate-high",                                        │
│    favorable: "High humidity, 25-30°C, nutrient deficiency",       │
│    treatment: {                                                      │
│      chemical: "Mancozeb 75% WP @ 2g/L or Carbendazim 50% WP",   │
│      organic: "Neem oil 5ml/L + Trichoderma viride soil treat",   │
│      cultural: "Balanced fertilization, improve drainage"          │
│    },                                                                │
│    prevention: "Use resistant varieties (Pusa 44), seed treatment" │
│  }                                                                   │
│                                                                       │
│  DISEASE CATEGORIES:                                                 │
│  ┌───────────────────┬─────┬────────────────────────────────────┐  │
│  │ Type              │ Count│ Examples                           │  │
│  ├───────────────────┼─────┼────────────────────────────────────┤  │
│  │ Fungal diseases   │ 25+ │ Blast, rust, blight, wilt, rot    │  │
│  │ Bacterial diseases│ 10+ │ Leaf blight, canker, soft rot     │  │
│  │ Viral diseases    │ 8+  │ Mosaic, leaf curl, tungro         │  │
│  │ Deficiency        │ 6+  │ N, P, K, Fe, Zn, B deficiency    │  │
│  │ Nematode          │ 3+  │ Root-knot, cyst nematode          │  │
│  └───────────────────┴─────┴────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Seasonal Calendar (cropCalendar.ts)

```
┌─────────────────────────────────────────────────────────────────────┐
│  1500+ FARMING ACTIVITIES                                            │
│                                                                       │
│  SEASONAL FRAMEWORK:                                                 │
│  ┌──────────┬──────────────┬──────────────────────────────────────┐ │
│  │ Season   │ Months       │ Key Activities                       │ │
│  ├──────────┼──────────────┼──────────────────────────────────────┤ │
│  │ Rabi     │ Oct → Mar    │ Wheat, mustard, gram sowing + mgmt │ │
│  │ Kharif   │ Jun → Oct    │ Rice, maize, cotton sowing + mgmt  │ │
│  │ Zaid     │ Mar → Jun    │ Vegetables, watermelon, cucumber   │ │
│  │ Year-round│ All months  │ Dairy, poultry, soil management    │ │
│  └──────────┴──────────────┴──────────────────────────────────────┘ │
│                                                                       │
│  MONTHLY ACTIVITY BREAKDOWN (Punjab focus):                          │
│  ┌─────┬───────────────────────────────────────────────────────┐    │
│  │ Oct │ Rabi sowing: wheat field prep, mustard sowing,        │    │
│  │     │ potato planting, soil testing                          │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Nov │ Wheat sowing (HD-3086), first irrigation, DAP        │    │
│  │     │ application, sugarcane ratoon management               │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Dec │ 2nd irrigation, weed control (Sulfosulfuron),        │    │
│  │     │ frost protection for vegetables                       │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Jan │ 3rd irrigation, aphid monitoring, urea top-dressing, │    │
│  │     │ mustard flowering management                          │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Feb │ 4th irrigation, yellow rust spray if needed,         │    │
│  │     │ potato harvesting begins                              │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Mar │ Wheat maturity check, mustard harvesting, Zaid prep, │    │
│  │     │ summer vegetable nursery                              │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Apr │ Wheat harvesting, residue management (no burning!),  │    │
│  │     │ Zaid cucurbit sowing, summer moong                    │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ May │ Land preparation for kharif, rice nursery prep,      │    │
│  │     │ soil amendments, machinery maintenance                │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Jun │ Rice transplanting, cotton sowing, maize sowing,     │    │
│  │     │ monsoon preparation, drainage clearing                │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Jul │ Rice weed management, cotton thinning, pest          │    │
│  │     │ monitoring (stem borer, BPH), fertilizer application │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Aug │ Rice panicle initiation, cotton squaring, pest       │    │
│  │     │ management, flood damage assessment                   │    │
│  ├─────┼───────────────────────────────────────────────────────┤    │
│  │ Sep │ Rice grain filling, cotton boll opening, kharif      │    │
│  │     │ harvest prep, rabi field planning                     │    │
│  └─────┴───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Mandi Market Data (mandiPrices.ts)

```
┌─────────────────────────────────────────────────────────────────────┐
│  50+ MANDI MARKETS (Punjab Focus)                                    │
│                                                                       │
│  Data Structure:                                                     │
│  {                                                                   │
│    market: "Ludhiana Grain Market",                                 │
│    district: "Ludhiana",                                            │
│    state: "Punjab",                                                 │
│    commodities: [                                                    │
│      { crop: "Wheat",  minPrice: 2100, maxPrice: 2350, modal: 2275,│
│        unit: "quintal", date: "2026-02-15" },                       │
│      { crop: "Rice",   minPrice: 2100, maxPrice: 2300, modal: 2200 │
│        }                                                             │
│    ],                                                                │
│    contact: "0161-2XXXXXX"                                          │
│  }                                                                   │
│                                                                       │
│  KEY PUNJAB MANDIS:                                                  │
│  ┌──────────────────────┬──────────────────────────────────────┐    │
│  │ Mandi                │ Key Commodities                       │    │
│  ├──────────────────────┼──────────────────────────────────────┤    │
│  │ Ludhiana             │ Wheat, Rice, Maize, Cotton            │    │
│  │ Amritsar             │ Wheat, Rice, Vegetables               │    │
│  │ Jalandhar            │ Wheat, Potato, Vegetables             │    │
│  │ Patiala              │ Wheat, Rice, Mustard                  │    │
│  │ Bathinda             │ Cotton, Wheat, Rice                   │    │
│  │ Moga                 │ Wheat, Rice, Maize                    │    │
│  │ Ferozepur            │ Wheat, Rice, Sugarcane                │    │
│  │ Hoshiarpur           │ Wheat, Maize, Citrus fruits           │    │
│  │ Sangrur              │ Wheat, Rice, Cotton                   │    │
│  │ Barnala              │ Cotton, Wheat, Rice                   │    │
│  └──────────────────────┴──────────────────────────────────────┘    │
│                                                                       │
│  MSP Reference (2025-26):                                            │
│  Wheat: ₹2,275/q │ Rice: ₹2,300/q │ Cotton: ₹7,121/q             │
│  Maize: ₹2,090/q │ Mustard: ₹5,650/q │ Chana: ₹5,440/q           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Soil Health Data (soilHealth.ts)

```
┌─────────────────────────────────────────────────────────────────────┐
│  12 SOIL HEALTH PARAMETERS                                          │
│                                                                       │
│  ┌───────────────────┬────────────────┬──────────────────────────┐  │
│  │ Parameter         │ Ideal Range    │ Impact on Crops           │  │
│  ├───────────────────┼────────────────┼──────────────────────────┤  │
│  │ pH                │ 6.0 - 7.5     │ Nutrient availability     │  │
│  │ Organic Carbon    │ > 0.75%       │ Soil fertility indicator  │  │
│  │ Nitrogen (N)      │ 280-560 kg/ha │ Leaf growth, greening    │  │
│  │ Phosphorus (P)    │ 25-50 kg/ha   │ Root development, flower │  │
│  │ Potassium (K)     │ 125-300 kg/ha │ Disease resistance       │  │
│  │ Zinc (Zn)         │ > 0.6 mg/kg   │ Grain quality            │  │
│  │ Iron (Fe)         │ > 4.5 mg/kg   │ Chlorophyll production   │  │
│  │ Manganese (Mn)    │ > 3.5 mg/kg   │ Enzyme activation        │  │
│  │ Copper (Cu)       │ > 0.2 mg/kg   │ Seed formation           │  │
│  │ Boron (B)         │ > 0.5 mg/kg   │ Cell wall formation      │  │
│  │ Sulfur (S)        │ > 10 mg/kg    │ Protein synthesis        │  │
│  │ EC (Salinity)     │ < 4 dS/m      │ Water uptake             │  │
│  └───────────────────┴────────────────┴──────────────────────────┘  │
│                                                                       │
│  Punjab Soil Profile (typical alluvial):                             │
│  pH: 7.2-8.5 │ OC: 0.3-0.6% │ N: Low-Med │ P: Med │ K: High      │
│  Issue: declining organic carbon due to rice-wheat monoculture     │
│  Recommendation: Green manuring, crop rotation, balanced NPK       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Government Schemes & Helplines

```
┌─────────────────────────────────────────────────────────────────────┐
│  GOVERNMENT SCHEMES (Featured in GovtSchemes page):                  │
│                                                                       │
│  ┌────────────────────────────┬──────────────────────────────────┐  │
│  │ Scheme                     │ Benefit                           │  │
│  ├────────────────────────────┼──────────────────────────────────┤  │
│  │ PM-KISAN                   │ ₹6,000/year direct transfer     │  │
│  │ PM Fasal Bima Yojana       │ Crop insurance at 2% premium    │  │
│  │ Soil Health Card Scheme    │ Free soil testing + report       │  │
│  │ PM Kisan Samman Nidhi      │ Income support for farmers      │  │
│  │ e-NAM                      │ National agri marketplace       │  │
│  │ RKVY                       │ State agriculture development   │  │
│  │ PM Krishi Sinchai Yojana   │ Irrigation subsidy              │  │
│  │ Paramparagat Krishi        │ Organic farming support         │  │
│  └────────────────────────────┴──────────────────────────────────┘  │
│                                                                       │
│  KISAN CALL CENTER (kisanCallCenter.ts):                             │
│  ┌────────────────────┬───────────────┬───────────────────────┐     │
│  │ State              │ Helpline      │ Languages              │     │
│  ├────────────────────┼───────────────┼───────────────────────┤     │
│  │ All India          │ 1800-180-1551 │ Hindi + English       │     │
│  │ Punjab             │ 0172-2970605  │ Punjabi + Hindi       │     │
│  │ Haryana            │ 0172-2571553  │ Hindi                 │     │
│  │ UP                 │ 0522-2204355  │ Hindi                 │     │
│  │ Maharashtra        │ 020-26121720  │ Marathi + Hindi       │     │
│  │ (28 states total)  │               │                       │     │
│  └────────────────────┴───────────────┴───────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
```
