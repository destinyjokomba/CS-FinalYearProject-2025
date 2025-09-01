# ─── PREPROCESSING SCRIPT (OPTIMIZED) ─────────────────────────────────────

import os
import pandas as pd

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
RAW_PATH = os.path.join(BASE_DIR, '../data/raw/survey.csv')
CLEAN_PATH = os.path.join(BASE_DIR, '../data/cleaned_dataset_2028.csv')

os.makedirs(os.path.dirname(CLEAN_PATH), exist_ok=True)

def preprocess():
    df = pd.read_csv(RAW_PATH)
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    # ─── Normalize party names ────────────────────────────────────────────
    party_map = {
        "labour": "lab", "lab": "lab", "labour party": "lab", "lab.": "lab",
        "conservative": "con", "con": "con", "tory": "con", "tories": "con",
        "lib dem": "ld", "liberal democrat": "ld", "ld": "ld",
        "green": "green", "green party": "green",
        "reform": "reform", "reform uk": "reform",
        "snp": "snp", "scottish national party": "snp"
    }
    df["2028__winner"] = (
        df["2028__winner"]
        .astype(str).str.lower().str.strip()
        .map(party_map).fillna("other")
    )

    # ─── Standardize object columns ───────────────────────────────────────
    for col in df.select_dtypes(include='object').columns:
        df[col] = df[col].astype(str).str.strip().str.lower()

    # ─── Map ordinal categorical responses ────────────────────────────────
    satisfaction_map = {"very satisfied": 2, "somewhat satisfied": 1, "not satisfied": 0}
    importance_map = {"very important": 2, "somewhat important": 1, "not important": 0}
    trust_map = {"high": 2, "medium": 1, "low": 0}
    binary_map = {"yes": 1, "no": 0}
    immigration_map = {"more strict": 0, "same": 1, "more open": 2}

    df["satisfaction_national_government"] = df["satisfaction_national_government"].map(satisfaction_map)
    df["importance_economy"] = df["importance_economy"].map(importance_map)
    df["importance_social_issues"] = df["importance_social_issues"].map(importance_map)
    df["trust_mainstream_media"] = df["trust_mainstream_media"].map(trust_map)
    df["trust_public_institutions"] = df["trust_public_institutions"].map(trust_map)
    df["climate_priority"] = df["climate_priority"].map(binary_map)
    df["support_welfare_spending"] = df["support_welfare_spending"].map(binary_map)
    df["tax_on_wealthy"] = df["tax_on_wealthy"].map(binary_map)
    df["concern_political_corruption"] = df["concern_political_corruption"].map(binary_map)
    df["immigration_policy_stance"] = df["immigration_policy_stance"].map(immigration_map)

    # ─── Optional: Encode age and income brackets numerically ─────────────
    age_map = {
        "under 18": 0, "18–24": 1, "25–34": 2, "35–44": 3,
        "45–54": 4, "55–64": 5, "65+": 6
    }
    df["age_bracket"] = df["age_bracket"].map(age_map)

    income_map = {
        "under £20,000": 0,
        "£20,000–£40,000": 1,
        "£40,000–£60,000": 2,
        "£60,000–£80,000": 3,
        "£80,000+": 4
    }
    if "household_income" in df.columns:
        df["household_income"] = df["household_income"].map(income_map)

    # ─── Drop any remaining nulls ─────────────────────────────────────────
    df.dropna(inplace=True)

    # ─── Save and report class balance ────────────────────────────────────
    print("🗳️ Final Class Distribution:")
    print(df["2028__winner"].value_counts())

    df.to_csv(CLEAN_PATH, index=False)
    print(f"✅ Preprocessed data saved to: {CLEAN_PATH} | Rows: {len(df)}")

if __name__ == "__main__":
    preprocess()
