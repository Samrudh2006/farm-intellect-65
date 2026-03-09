/**
 * Offline Disease Detection Service — TensorFlow.js
 * ==================================================
 * Loads a MobileNetV2-based model trained on PlantVillage (38 classes)
 * and runs inference entirely in the browser. No network required.
 *
 * Usage:
 *   const ready = await loadDiseaseModel();
 *   if (ready) {
 *     const result = await classifyImage(imgElement);
 *   }
 */

import * as tf from "@tensorflow/tfjs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiseaseDetectionResult {
  disease: string;
  crop: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  category: "fungal" | "bacterial" | "viral" | "nutrient" | "pest" | "healthy";
  isHealthy: boolean;
  topPredictions: Array<{ label: string; confidence: number }>;
  treatment: {
    chemical: string[];
    organic: string[];
    cultural: string[];
  };
  prevention: string[];
  yieldLossEstimate: string;
  urgency: "immediate" | "within_week" | "monitoring" | "none";
}

interface ModelMetadata {
  class_labels: string[];
  image_size: [number, number];
  num_classes: number;
  validation_accuracy: number;
  preprocessing: string;
}

// ---------------------------------------------------------------------------
// Model state
// ---------------------------------------------------------------------------

const MODEL_PATH = "/models/plant-disease/model.json";
const METADATA_PATH = "/models/plant-disease/metadata.json";

let model: tf.LayersModel | null = null;
let metadata: ModelMetadata | null = null;
let loadingPromise: Promise<boolean> | null = null;

// ---------------------------------------------------------------------------
// PlantVillage class → disease info mapping
// ---------------------------------------------------------------------------

const CLASS_INFO: Record<
  string,
  {
    crop: string;
    disease: string;
    severity: DiseaseDetectionResult["severity"];
    category: DiseaseDetectionResult["category"];
    treatment: DiseaseDetectionResult["treatment"];
    prevention: string[];
    yieldLoss: string;
  }
