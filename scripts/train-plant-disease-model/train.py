"""
PlantVillage Disease Detection Model — Training Pipeline
=========================================================
Fine-tunes MobileNetV2 on the PlantVillage dataset (38 classes, 54k+ images)
and exports to TensorFlow.js format for browser-based offline inference.

Usage:
  cd scripts/train-plant-disease-model
  pip install -r requirements.txt
  python train.py

The trained model is exported to public/models/plant-disease/ as a TF.js
LayersModel (model.json + weight shards) ready for @tensorflow/tfjs.
"""

import json
import os
import sys
import shutil
from pathlib import Path

import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau,
)
from sklearn.metrics import classification_report

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
CONFIG_PATH = SCRIPT_DIR / "config.json"

with open(CONFIG_PATH) as f:
    CFG = json.load(f)

IMG_SIZE   = tuple(CFG["image_size"])        # (224, 224)
BATCH      = CFG["batch_size"]               # 32
EPOCHS     = CFG["epochs"]                   # 15 (head only)
FT_EPOCHS  = CFG["fine_tune_epochs"]         # 10 (fine-tune)
LR         = CFG["learning_rate"]            # 1e-3
FT_LR      = CFG["fine_tune_lr"]             # 1e-4
FT_LAYER   = CFG["fine_tune_at_layer"]       # 100
VAL_SPLIT  = CFG["validation_split"]         # 0.2
NUM_CLASSES = CFG["num_classes"]             # 38
CLASS_LABELS = CFG["class_labels"]
OUTPUT_DIR = (SCRIPT_DIR / CFG["output_dir"]).resolve()

# ---------------------------------------------------------------------------
# 1. Download PlantVillage dataset via kagglehub
# ---------------------------------------------------------------------------

def download_dataset() -> Path:
    """Download the PlantVillage dataset and return the root image directory."""
    try:
        import kagglehub
        dataset_path = Path(kagglehub.dataset_download(CFG["dataset"]))
    except Exception as e:
        print(f"kagglehub download failed: {e}")
        print("Trying manual Kaggle API fallback...")
        import subprocess
        subprocess.check_call([
            sys.executable, "-m", "kaggle", "datasets", "download",
            "-d", CFG["dataset"], "--unzip", "-p", str(SCRIPT_DIR / "data"),
        ])
        dataset_path = SCRIPT_DIR / "data"

    # Find the directory containing the class folders
    for root, dirs, _files in os.walk(dataset_path):
        # PlantVillage has folders like "Apple___Apple_scab"
        if any("___" in d for d in dirs):
            return Path(root)

    raise FileNotFoundError(
        f"Could not find PlantVillage class folders under {dataset_path}"
    )


# ---------------------------------------------------------------------------
# 2. Build tf.data pipelines
# ---------------------------------------------------------------------------

def build_datasets(data_dir: Path):
    """Create train/val datasets from the directory structure."""
    train_ds = tf.keras.utils.image_dataset_from_directory(
        str(data_dir),
        validation_split=VAL_SPLIT,
        subset="training",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH,
        label_mode="categorical",
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        str(data_dir),
        validation_split=VAL_SPLIT,
        subset="validation",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=BATCH,
        label_mode="categorical",
    )

    # Remap class names to our canonical ordering
    discovered = train_ds.class_names
    print(f"Discovered {len(discovered)} classes: {discovered[:5]}...")

    # Prefetch for performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(AUTOTUNE)
    val_ds = val_ds.prefetch(AUTOTUNE)

    return train_ds, val_ds, discovered


# ---------------------------------------------------------------------------
# 3. Data augmentation layer
# ---------------------------------------------------------------------------

data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.15),
    layers.RandomZoom(0.1),
    layers.RandomContrast(0.1),
])


# ---------------------------------------------------------------------------
# 4. Build model: MobileNetV2 + custom head
# ---------------------------------------------------------------------------

def build_model(num_classes: int) -> Model:
    """MobileNetV2 transfer-learning model with custom classification head."""
    base = MobileNetV2(
        input_shape=(*IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False  # freeze during head training

    inputs = layers.Input(shape=(*IMG_SIZE, 3))
    x = data_augmentation(inputs)
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    return Model(inputs, outputs, name="plant_disease_mobilenetv2")


# ---------------------------------------------------------------------------
# 5. Train
# ---------------------------------------------------------------------------

def train():
    print(f"TensorFlow {tf.__version__}")
    print(f"GPU available: {tf.config.list_physical_devices('GPU')}")

    # Download
    print("\n[1/5] Downloading PlantVillage dataset...")
    data_dir = download_dataset()
    print(f"  Dataset root: {data_dir}")

    # Datasets
    print("\n[2/5] Building data pipelines...")
    train_ds, val_ds, class_names = build_datasets(data_dir)
    actual_classes = len(class_names)
    print(f"  {actual_classes} classes, ~{len(train_ds) * BATCH} training images")

    # Model
    print("\n[3/5] Building MobileNetV2 model...")
    model = build_model(actual_classes)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LR),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    callbacks = [
        EarlyStopping(patience=5, restore_best_weights=True, monitor="val_accuracy"),
        ReduceLROnPlateau(factor=0.5, patience=3, min_lr=1e-6),
        ModelCheckpoint(
            str(SCRIPT_DIR / "best_model.keras"),
            save_best_only=True,
            monitor="val_accuracy",
        ),
    ]

    # Phase 1: train classification head
    print("\n[4/5] Training classification head...")
    model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS, callbacks=callbacks)

    # Phase 2: fine-tune top layers of MobileNetV2
    print("\n[4b/5] Fine-tuning top MobileNetV2 layers...")
    base_model = model.layers[3]  # MobileNetV2 layer
    base_model.trainable = True
    for layer in base_model.layers[:FT_LAYER]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=FT_LR),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=EPOCHS + FT_EPOCHS,
        initial_epoch=EPOCHS,
        callbacks=callbacks,
    )

    # Evaluate
    loss, acc = model.evaluate(val_ds)
    print(f"\n  Validation — loss: {loss:.4f}, accuracy: {acc:.4f}")

    # ---------------------------------------------------------------------------
    # 6. Export to TensorFlow.js
    # ---------------------------------------------------------------------------
    print("\n[5/5] Exporting to TensorFlow.js format...")

    # Save Keras model first
    keras_path = SCRIPT_DIR / "plant_disease_model.keras"
    model.save(str(keras_path))

    # Convert to TF.js
    import tensorflowjs as tfjs

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    tfjs.converters.save_keras_model(model, str(OUTPUT_DIR))

    # Write class labels alongside model
    metadata = {
        "class_labels": class_names,
        "image_size": list(IMG_SIZE),
        "model_type": "MobileNetV2",
        "num_classes": actual_classes,
        "validation_accuracy": round(float(acc), 4),
        "preprocessing": "mobilenet_v2",
    }
    with open(OUTPUT_DIR / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n✅ Model exported to {OUTPUT_DIR}")
    print(f"   Files: model.json + weight shards + metadata.json")
    print(f"   Validation accuracy: {acc:.1%}")

    # Cleanup
    if keras_path.exists():
        keras_path.unlink()
    best_path = SCRIPT_DIR / "best_model.keras"
    if best_path.exists():
        best_path.unlink()


if __name__ == "__main__":
    train()
