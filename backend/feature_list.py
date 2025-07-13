import os, joblib


BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

_rf = joblib.load(os.path.join(MODEL_DIR, "random_forest_model.joblib"))
FEATURE_LIST = list(_rf.feature_names_in_)
