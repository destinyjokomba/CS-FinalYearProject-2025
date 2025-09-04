import joblib
import shap
import pandas as pd

# Load model
pipeline = joblib.load("final_model.pkl")  # or xgb_model_2028.pkl
model = pipeline.named_steps["model"]     # Extract XGBClassifier

# Pick a small sample of your input data
X_sample = pd.read_csv("X_test.csv").head(10)

# Create SHAP explainer
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_sample)

# Save SHAP values to JSON
import json
json.dump(shap_values.tolist(), open("shap_values.json", "w"), indent=2)

# Optional: plot
shap.summary_plot(shap_values, X_sample)
