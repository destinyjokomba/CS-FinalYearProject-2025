import os
import joblib
import json
import numpy as np
import pandas as pd

# ─── Paths ───
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
OUTPUT_DIR = os.path.join(BASE_DIR, "reports/model_info")
os.makedirs(OUTPUT_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "xgb_model_2028.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "xgb_encoder_2028.pkl")
PIPELINE_PATH = os.path.join(MODEL_DIR, "final_model.pkl")

# ─── Load Models ───
print("🔍 Loading model, encoder, and pipeline...")
model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)
pipeline = joblib.load(PIPELINE_PATH)

# ─── Extract Info ───
model_info = {
    "Model Type": str(type(model)),
    "Hyperparameters": model.get_params(),
    "Num Classes": getattr(model, "n_classes_", None),
    "Feature Importances": getattr(model, "feature_importances_", None).tolist() if hasattr(model, "feature_importances_") else None
}

encoder_info = {
    "Encoder Type": str(type(encoder)),
    "Categories": {f: cats.tolist() for f, cats in zip(encoder.feature_names_in_, encoder.categories_)} if hasattr(encoder, "categories_") else None,
    "Output Features": encoder.get_feature_names_out().tolist()
}

pipeline_info = {
    "Pipeline Steps": [str(step) for step in pipeline.steps]
}

# ─── Save as JSON ───
with open(os.path.join(OUTPUT_DIR, "model_info.json"), "w") as f:
    json.dump(model_info, f, indent=4)

with open(os.path.join(OUTPUT_DIR, "encoder_info.json"), "w") as f:
    json.dump(encoder_info, f, indent=4)

with open(os.path.join(OUTPUT_DIR, "pipeline_info.json"), "w") as f:
    json.dump(pipeline_info, f, indent=4)

# ─── Save as TXT ───
with open(os.path.join(OUTPUT_DIR, "model_info.txt"), "w") as f:
    f.write("=== MODEL INFO ===\n")
    f.write(json.dumps(model_info, indent=4))

with open(os.path.join(OUTPUT_DIR, "encoder_info.txt"), "w") as f:
    f.write("=== ENCODER INFO ===\n")
    f.write(json.dumps(encoder_info, indent=4))

with open(os.path.join(OUTPUT_DIR, "pipeline_info.txt"), "w") as f:
    f.write("=== PIPELINE INFO ===\n")
    f.write(json.dumps(pipeline_info, indent=4))

print(f"✅ Model info saved to: {OUTPUT_DIR}")
