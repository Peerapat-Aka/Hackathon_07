import pandas as pd

df = pd.read_excel('hack.xlsx')

# ตัดแถวค่าว่างและ all-zero
df = df.dropna(subset=['Temperature', 'Relative Humidity'])
df = df[~(df[['Temperature', 'Relative Humidity']] == 0).all(axis=1)]

total = len(df)

# คำนวณขอบ IQR สำหรับแต่ละคอลัมน์
def iqr_bounds(series):
    Q1, Q3 = series.quantile(0.25), series.quantile(0.75)
    IQR = Q3 - Q1
    return Q1 - 1.5 * IQR, Q3 + 1.5 * IQR

temp_low_bound, temp_high_bound = iqr_bounds(df['Temperature'])
rh_low_bound,   rh_high_bound   = iqr_bounds(df['Relative Humidity'])

# แท็กแต่ละแถว
def label(row):
    tags = []
    if row['Temperature'] > temp_high_bound:      tags.append(f'🌡️ อุณหภูมิสูงผิดปกติ (>{temp_high_bound:.2f}°C)')
    elif row['Temperature'] < temp_low_bound:     tags.append(f'🥶 อุณหภูมิต่ำผิดปกติ (<{temp_low_bound:.2f}°C)')
    if row['Relative Humidity'] > rh_high_bound:  tags.append(f'💧 ความชื้นสูงผิดปกติ (>{rh_high_bound:.2f}%)')
    elif row['Relative Humidity'] < rh_low_bound: tags.append(f'🏜️ ความชื้นต่ำผิดปกติ (<{rh_low_bound:.2f}%)')
    return ', '.join(tags) if tags else 'ปกติ'

df['anomaly_type'] = df.apply(label, axis=1)
df_out = df[df['anomaly_type'] != 'ปกติ'].copy()

# นับแต่ละกลุ่ม
temp_high = (df['Temperature'] > temp_high_bound).sum()
temp_low  = (df['Temperature'] < temp_low_bound).sum()
rh_high   = (df['Relative Humidity'] > rh_high_bound).sum()
rh_low    = (df['Relative Humidity'] < rh_low_bound).sum()

print("=" * 50)
print(f"📊 ข้อมูลทั้งหมด : {total:,} แถว")
print(f"❌ ผิดปกติรวม   : {len(df_out):,} แถว ({len(df_out)/total*100:.2f}%)")
print("=" * 50)
print(f"\n🌡️  อุณหภูมิ (ขอบปกติ: {temp_low_bound:.2f} ถึง {temp_high_bound:.2f} °C)")
print(f"   สูงผิดปกติ : {temp_high:,} แถว ({temp_high/total*100:.2f}%)")
print(f"   ต่ำผิดปกติ : {temp_low:,}  แถว ({temp_low/total*100:.2f}%)")
print(f"\n💧 ความชื้น (ขอบปกติ: {rh_low_bound:.2f} ถึง {rh_high_bound:.2f} %)")
print(f"   สูงผิดปกติ : {rh_high:,} แถว ({rh_high/total*100:.2f}%)")
print(f"   ต่ำผิดปกติ : {rh_low:,}  แถว ({rh_low/total*100:.2f}%)")
print("=" * 50)

df_out.to_excel('report.xlsx', index=False)
print("💾 บันทึกไฟล์ report.xlsx เรียบร้อย!")