> = {
  Apple___Apple_scab: {
    crop: "Apple",
    disease: "Apple Scab",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 2.5g/L", "Myclobutanil 0.5g/L"],
      organic: ["Sulfur spray", "Bordeaux mixture"],
      cultural: ["Remove fallen leaves", "Prune for air circulation"],
    },
    prevention: ["Resistant varieties", "Remove fallen leaves in autumn"],
    yieldLoss: "10-30%",
  },
  Apple___Black_rot: {
    crop: "Apple",
    disease: "Black Rot",
    severity: "high",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 2.5g/L", "Captan 2g/L"],
      organic: ["Bordeaux mixture 1%"],
      cultural: ["Remove mummified fruits", "Prune dead wood"],
    },
    prevention: ["Remove mummified fruits", "Prune for air circulation"],
    yieldLoss: "15-40%",
  },
  Apple___Cedar_apple_rust: {
    crop: "Apple",
    disease: "Cedar Apple Rust",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Myclobutanil 0.5g/L", "Mancozeb 2.5g/L"],
      organic: ["Sulfur spray"],
      cultural: ["Remove nearby cedar trees", "Resistant varieties"],
    },
    prevention: ["Plant resistant varieties", "Remove cedar/juniper hosts within 2 miles"],
    yieldLoss: "5-20%",
  },
  Apple___healthy: {
    crop: "Apple",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring", "Maintain good orchard hygiene"],
    yieldLoss: "0%",
  },
  Blueberry___healthy: {
    crop: "Blueberry",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Cherry___Powdery_mildew: {
    crop: "Cherry",
    disease: "Powdery Mildew",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Sulfur 80WP @ 3g/L", "Karathane 1ml/L"],
      organic: ["Milk spray 10%", "Baking soda 5g/L"],
      cultural: ["Good air circulation", "Avoid overhead watering"],
    },
    prevention: ["Good air circulation", "Avoid overhead watering"],
    yieldLoss: "5-15%",
  },
  Cherry___healthy: {
    crop: "Cherry",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Corn___Cercospora_leaf_spot: {
    crop: "Maize",
    disease: "Cercospora Leaf Spot",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Carbendazim 1g/L", "Mancozeb 2.5g/L"],
      organic: ["Trichoderma harzianum 5g/L"],
      cultural: ["Crop rotation", "Balanced fertilization"],
    },
    prevention: ["Crop rotation", "Balanced fertilization"],
    yieldLoss: "10-20%",
  },
  Corn___Common_rust: {
    crop: "Maize",
    disease: "Common Rust",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 2.5g/L", "Propiconazole 1ml/L"],
      organic: ["Neem oil 5ml/L"],
      cultural: ["Early planting", "Resistant hybrids"],
    },
    prevention: ["Early planting", "Resistant hybrids"],
    yieldLoss: "10-25%",
  },
  Corn___Northern_Leaf_Blight: {
    crop: "Maize",
    disease: "Northern Leaf Blight",
    severity: "high",
    category: "fungal",
    treatment: {
      chemical: ["Propiconazole 1ml/L", "Mancozeb 2.5g/L"],
      organic: ["Trichoderma viride"],
      cultural: ["Crop rotation", "Deep ploughing"],
    },
    prevention: ["Crop rotation", "Deep ploughing", "Resistant varieties"],
    yieldLoss: "15-30%",
  },
  Corn___healthy: {
    crop: "Maize",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Grape___Black_rot: {
    crop: "Grape",
    disease: "Black Rot",
    severity: "high",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 2.5g/L", "Captan 2g/L"],
      organic: ["Bordeaux mixture 1%"],
      cultural: ["Remove mummified fruits", "Prune for air circulation"],
    },
    prevention: ["Remove mummified fruits", "Prune for air circulation"],
    yieldLoss: "20-50%",
  },
  Grape___Esca: {
    crop: "Grape",
    disease: "Esca (Black Measles)",
    severity: "high",
    category: "fungal",
    treatment: {
      chemical: ["Propiconazole wound paint"],
      organic: ["Trichoderma trunk injection"],
      cultural: ["Avoid large pruning wounds", "Good vine hygiene"],
    },
    prevention: ["Avoid large pruning wounds", "Good vine hygiene"],
    yieldLoss: "15-40%",
  },
  Grape___Leaf_blight: {
    crop: "Grape",
    disease: "Leaf Blight",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 2.5g/L", "Copper oxychloride 3g/L"],
      organic: ["Bordeaux mixture 1%"],
      cultural: ["Remove infected leaves", "Good canopy management"],
    },
    prevention: ["Good canopy management", "Remove infected debris"],
    yieldLoss: "10-25%",
  },
  Grape___healthy: {
    crop: "Grape",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Orange___Haunglongbing: {
    crop: "Orange",
    disease: "Huanglongbing (Citrus Greening)",
    severity: "critical",
    category: "bacterial",
    treatment: {
      chemical: ["Oxytetracycline trunk injection (research)", "Imidacloprid 0.3ml/L (psyllid control)"],
      organic: ["Neem oil for psyllid management"],
      cultural: ["Remove infected trees", "Control Asian citrus psyllid vector"],
    },
    prevention: ["Use certified disease-free nursery stock", "Control citrus psyllid", "Regular scouting"],
    yieldLoss: "30-100%",
  },
  Peach___Bacterial_spot: {
    crop: "Peach",
    disease: "Bacterial Spot",
    severity: "medium",
    category: "bacterial",
    treatment: {
      chemical: ["Copper oxychloride 3g/L", "Streptocycline 0.01%"],
      organic: ["Copper hydroxide 2g/L"],
      cultural: ["Avoid overhead irrigation", "Resistant varieties"],
    },
    prevention: ["Resistant varieties", "Avoid working in wet conditions"],
    yieldLoss: "10-25%",
  },
  Peach___healthy: {
    crop: "Peach",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Pepper___Bacterial_spot: {
    crop: "Pepper",
    disease: "Bacterial Spot",
    severity: "medium",
    category: "bacterial",
    treatment: {
      chemical: ["Copper oxychloride 3g/L", "Streptocycline 0.01%"],
      organic: ["Pseudomonas fluorescens 5g/L"],
      cultural: ["Hot water seed treatment", "Avoid working in wet fields"],
    },
    prevention: ["Hot water seed treatment (50°C, 25 min)", "Crop rotation"],
    yieldLoss: "10-30%",
  },
  Pepper___healthy: {
    crop: "Pepper",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Potato___Early_blight: {
    crop: "Potato",
    disease: "Early Blight",
    severity: "high",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 75WP @ 2g/L", "Chlorothalonil 75WP @ 2g/L"],
      organic: ["Trichoderma viride @ 5g/L", "Neem oil 5ml/L"],
      cultural: ["Crop rotation", "Resistant varieties", "Proper spacing"],
    },
    prevention: ["Crop rotation with non-solanaceous crops", "Proper plant spacing"],
    yieldLoss: "20-40%",
  },
  Potato___Late_blight: {
    crop: "Potato",
    disease: "Late Blight",
    severity: "critical",
    category: "fungal",
    treatment: {
      chemical: ["Metalaxyl + Mancozeb @ 2.5g/L", "Cymoxanil + Mancozeb @ 3g/L"],
      organic: ["Copper hydroxide 2g/L", "Bordeaux mixture 1%"],
      cultural: ["Avoid overhead irrigation", "Destroy infected debris"],
    },
    prevention: ["Use certified seed", "Avoid overhead irrigation", "Hilling up soil around plants"],
    yieldLoss: "30-60%",
  },
  Potato___healthy: {
    crop: "Potato",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Raspberry___healthy: {
    crop: "Raspberry",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Soybean___healthy: {
    crop: "Soybean",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Squash___Powdery_mildew: {
    crop: "Squash",
    disease: "Powdery Mildew",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Sulfur 80WP @ 3g/L", "Karathane 1ml/L"],
      organic: ["Milk spray 10%", "Baking soda 5g/L"],
      cultural: ["Good air circulation", "Avoid overhead watering"],
    },
    prevention: ["Good air circulation", "Resistant varieties"],
    yieldLoss: "10-20%",
  },
  Strawberry___Leaf_scorch: {
    crop: "Strawberry",
    disease: "Leaf Scorch",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Captan 2g/L", "Myclobutanil 0.5g/L"],
      organic: ["Copper spray", "Neem oil 5ml/L"],
      cultural: ["Remove infected leaves", "Good plant spacing"],
    },
    prevention: ["Resistant varieties", "Proper plant spacing", "Remove infected debris"],
    yieldLoss: "10-25%",
  },
  Strawberry___healthy: {
    crop: "Strawberry",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring"],
    yieldLoss: "0%",
  },
  Tomato___Bacterial_spot: {
    crop: "Tomato",
    disease: "Bacterial Spot",
    severity: "medium",
    category: "bacterial",
    treatment: {
      chemical: ["Copper oxychloride 3g/L", "Streptocycline 0.01%"],
      organic: ["Pseudomonas fluorescens 5g/L"],
      cultural: ["Hot water seed treatment", "Avoid working in wet fields"],
    },
    prevention: ["Hot water seed treatment (50°C, 25 min)", "Avoid working in wet fields"],
    yieldLoss: "10-30%",
  },
  Tomato___Early_blight: {
    crop: "Tomato",
    disease: "Early Blight",
    severity: "high",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 75WP @ 2.5g/L", "Chlorothalonil 75WP @ 2g/L", "Azoxystrobin 23% SC @ 1ml/L"],
      organic: ["Neem oil 3%", "Trichoderma viride @ 5g/L", "Pseudomonas fluorescens @ 5g/L"],
      cultural: ["Remove infected debris", "Crop rotation", "Proper plant spacing"],
    },
    prevention: ["Use certified disease-free seeds", "Apply mulch to prevent soil splash", "Maintain 60cm row spacing"],
    yieldLoss: "30-50%",
  },
  Tomato___Late_blight: {
    crop: "Tomato",
    disease: "Late Blight",
    severity: "critical",
    category: "fungal",
    treatment: {
      chemical: ["Metalaxyl + Mancozeb @ 2.5g/L", "Cymoxanil + Mancozeb @ 3g/L"],
      organic: ["Copper hydroxide 2g/L", "Bordeaux mixture 1%"],
      cultural: ["Avoid overhead irrigation", "Destroy infected debris", "Use certified seed"],
    },
    prevention: ["Avoid overhead irrigation", "Destroy infected debris", "Use certified seed"],
    yieldLoss: "40-70%",
  },
  Tomato___Leaf_Mold: {
    crop: "Tomato",
    disease: "Leaf Mold",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Mancozeb 2.5g/L", "Carbendazim 1g/L"],
      organic: ["Trichoderma harzianum 5g/L"],
      cultural: ["Improve ventilation", "Lower humidity in greenhouse"],
    },
    prevention: ["Improve ventilation", "Lower humidity in greenhouse"],
    yieldLoss: "10-20%",
  },
  Tomato___Septoria_leaf_spot: {
    crop: "Tomato",
    disease: "Septoria Leaf Spot",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Propiconazole 1ml/L", "Mancozeb 2.5g/L"],
      organic: ["Neem oil 5ml/L"],
      cultural: ["Remove lower infected leaves", "Mulch to prevent splash"],
    },
    prevention: ["Remove lower infected leaves", "Mulch to prevent splash"],
    yieldLoss: "10-25%",
  },
  Tomato___Spider_mites: {
    crop: "Tomato",
    disease: "Spider Mite Damage",
    severity: "medium",
    category: "pest",
    treatment: {
      chemical: ["Dicofol 2.5ml/L", "Spiromesifen 1ml/L"],
      organic: ["Neem oil 5ml/L", "Predatory mites (Phytoseiulus persimilis)"],
      cultural: ["Maintain humidity", "Avoid water stress"],
    },
    prevention: ["Maintain humidity", "Avoid water stress", "Remove infested leaves"],
    yieldLoss: "10-30%",
  },
  Tomato___Target_Spot: {
    crop: "Tomato",
    disease: "Target Spot",
    severity: "medium",
    category: "fungal",
    treatment: {
      chemical: ["Chlorothalonil 2g/L", "Azoxystrobin 1ml/L"],
      organic: ["Trichoderma viride 5g/L"],
      cultural: ["Proper spacing", "Remove infected debris"],
    },
    prevention: ["Proper spacing", "Remove infected debris"],
    yieldLoss: "10-20%",
  },
  Tomato___Mosaic_virus: {
    crop: "Tomato",
    disease: "Mosaic Virus",
    severity: "high",
    category: "viral",
    treatment: {
      chemical: ["Imidacloprid 0.3ml/L (vector control)"],
      organic: ["Neem oil 5ml/L", "Yellow sticky traps"],
      cultural: ["Remove infected plants immediately", "Control whitefly vectors"],
    },
    prevention: ["Use virus-free seed", "Control insect vectors", "Wash hands between plants"],
    yieldLoss: "20-40%",
  },
  Tomato___Yellow_Leaf_Curl: {
    crop: "Tomato",
    disease: "Yellow Leaf Curl Virus",
    severity: "high",
    category: "viral",
    treatment: {
      chemical: ["Thiamethoxam 0.3g/L (whitefly control)"],
      organic: ["Yellow sticky traps", "Reflective mulch"],
      cultural: ["Use virus-free transplants", "Resistant hybrids"],
    },
    prevention: ["Use virus-free transplants", "Resistant hybrids (Arka Rakshak, Arka Samrat)"],
    yieldLoss: "30-60%",
  },
  Tomato___healthy: {
    crop: "Tomato",
    disease: "Healthy",
    severity: "low",
    category: "healthy",
    treatment: { chemical: [], organic: [], cultural: [] },
    prevention: ["Continue regular monitoring", "Maintain good garden hygiene"],
    yieldLoss: "0%",
  },
};

