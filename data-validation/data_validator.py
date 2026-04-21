import pandas as pd
import json
import sys

def load_api_data(file_path):
    with open(file_path) as f:
        return pd.DataFrame(json.load(f)['data'])

def load_expected_data(file_path):
    if file_path.endswith('.csv'):
        return pd.read_csv(file_path)
    return pd.DataFrame(json.load(open(file_path)))

def validate_row_level(api_df, expected_df):
    errors = []

    for idx, row in api_df.iterrows():
        if not row['first_name']:
            errors.append(f"Row {idx}: Missing first_name")

        if not row['last_name']:
            errors.append(f"Row {idx}: Missing last_name")

        if '@' not in row['email']:
            errors.append(f"Row {idx}: Invalid email {row['email']}")

    return errors

def validate_aggregation(api_df):
    if api_df['id'].nunique() != len(api_df):
        raise Exception("Duplicate IDs found")

def validate_schema(api_df, expected_df):
    expected_cols = set(expected_df.columns)
    api_cols = set(api_df.columns)

    if not expected_cols.issubset(api_cols):
        raise Exception(f"Schema mismatch. Missing: {expected_cols - api_cols}")

def validate_nulls(api_df):
    if api_df.isnull().sum().sum() > 0:
        raise Exception("Null values detected")

# 🚀 THIS IS THE FIXED PART
def run(api_file, expected_file):
    api_df = load_api_data(api_file)
    expected_df = load_expected_data(expected_file)

    errors = []

    try:
        validate_schema(api_df, expected_df)
    except Exception as e:
        errors.append(str(e))

    errors += validate_row_level(api_df, expected_df)

    try:
        validate_aggregation(api_df)
    except Exception as e:
        errors.append(str(e))

    try:
        validate_nulls(api_df)
    except Exception as e:
        errors.append(str(e))

    if errors:
        print(json.dumps({
            "status": "failed",
            "errors": errors
        }))
        sys.exit(1)

    print(json.dumps({ "status": "passed" }))

if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2])