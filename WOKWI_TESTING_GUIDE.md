# 🎮 Wokwi Testing Guide - ESP32 RFID to Render Backend

## System Flow
```
RFID Card Tap
    ↓
ESP32 (Wokwi Simulator)
    ↓
POST to: https://smart-attendance-89wy.onrender.com/rfid-scan
    ↓
Render Backend (Node.js)
    ↓
Supabase Database
    ↓
JSON Response
    ↓
16x2 I2C LCD Display
```

---

## Hardware Setup in Wokwi

### Components Needed:
- ESP32 DevKit V1
- MFRC522 RFID Reader
- 16x2 I2C LCD Display (0x27)
- RFID Card/Tag

### Pin Connections:

**RFID Reader (MFRC522):**
```
MFRC522   →   ESP32
SDA (10)  →   GPIO 5  (SS)
SCK (13)  →   GPIO 18 (CLK)
MOSI (11) →   GPIO 23 (MOSI)
MISO (12) →   GPIO 19 (MISO)
RST (9)   →   GPIO 27 (RST)
GND       →   GND
3V3       →   3V3
```

**I2C LCD (0x27):**
```
LCD    →   ESP32
SDA    →   GPIO 21 (SDA)
SCL    →   GPIO 22 (SCL)
GND    →   GND
VCC    →   3V3
```

---

## Test Steps

### 1. Open Wokwi Simulator
Go to: https://wokwi.com

### 2. Create New Project
- Language: C/C++ (Arduino)
- Board: ESP32

### 3. Paste sketch.ino
Copy entire content from [sketch.ino](sketch.ino) into the code editor

### 4. Add Libraries
In `diagram.json`, add:
```json
{
  "version": 1,
  "author": "YourName",
  "title": "RFID Attendance System",
  "description": "ESP32 RFID Scanner to Cloud Backend",
  "parts": [
    {
      "type": "wokwi-esp32-devkit-v1",
      "id": "esp",
      "top": 50,
      "left": 50
    },
    {
      "type": "wokwi-rfid-reader",
      "id": "rfid",
      "top": 200,
      "left": 50
    },
    {
      "type": "wokwi-lcd1602",
      "id": "lcd",
      "top": 300,
      "left": 300,
      "attrs": {
        "address": "0x27"
      }
    }
  ],
  "connections": [
    ["esp:5", "rfid:SDA"],
    ["esp:18", "rfid:SCK"],
    ["esp:23", "rfid:MOSI"],
    ["esp:19", "rfid:MISO"],
    ["esp:27", "rfid:RST"],
    ["esp:GND", "rfid:GND"],
    ["esp:3V3", "rfid:3V3"],
    ["esp:21", "lcd:SDA"],
    ["esp:22", "lcd:SCL"],
    ["esp:GND", "lcd:GND"],
    ["esp:3V3", "lcd:VCC"]
  ]
}
```

### 5. Verify Backend is Running
Check Render dashboard:
```
https://dashboard.render.com → smart-attendance-backend
```
Status should be **"Live"**

### 6. Start Simulation
Click **"Start"** button

Expected output in Serial Monitor:
```
Connecting WiFi.....
WiFi Connected!
192.168.x.x

System Ready
```

### 7. Simulate RFID Card Tap
In Wokwi:
1. Click on RFID Reader
2. Click **"Read Tag"** or drag simulated tag
3. Enter UID: `A1B2C3D4` (our test user)

### 8. Check LCD Display
Should show:
```
Line 1: Juan Dela Cruz
Line 2: TIME IN
```
(or TIME OUT on second tap)

### 9. Verify Backend Response
Check in Serial Monitor:
```
Sending: {"uid":"A1B2C3D4"}
Response: {"status":"success","uid":"A1B2C3D4","name":"Juan Dela Cruz",...}
```

### 10. Verify Supabase Database
```bash
# Query attendance records
curl "https://dxjsmxnfgapfpmtajefm.supabase.co/rest/v1/attendance" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Should return attendance record with `user_id` and `event_id`

---

## Testing Scenarios

### Test 1: Unknown UID
**Input**: `UNKNOWN123`
**Expected LCD**: "User Not Found"
**Status**: ✅

### Test 2: First Scan (TIME IN)
**Input**: `A1B2C3D4`
**Expected LCD**: 
```
Juan Dela Cruz
TIME IN
```
**DB**: New attendance record created
**Status**: ✅

### Test 3: Second Scan (TIME OUT)
**Input**: `A1B2C3D4` (same card)
**Expected LCD**:
```
Juan Dela Cruz
TIME OUT
```
**DB**: Same record, now marked TIME OUT
**Status**: ✅

### Test 4: Different User
**Input**: Create new test user in Supabase with UID `B2C3D4E5`
**Expected LCD**: New user name and TIME IN
**Status**: ✅

---

## Troubleshooting

### LCD shows "WiFi Error"
- ✅ Check Wokwi WiFi simulation is enabled
- ✅ Verify WiFi SSID is `Wokwi-GUEST`
- ✅ Check ESP32 pins 21/22 connected to LCD

### LCD shows "Server Error"
- ✅ Check backend URL is correct: `https://smart-attendance-89wy.onrender.com/rfid-scan`
- ✅ Verify Render backend is **"Live"** status
- ✅ Check Serial Monitor for HTTP error code
- ℹ️ Free Render may sleep - ping it first: `curl https://smart-attendance-89wy.onrender.com/logs`

### LCD shows "JSON Error"
- ✅ Check backend is returning valid JSON
- ✅ Verify response includes `"status"`, `"name"`, `"action"` fields
- ✅ Check Serial Monitor for response body

### RFID tag not being read
- ✅ Click RFID reader component in Wokwi
- ✅ Click **"Read Tag"** or drag virtual tag
- ✅ Enter UID in uppercase (A1B2C3D4)

### Backend timeout
- ✅ HTTP timeout set to 8000ms in sketch
- ✅ If using free Render, backend may be cold-starting
- ✅ Test locally first: `npm start` in backend folder

---

## Live Testing Checklist

- [ ] Wokwi simulation running
- [ ] Serial Monitor shows "System Ready"
- [ ] Render backend shows "Live" status
- [ ] RFID reader responding in simulation
- [ ] LCD displays user information
- [ ] Supabase shows attendance records
- [ ] First scan shows TIME IN
- [ ] Second scan shows TIME OUT
- [ ] Unknown UID shows "User Not Found"

---

## Next: Real Hardware

Once Wokwi testing passes:

1. **Flash to real ESP32**:
   ```bash
   # Using Arduino IDE
   1. Install ESP32 board support
   2. Select Board: ESP32 Dev Module
   3. Select Port: COMx (your ESP32)
   4. Upload sketch
   ```

2. **Connect real RFID reader**:
   - Same pinout as Wokwi diagram
   - Add 5V power supply if needed

3. **Update serverURL if local testing**:
   ```cpp
   const char* serverURL = "http://192.168.x.x:5000/rfid-scan";
   ```
   (Replace with your machine's IP)

---

## Real Hardware Connections

```
ESP32    MFRC522
GPIO 5   SDA
GPIO 18  CLK
GPIO 23  MOSI
GPIO 19  MISO
GPIO 27  RST
GND      GND
3V3      3V3

ESP32    LCD (0x27)
GPIO 21  SDA
GPIO 22  SCL
GND      GND
5V       VCC
```

---

## Success! 🎉

Once real hardware is connected and working:
- RFID cards instantly update attendance in Supabase
- Data visible in Render backend logs
- Ready for production deployment!