// ---------------------------------------------------------------------------
// Model loading
// ---------------------------------------------------------------------------

/**
 * Load the TF.js disease detection model. Returns true if successful.
 * Safe to call multiple times — subsequent calls return the cached model.
 */
export async function loadDiseaseModel(): Promise<boolean> {
  if (model && metadata) return true;

  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      // Load metadata first to verify model files exist
      const metaRes = await fetch(METADATA_PATH);
      if (!metaRes.ok) {
        console.warn("[DiseaseModel] metadata.json not found — model not yet trained/deployed");
        return false;
      }
      metadata = await metaRes.json();

      // Load TF.js model
      model = await tf.loadLayersModel(MODEL_PATH);
      console.log(
        `[DiseaseModel] Loaded: ${metadata!.num_classes} classes, ` +
        `validation accuracy ${(metadata!.validation_accuracy * 100).toFixed(1)}%`
      );
      return true;
    } catch (err) {
      console.warn("[DiseaseModel] Failed to load model:", err);
      model = null;
      metadata = null;
      return false;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

/** Check if the model is loaded and ready for inference. */
export function isModelReady(): boolean {
  return model !== null && metadata !== null;
}

// ---------------------------------------------------------------------------
// Image preprocessing
// ---------------------------------------------------------------------------

/**
 * Preprocess an image for MobileNetV2.
 * - Resize to 224×224
 * - Normalize to [-1, 1] (MobileNetV2 preprocessing)
 */
function preprocessImage(
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
): tf.Tensor4D {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(source);
    // Resize to model input size
    tensor = tf.image.resizeBilinear(tensor as tf.Tensor3D, [224, 224]);
    // MobileNetV2 preprocessing: scale from [0,255] to [-1,1]
    const normalized = tensor.toFloat().div(127.5).sub(1);
    // Add batch dimension
    return normalized.expandDims(0) as tf.Tensor4D;
  });
}

