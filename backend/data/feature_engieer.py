import os
import pandas as pd

# ──────────────────── Paths ──────────────────────
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_IN = os.path.join(BASE_DIR, '../data/raw/survey.csv')
DATA_OUT = os.path.join(BASE_DIR, '../data/processed_dataset_2028.csv')

os.makedirs(os.path.dirname(DATA_OUT), exist_ok=True)

# ──────────────────── Party Mapping ──────────────────────
PARTY_MAPPING = {
    "labour": "lab", "lab": "lab",
    "conservative": "con", "con": "con",
    "lib dem": "ld", "liberal democrat": "ld", "ld": "ld",
    "green": "green",
    "reform": "reform",
    "snp": "snp"
}
VALID_PARTIES = list(PARTY_MAPPING.values())

# ──────────────────── Feature Engineering ──────────────────────
def feature_engineer(df):
    # Normalize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    # Clean target label if present
    if "2028__winner" in df.columns:
        df["2028__winner"] = (
            df["2028__winner"]
            .astype(str)
            .str.lower()
            .str.strip()
            .map(PARTY_MAPPING)
            .fillna("other")
        )
        df = df[df["2028__winner"].notnull()]

    # Drop duplicates
    df.drop_duplicates(inplace=True)

    # Normalize string columns
    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = df[col].str.strip().str.lower()

    # Drop rows with missing values in features
    feature_cols = [col for col in df.columns if col != "2028__winner"]
    df.dropna(subset=feature_cols, inplace=True)

    return df

# ──────────────────── Main ──────────────────────
def clean_and_engineer():
    df = pd.read_csv(DATA_IN)
    df = feature_engineer(df)
    df.to_csv(DATA_OUT, index=False)
    print(f"✅ Feature-engineered dataset saved to: {DATA_OUT} | Rows: {len(df)}")

if __name__ == "__main__":
    clean_and_engineer()
