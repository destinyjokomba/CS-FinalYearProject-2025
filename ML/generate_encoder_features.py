import os
import pandas as pd
import joblib
import json
from sklearn.preprocessing import OneHotEncoder, LabelEncoder

# ─── Paths ───────────────────────────────────────────────
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../data/processed_dataset_2028.csv')
ENCODED_X_OUT = os.path.join(BASE_DIR, '../data/X_encoded_2028.csv')
ENCODED_Y_OUT = os.path.join(BASE_DIR, '../data/y_encoded_2028.csv')
ENCODER_PATH = os.path.join(BASE_DIR, '../models/onehot_encoder_2028.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, '../models/label_encoder_2028.pkl')
LABEL_MAPPING_JSON = os.path.join(BASE_DIR, '../models/label_mapping_2028.json')

# ─── Ensure Output Directories Exist ─────────────────────
os.makedirs(os.path.dirname(ENCODED_X_OUT), exist_ok=True)
os.makedirs(os.path.dirname(ENCODER_PATH), exist_ok=True)

# ─── Load Dataset ────────────────────────────────────────
df = pd.read_csv(DATA_PATH)
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# ─── Drop Duplicates ─────────────────────────────────────
df.drop_duplicates(inplace=True)

# ─── Check Label Column ──────────────────────────────────
if '2028__winner' in df.columns:
    df.rename(columns={'2028__winner': '2028_winner'}, inplace=True)
elif '2028_winner' not in df.columns:
    raise KeyError("❌ Could not find '2028__winner' or '2028_winner' column.")

# ─── Separate Features & Target ──────────────────────────
X_raw = df.drop(columns=['2028_winner'])
y_raw = df['2028_winner']

# ─── Separate Categorical and Numeric Columns ────────────
categorical_cols = X_raw.select_dtypes(include='object').columns.tolist()
numeric_cols = X_raw.select_dtypes(exclude='object').columns.tolist()

# ─── Encode Categorical Features ─────────────────────────
onehot_encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_categorical_encoded = onehot_encoder.fit_transform(X_raw[categorical_cols])
X_categorical_df = pd.DataFrame(X_categorical_encoded, columns=onehot_encoder.get_feature_names_out(categorical_cols))

# ─── Combine Encoded + Numeric Features ──────────────────
X_final = pd.concat([X_categorical_df, X_raw[numeric_cols].reset_index(drop=True)], axis=1)

# ─── Encode Labels ───────────────────────────────────────
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y_raw)
y_encoded_df = pd.DataFrame({'2028_winner_encoded': y_encoded})

# ─── Save Outputs ────────────────────────────────────────
X_final.to_csv(ENCODED_X_OUT, index=False)
y_encoded_df.to_csv(ENCODED_Y_OUT, index=False)
joblib.dump(onehot_encoder, ENCODER_PATH)
joblib.dump(label_encoder, LABEL_ENCODER_PATH)

# ─── Save Label Mapping to JSON ──────────────────────────
class_map = {
    str(k): int(v)
    for k, v in zip(label_encoder.classes_, label_encoder.transform(label_encoder.classes_))
}
with open(LABEL_MAPPING_JSON, 'w') as f:
    json.dump(class_map, f, indent=2)

# ─── Output Summary ──────────────────────────────────────
print("✅ Encoded features and labels saved successfully.")
print(f"🧠 Label classes: {list(label_encoder.classes_)}")
print(f"📊 X shape: {X_final.shape}, Y shape: {y_encoded_df.shape}")
print(f"🏷️ Label mapping: {class_map}")
