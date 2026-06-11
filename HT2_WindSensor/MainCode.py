import pandas as pd

# อ่านไฟล์
df = pd.read_csv("Export.csv", skiprows=1)

# ลบช่องว่างชื่อคอลัมน์
df.columns = df.columns.str.strip()

# แปลงข้อมูลเป็นตัวเลข
df["Wind Direction"] = pd.to_numeric(df["Wind Direction"], errors="coerce")
df["Wind Speed"] = pd.to_numeric(df["Wind Speed"], errors="coerce")

sensor_cols = [
    "Sensor 1",
    "Sensor 2",
    "Sensor 3",
    "Sensor 4",
    "Sensor 5",
    "Sensor 6",
    "Sensor 7",
    "Sensor 8"
]

for col in sensor_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# ลบข้อมูลว่าง
df = df.dropna(subset=["Wind Direction", "Wind Speed"])

# กรองข้อมูลผิดสเปก
df = df[(df["Wind Speed"] >= 0) & (df["Wind Speed"] <= 40)]

# แบ่งทิศลมเป็น 4 กลุ่ม
df["Direction"] = pd.cut(
    df["Wind Direction"],
    bins=[0, 90, 180, 270, 360],
    labels=["0-90", "91-180", "181-270", "271-360"],
    include_lowest=True
)

# ค่าเฉลี่ย Sensor ทั้ง 8 ตัวของแต่ละแถว
df["Gas_Avg"] = df[sensor_cols].mean(axis=1)

# ค่าเฉลี่ยรวมตามทิศลม
result = df.groupby("Direction")["Gas_Avg"].mean()

print("ค่าเฉลี่ย Sensor Gas ตามทิศลม")
print(result)

# ทิศที่มีค่าเฉลี่ยสูงสุด
max_dir = result.idxmax()
max_value = result.max()

print("\nทิศที่มีกลิ่นสูงสุด")
print(f"{max_dir} : {max_value:.2f}")