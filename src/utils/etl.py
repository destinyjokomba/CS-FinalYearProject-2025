# src/utils/etl.py

import os

def run(input_dir: str, output_dir: str):
    """
    ETL stub: scans input_dir, processes files, and writes to output_dir.
    """
    os.makedirs(output_dir, exist_ok=True)
    print(f"[ETL] Would process data from {input_dir} into {output_dir}")

if __name__ == "__main__":
    # relative paths from project root
    run("data/raw", "data/processed")
