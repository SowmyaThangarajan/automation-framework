import pandas as pd
import json
import sys


# -----------------------------
# LOADERS
# -----------------------------
def load_api_data(file_path):
    with open(file_path) as f:
        return pd.DataFrame(json.load(f)['data'])


def load_expected_data(file_path):
    if file_path.endswith('.csv'):
        return pd.read_csv(file_path)
    return pd.DataFrame(json.load(open(file_path)))


# -----------------------------
# SCHEMA VALIDATION
# -----------------------------
def validate_schema(api_df, expected_df):
    expected_cols = set(expected_df.columns)
    api_cols = set(api_df.columns)

    if not expected_cols.issubset(api_cols):
        raise Exception(f"Schema mismatch. Missing: {expected_cols - api_cols}")


# -----------------------------
# ROW LEVEL VALIDATION
# -----------------------------
def validate_row_level(api_df):
    errors = []

    for idx, row in api_df.iterrows():
        if not row.get('first_name'):
            errors.append(f"Row {idx}: Missing first_name")

        if not row.get('last_name'):
            errors.append(f"Row {idx}: Missing last_name")

        if '@' not in str(row.get('email', '')):
            errors.append(f"Row {idx}: Invalid email {row.get('email')}")

    return errors


# -----------------------------
# REFERENTIAL INTEGRITY (NEW)
# -----------------------------
def validate_referential_integrity(api_df):
    if api_df['id'].duplicated().any():
        raise Exception("Duplicate primary keys found (referential integrity violation)")


# -----------------------------
# AGGREGATION CHECK
# -----------------------------
def validate_aggregation(api_df):
    if api_df['id'].nunique() != len(api_df):
        raise Exception("Duplicate IDs found (aggregation mismatch)")


# -----------------------------
# NULL CHECK
# -----------------------------
def validate_nulls(api_df):
    if api_df.isnull().sum().sum() > 0:
        raise Exception("Null values detected")


# -----------------------------
# DISTRIBUTION CHECK (NEW)
# -----------------------------
def validate_distribution(api_df):
    if api_df['id'].mean() < 1:
        raise Exception("Data distribution anomaly: mean(id) < 1")

    if api_df['id'].std() == 0:
        raise Exception("Data distribution anomaly: no variance in id")


# -----------------------------
# DATA DRIFT DETECTION (NEW)
# -----------------------------
def validate_drift(api_df, expected_df):
    api_mean = api_df['id'].mean()
    expected_mean = expected_df['id'].mean()

    drift = abs(api_mean - expected_mean)

    if drift > 10:
        raise Exception(f"Data drift detected: mean deviation = {drift}")


# -----------------------------
# MAIN RUNNER
# -----------------------------
def run(api_file, expected_file):
    api_df = load_api_data(api_file)
    expected_df = load_expected_data(expected_file)

    errors = []

    # Schema
    try:
        validate_schema(api_df, expected_df)
    except Exception as e:
        errors.append(str(e))

    # Row-level
    errors += validate_row_level(api_df)

    # Referential Integrity
    try:
        validate_referential_integrity(api_df)
    except Exception as e:
        errors.append(str(e))

    # Aggregation
    try:
        validate_aggregation(api_df)
    except Exception as e:
        errors.append(str(e))

    # Nulls
    try:
        validate_nulls(api_df)
    except Exception as e:
        errors.append(str(e))

    # Distribution
    try:
        validate_distribution(api_df)
    except Exception as e:
        errors.append(str(e))

    # Drift
    try:
        validate_drift(api_df, expected_df)
    except Exception as e:
        errors.append(str(e))

    # -----------------------------
    # FINAL RESULT
    # -----------------------------
    if errors:
        print(json.dumps({
            "status": "failed",
            "error_count": len(errors),
            "errors": errors
        }))
        sys.exit(1)

    print(json.dumps({
        "status": "passed",
        "records": len(api_df)
    }))


if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2])