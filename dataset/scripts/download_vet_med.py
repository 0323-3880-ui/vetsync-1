# -*- coding: utf-8 -*-
"""
VetSync - Download houck2040/vet_med Dataset
=============================================
Downloads the vet_med dataset from HuggingFace and saves
it as local CSV files for offline use by the knowledge base builder.

Usage (from project root):
    python dataset/scripts/download_vet_med.py
"""

import os
import sys

def main():
    print("=" * 60)
    print("  VetSync - Downloading houck2040/vet_med Dataset")
    print("=" * 60)

    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    BASE_DIR   = os.path.dirname(SCRIPT_DIR)
    RAW_DIR    = os.path.join(BASE_DIR, "raw")
    os.makedirs(RAW_DIR, exist_ok=True)

    out_train = os.path.join(RAW_DIR, "vet_med_train.csv")
    out_test  = os.path.join(RAW_DIR, "vet_med_test.csv")

    if os.path.exists(out_train) and os.path.getsize(out_train) > 1000:
        print(f"[SKIP] Dataset already exists at: {out_train}")
        print(f"       Size: {os.path.getsize(out_train):,} bytes")
        print(f"       Delete the file and re-run to re-download.")
        return

    # Method 1: pandas direct read
    print("\n[1/2] Attempting download via pandas (direct CSV)...")
    try:
        import pandas as pd

        HF_BASE = "hf://datasets/houck2040/vet_med/"
        splits = {
            'train': 'vetmed_mask_train.csv',
            'test':  'vetmed_mask_test.csv',
        }

        df_train = pd.read_csv(HF_BASE + splits['train'])
        df_train.to_csv(out_train, index=False)
        print(f"   [OK] Train split saved: {out_train} ({len(df_train)} rows)")

        try:
            df_test = pd.read_csv(HF_BASE + splits['test'])
            df_test.to_csv(out_test, index=False)
            print(f"   [OK] Test split saved:  {out_test} ({len(df_test)} rows)")
        except Exception:
            print(f"   [WARN] Test split not available (train-only dataset)")

        print("\n[DONE] Download complete via pandas!")
        _print_preview(out_train)
        return

    except Exception as e:
        print(f"   [WARN] Pandas direct read failed: {e}")
        print("   Falling back to HuggingFace datasets library...\n")

    # Method 2: HuggingFace datasets library
    print("[2/2] Attempting download via `datasets` library...")
    try:
        from datasets import load_dataset
        import pandas as pd

        ds = load_dataset("houck2040/vet_med")
        print(f"   Dataset loaded. Splits: {list(ds.keys())}")

        for split_name in ds:
            df = ds[split_name].to_pandas()
            out_path = os.path.join(RAW_DIR, f"vet_med_{split_name}.csv")
            df.to_csv(out_path, index=False)
            print(f"   [OK] {split_name}: {out_path} ({len(df)} rows)")

        print("\n[DONE] Download complete via datasets library!")
        _print_preview(out_train)
        return

    except ImportError:
        print("   [ERROR] 'datasets' library not installed.")
        print("      Run: pip install datasets")
        sys.exit(1)
    except Exception as e:
        print(f"   [ERROR] Download failed: {e}")
        sys.exit(1)


def _print_preview(csv_path):
    try:
        import pandas as pd
        df = pd.read_csv(csv_path, nrows=5)
        print(f"\n--- Preview ({os.path.basename(csv_path)}) ---")
        print(f"Columns: {list(df.columns)}")
        print(f"Shape:   {df.shape}")
        print(df.head(3).to_string(index=False, max_colwidth=60))
        print("---\n")
    except Exception:
        pass


if __name__ == "__main__":
    main()
