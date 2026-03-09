# PlantVillage Disease Detection — TensorFlow.js Model Training

## Overview
Fine-tunes **MobileNetV2** on the [PlantVillage dataset](https://www.kaggle.com/datasets/emmarex/plantdisease) (54,000+ images, 38 disease/healthy classes) and exports a TensorFlow.js model for **offline browser-based inference**.

## Prerequisites
- Python 3.10+
- ~2 GB disk space (dataset + model)
- GPU recommended (CUDA-enabled) — CPU training works but is slower
- Kaggle account (for dataset download)

## Setup

```bash
cd scripts/train-plant-disease-model
pip install -r requirements.txt

# Configure Kaggle credentials (one of):
# Option A: Environment variables
export KAGGLE_USERNAME=your_username
export KAGGLE_KEY=your_api_key

# Option B: ~/.kaggle/kaggle.json
```

## Train

```bash
python train.py
```

### What happens:
1. Downloads PlantVillage dataset via `kagglehub`
2. Splits into 80% train / 20% validation
3. Builds MobileNetV2 with custom classification head
4. **Phase 1** — trains head only (15 epochs) with data augmentation
5. **Phase 2** — fine-tunes top MobileNetV2 layers (10 epochs)
6. Exports to `public/models/plant-disease/` as TF.js LayersModel

### Expected output:
```
public/models/plant-disease/
├── model.json          # Model topology
├── group1-shard1of4.bin  # Weight shards (~9 MB total)
├── group1-shard2of4.bin
├── group1-shard3of4.bin
├── group1-shard4of4.bin
└── metadata.json       # Class labels + config
```

## Expected Accuracy
- **~95-97%** validation accuracy on PlantVillage (38 classes)
- MobileNetV2 is optimized for mobile/browser: ~9 MB model size, ~100ms inference

## 38 PlantVillage Classes
| Crop | Classes |
|------|---------|
| Tomato | Early Blight, Late Blight, Bacterial Spot, Leaf Mold, Septoria, Spider Mites, Target Spot, Mosaic Virus, Yellow Leaf Curl, Healthy |
| Potato | Early Blight, Late Blight, Healthy |
| Corn | Cercospora Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| Apple | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| Grape | Black Rot, Esca, Leaf Blight, Healthy |
| Pepper | Bacterial Spot, Healthy |
| Cherry | Powdery Mildew, Healthy |
| Peach | Bacterial Spot, Healthy |
| Strawberry | Leaf Scorch, Healthy |
| Orange | Haunglongbing |
| Squash | Powdery Mildew |
| Blueberry, Raspberry, Soybean | Healthy |

## Frontend Integration
After training, the model loads in-browser via `src/lib/diseaseModel.ts`:
```typescript
import { loadDiseaseModel, classifyImage } from '@/lib/diseaseModel';

await loadDiseaseModel();
const result = await classifyImage(imageElement);
// { disease: 'Early Blight', confidence: 0.94, crop: 'Tomato', ... }
```
