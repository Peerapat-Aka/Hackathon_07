import pandas as pd

# อ่านไฟล์
df = pd.read_csv("Export.csv", skiprows=1)

# ลบช่องว่างชื่อคอลัมน์
df.columns = df.columns.str.strip()

# แปลงเป็นตัวเลข
df["Wind Direction"] = pd.to_numeric(df["Wind Direction"], errors="coerce")
df["Wind Speed"] = pd.to_numeric(df["Wind Speed"], errors="coerce")

# ลบข้อมูลว่าง
df = df.dropna(subset=["Wind Direction", "Wind Speed"])

# กรองความเร็วลมที่ถูกต้อง
df = df[(df["Wind Speed"] >= 0) & (df["Wind Speed"] <= 40)]

# แบ่งกลุ่มทิศทางลม
df["Direction"] = pd.cut(
    df["Wind Direction"],
    bins=[0, 90, 180, 270, 360],
    labels=["0-90", "91-180", "181-270", "271-360"],
    include_lowest=True
)

# ค่าเฉลี่ยความเร็วลมแต่ละทิศ
avg_speed = df.groupby("Direction")["Wind Speed"].mean()

print(avg_speed)

# ทิศที่แรงที่สุด
max_direction = avg_speed.idxmax()
max_speed = avg_speed.max()

print(f"{max_direction} : {max_speed:.2f} m/s")