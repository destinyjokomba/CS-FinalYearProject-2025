# ─── train_model_2028.py ─────────────────────────────────────────────────────
import os
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from xgboost import XGBClassifier, plot_importance
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score, ConfusionMatrixDisplay
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from imblearn.over_sampling import SMOTE
import warnings

# ─── Set Seeds ───
np.random.seed(42)
warnings.filterwarnings("ignore", category=UserWarning)

# ─── Paths ───
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, '../data/processed_dataset_2028.csv')
MODEL_PATH = os.path.join(BASE_DIR, '../models/xgb_model_2028.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, '../models/xgb_encoder_2028.pkl')
PIPELINE_PATH = os.path.join(BASE_DIR, '../models/xgb_pipeline_2028.pkl')
REPORT_PATH = os.path.join(BASE_DIR, '../data/xgb_report_2028.csv')
CONF_MATRIX_PATH = os.path.join(BASE_DIR, '../data/xgb_conf_matrix_2028.png')
FEATURE_IMPORTANCE_PATH = os.path.join(BASE_DIR, '../data/xgb_feature_importance_2028.png')

# ─── Label Mapping ───
target_col = '2028__winner'
label_mapping = {
    "lab": 0, "reform": 1, "con": 2, "ld": 3,
    "green": 4, "snp": 5, "other": 6
}
inverse_mapping = {v: k for k, v in label_mapping.items()}

# ─── Feature Setup ───
raw_features = [
    "age_bracket", "education_level", "household_income", "socioeconomic_class",
    "housing_status", "constituency_leaning", "vote_national", "vote_local",
    "satisfaction_national_government", "importance_economy", "importance_social_issues",
    "support_welfare_spending", "tax_on_wealthy", "trust_mainstream_media",
    "concern_political_corruption", "climate_priority", "immigration_policy_stance",
    "trust_public_institutions"
]
engineered_features = [
    "is_fiscally_conservative", "is_climate_priority", "is_media_skeptic",
    "is_snp_region", "is_reform_minded", "is_social_justice_focused",
    "education_score", "income_score", "media_trust_score", "gov_satisfaction_score"
]
all_features = raw_features + engineered_features

# ─── Load & Clean Data ───
df = pd.read_csv(DATA_PATH)
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
X_raw = df[all_features]
y_raw = df[target_col].map(label_mapping)

print("\n🔍 Original Class Distribution:")
print(y_raw.value_counts().rename(index=inverse_mapping))

# ─── Encode Categorical ───
categorical_cols = raw_features
encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
X_encoded = encoder.fit_transform(df[categorical_cols])
encoded_feature_names = encoder.get_feature_names_out(categorical_cols)
encoded_df = pd.DataFrame(X_encoded, columns=encoded_feature_names)

df_engineered = df[engineered_features].reset_index(drop=True)
X_full = pd.concat([encoded_df, df_engineered], axis=1)

joblib.dump(encoder, ENCODER_PATH)

# ─── Balance with SMOTE ───
smote = SMOTE(sampling_strategy="auto", random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_full, y_raw)

print("\n✅ Balanced Class Distribution:")
print(pd.Series(y_resampled).value_counts().rename(index=inverse_mapping))

# ─── Split ───
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, stratify=y_resampled, random_state=42
)

# ─── Train ───
model = XGBClassifier(
    objective="multi:softprob", num_class=7,
    eval_metric="mlogloss", use_label_encoder=False,
    max_depth=6,             # Increased depth
    learning_rate=0.05,      # Lower for better generalization
    n_estimators=300,        # More trees
    subsample=0.9,           # More rows per tree
    colsample_bytree=0.9,    # More features per tree
    random_state=42
)
model.fit(X_train, y_train)
joblib.dump(model, MODEL_PATH)

# ─── Evaluate ───
y_pred = model.predict(X_test)
probs = model.predict_proba(X_test)

report = classification_report(y_test, y_pred, target_names=list(inverse_mapping.values()), output_dict=True)
report_df = pd.DataFrame(report).transpose()
report_df.to_csv(REPORT_PATH)

print("\n📊 Classification Report:")
print(report_df)
print(f"\n✅ Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(f"✅ F1 Macro: {f1_score(y_test, y_pred, average='macro'):.2f}")

# ─── Confusion Matrix ───
ConfusionMatrixDisplay.from_predictions(y_test, y_pred, display_labels=list(inverse_mapping.values()), xticks_rotation=45)
plt.tight_layout()
plt.savefig(CONF_MATRIX_PATH)

# ─── Feature Importance ───
plt.figure(figsize=(10, 8))
plot_importance(model, max_num_features=15)
plt.tight_layout()
plt.savefig(FEATURE_IMPORTANCE_PATH)

# ─── Save Pipeline ───
pipeline = Pipeline([
    ('encoder', encoder),
    ('model', model)
])
FINAL_MODEL_PATH = os.path.join(BASE_DIR, '../models/final_model.pkl')
joblib.dump(pipeline, FINAL_MODEL_PATH)
print("\n✅ Final model saved at:", FINAL_MODEL_PATH)
