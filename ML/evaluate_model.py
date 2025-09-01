# ─── evaluate_model.py (Fixed) ─────────────────────────────────────────────
import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, accuracy_score, f1_score, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# ─── Features ───
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

# ─── Paths ───
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

MODEL_DIR = os.path.join(BASE_DIR, "models")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
DATA_DIR = os.path.join(BASE_DIR, "models/data/processed")
os.makedirs(REPORTS_DIR, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "xgb_model_2028.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "xgb_encoder_2028.pkl")
X_TEST_PATH = os.path.join(DATA_DIR, "X_test.csv")
Y_TEST_PATH = os.path.join(DATA_DIR, "y_test.csv")

# ─── Load Model + Encoder + Data ───
print(f"🔍 Loading model from: {MODEL_PATH}")
model = joblib.load(MODEL_PATH)

print(f"🔍 Loading encoder from: {ENCODER_PATH}")
encoder = joblib.load(ENCODER_PATH)

print(f"🔍 Loading test data from: {X_TEST_PATH} and {Y_TEST_PATH}")
X_test = pd.read_csv(X_TEST_PATH)
y_test = pd.read_csv(Y_TEST_PATH).values.ravel()

# ─── Encode Categoricals ───
X_test_ohe = encoder.transform(X_test[raw_features])
encoded_feature_names = encoder.get_feature_names_out(raw_features)

encoded_df = pd.DataFrame(X_test_ohe, columns=encoded_feature_names, index=X_test.index)

# ─── Concatenate Engineered Features (keep index aligned) ───
X_test_full = pd.concat([encoded_df, X_test[engineered_features]], axis=1)

# ─── Handle Missing Values ───
X_test_full = X_test_full.fillna(0)

print(f"✅ Test set shape after encoding: {X_test_full.shape}")

# ─── Predictions ───
y_pred = model.predict(X_test_full)

# ─── Classification Report ───
report = classification_report(y_test, y_pred, output_dict=True)
report_df = pd.DataFrame(report).transpose()

print("\n📊 Classification Report:")
print(report_df)

print(f"\n✅ Accuracy: {accuracy_score(y_test, y_pred):.2f}")
print(f"✅ F1 Macro: {f1_score(y_test, y_pred, average='macro'):.2f}")

# Save reports
csv_path = os.path.join(REPORTS_DIR, "classification_report.csv")
excel_path = os.path.join(REPORTS_DIR, "classification_report.xlsx")
report_df.to_csv(csv_path)
try:
    report_df.to_excel(excel_path)
except ImportError:
    print("⚠️ Install openpyxl to enable Excel export: pip install openpyxl")
print(f"📄 Classification report saved to: {csv_path} & {excel_path}")

# ─── Confusion Matrix ───
labels = sorted(list(set(y_test) | set(y_pred)))
cm = confusion_matrix(y_test, y_pred, labels=labels)

plt.figure(figsize=(10, 7))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=labels,
            yticklabels=labels)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.tight_layout()

cm_path = os.path.join(REPORTS_DIR, "confusion_matrix.png")
plt.savefig(cm_path, dpi=300)
print(f"🖼️ Confusion matrix saved to: {cm_path}")
plt.show()