// ---------------------------------------------------------------------------
// Inference
// ---------------------------------------------------------------------------

/**
 * Classify a crop leaf image for disease detection.
 * Returns structured detection result with treatment recommendations.
 *
 * @param source - An HTMLImageElement, HTMLCanvasElement, or ImageBitmap
 * @param topK  - Number of top predictions to include (default 3)
 */
export async function classifyImage(
  source: HTMLImageElement | HTMLCanvasElement | ImageBitmap,
  topK = 3,
): Promise<DiseaseDetectionResult | null> {
  if (!model || !metadata) {
    console.warn("[DiseaseModel] Model not loaded. Call loadDiseaseModel() first.");
    return null;
  }

  const input = preprocessImage(source);

  try {
    const predictions = model.predict(input) as tf.Tensor;
    const probabilities: Float32Array | Int32Array | Uint8Array = await predictions.data();
    predictions.dispose();

    // Get top-K predictions
    const indexed: Array<{ prob: number; i: number }> = Array.from(probabilities).map((prob, i) => ({ prob, i }));
    indexed.sort((a, b) => b.prob - a.prob);
    const topResults = indexed.slice(0, topK);

    const topLabel = metadata.class_labels[topResults[0].i];
    const topConf: number = topResults[0].prob;

    const info = CLASS_INFO[topLabel];
    if (!info) {
      return {
        disease: topLabel.replace(/___/g, " — ").replace(/_/g, " "),
        crop: topLabel.split("___")[0],
        confidence: Math.round(topConf * 100),
        severity: "medium",
        category: "fungal",
        isHealthy: topLabel.includes("healthy"),
        topPredictions: topResults.map((r) => ({
          label: metadata!.class_labels[r.i],
          confidence: Math.round(r.prob * 100),
        })),
        treatment: { chemical: [], organic: [], cultural: [] },
        prevention: ["Consult your local KVK or agricultural officer"],
        yieldLossEstimate: "Unknown",
        urgency: "monitoring",
      };
    }

    const isHealthy = info.disease === "Healthy";

    return {
      disease: info.disease,
      crop: info.crop,
      confidence: Math.round(topConf * 100),
      severity: info.severity,
      category: info.category,
      isHealthy,
      topPredictions: topResults.map((r) => ({
        label: metadata!.class_labels[r.i],
        confidence: Math.round(r.prob * 100),
      })),
      treatment: info.treatment,
      prevention: info.prevention,
      yieldLossEstimate: info.yieldLoss,
      urgency: isHealthy
        ? "none"
        : info.severity === "critical"
          ? "immediate"
          : info.severity === "high"
            ? "within_week"
            : "monitoring",
    };
  } finally {
    input.dispose();
  }
}

/**
 * Classify a base64-encoded image (e.g. from file upload / camera capture).
 */
export async function classifyBase64Image(
  base64DataUrl: string,
  topK = 3,
): Promise<DiseaseDetectionResult | null> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        const result = await classifyImage(img, topK);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = base64DataUrl;
  });
}

/** Dispose the model and free GPU/CPU memory. */
export function disposeDiseaseModel(): void {
  if (model) {
    model.dispose();
    model = null;
  }
  metadata = null;
  loadingPromise = null;
}
