import pandas as pd
import json
import os

print("Starting generation of dashboard/environmental_data.js...")

# Define paths
base_dir = os.path.dirname(os.path.abspath(__file__))
xlsx_path = os.path.join(base_dir, 'hack.xlsx')
output_js_path = os.path.join(base_dir, '..', 'dashboard', 'environmental_data.js')

# Read data
df = pd.read_excel(xlsx_path)

# Data cleaning (same as t.py)
df = df.dropna(subset=['Temperature', 'Relative Humidity'])
df = df[~(df[['Temperature', 'Relative Humidity']] == 0).all(axis=1)]

total_rows = len(df)

# IQR calculations
def iqr_bounds(series):
    Q1, Q3 = series.quantile(0.25), series.quantile(0.75)
    IQR = Q3 - Q1
    return Q1 - 1.5 * IQR, Q3 + 1.5 * IQR

temp_low_bound, temp_high_bound = iqr_bounds(df['Temperature'])
rh_low_bound,   rh_high_bound   = iqr_bounds(df['Relative Humidity'])

# Tag anomalies
def label(row):
    tags = []
    if row['Temperature'] > temp_high_bound:      tags.append(f'🌡️ อุณหภูมิสูงผิดปกติ (>{temp_high_bound:.2f}°C)')
    elif row['Temperature'] < temp_low_bound:     tags.append(f'🥶 อุณหภูมิต่ำผิดปกติ (<{temp_low_bound:.2f}°C)')
    if row['Relative Humidity'] > rh_high_bound:  tags.append(f'💧 ความชื้นสูงผิดปกติ (>{rh_high_bound:.2f}%)')
    elif row['Relative Humidity'] < rh_low_bound: tags.append(f'🏜️ ความชื้นต่ำผิดปกติ (<{rh_low_bound:.2f}%)')
    return ', '.join(tags) if tags else 'ปกติ'

df['anomaly_type'] = df.apply(label, axis=1)
df_anomalies = df[df['anomaly_type'] != 'ปกติ'].copy()

# Anomaly counts
temp_high = int((df['Temperature'] > temp_high_bound).sum())
temp_low  = int((df['Temperature'] < temp_low_bound).sum())
rh_high   = int((df['Relative Humidity'] > rh_high_bound).sum())
rh_low    = int((df['Relative Humidity'] < rh_low_bound).sum())

# Format anomaly rows for JS
anomalies_list = []
for idx, row in df_anomalies.iterrows():
    # Convert Timestamp to string
    time_str = str(row['Time'])
    anomalies_list.append({
        'time': time_str,
        'temp': float(row['Temperature']),
        'rh': float(row['Relative Humidity']),
        'pm25': float(row['PM 2.5']) if pd.notna(row['PM 2.5']) else 0.0,
        'smell': str(row['Smell Prediction']) if pd.notna(row['Smell Prediction']) else 'Ambient',
        'type': str(row['anomaly_type'])
    })

# Format the final dictionary
dashboard_data = {
    'summary': {
        'totalRows': total_rows,
        'anomaliesCount': len(df_anomalies),
        'anomalyPercent': f"{len(df_anomalies)/total_rows*100:.2f}",
        'tempBounds': {
            'low': round(temp_low_bound, 2),
            'high': round(temp_high_bound, 2)
        },
        'rhBounds': {
            'low': round(rh_low_bound, 2),
            'high': round(rh_high_bound, 2)
        },
        'tempHighCount': temp_high,
        'tempLowCount': temp_low,
        'rhHighCount': rh_high,
        'rhLowCount': rh_low
    },
    'anomalies': anomalies_list
}

# Write JavaScript file
js_content = f"const environmentalData = {json.dumps(dashboard_data, ensure_ascii=False, indent=4)};\n"
with open(output_js_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated data file successfully at {output_js_path}!")
print(f"Total rows: {total_rows}")
print(f"Anomalies: {len(df_anomalies)} ({len(df_anomalies)/total_rows*100:.2f}%)")
print(f"Temp bounds: {temp_low_bound:.2f} - {temp_high_bound:.2f}")
print(f"RH bounds: {rh_low_bound:.2f} - {rh_high_bound:.2f}")
