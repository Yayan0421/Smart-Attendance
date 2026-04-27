#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h>

// RFID pins
#define SS_PIN 5
#define RST_PIN 27

MFRC522 rfid(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);

// WiFi (Wokwi)
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// 🔥 BACKEND URL - Use your deployed Render URL
// Update this with your backend URL: https://your-backend.onrender.com/rfid-scan
const char* serverURL = "https://smart-attendance-89w.onrender.com/rfid-scan";

void setup() {
  Serial.begin(115200);
  delay(1000);

  SPI.begin();
  rfid.PCD_Init();

  lcd.init();
  lcd.backlight();

  // Connect WiFi
  WiFi.begin(ssid, password);

  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi");

  Serial.println("\nConnecting WiFi...");

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect WiFi");
    lcd.clear();
    lcd.print("WiFi Failed");
    delay(1000);
  }

  lcd.clear();
  lcd.print("WiFi Connected");
  delay(1000);

  lcd.clear();
  lcd.print("System Ready");
  delay(1000);
  lcd.clear();
}

// 🔥 SEND UID TO BACKEND AND DISPLAY RESPONSE
void sendToServer(String uid) {

  if (WiFi.status() != WL_CONNECTED) {
    lcd.clear();
    lcd.print("WiFi Error");
    Serial.println("WiFi not connected!");
    delay(2000);
    return;
  }

  HTTPClient http;
  http.setTimeout(10000);

  Serial.println("\n=== Sending RFID to Backend ===");
  Serial.println("URL: " + String(serverURL));
  Serial.println("UID: " + uid);

  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  String json = "{\"uid\":\"" + uid + "\"}";

  Serial.println("Payload: " + json);

  int httpCode = http.POST(json);

  lcd.clear();

  if (httpCode > 0) {
    Serial.println("HTTP Code: " + String(httpCode));

    String response = http.getString();
    Serial.println("Response: " + response);

    // Parse JSON response - increased buffer size for larger responses
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (!error) {
      const char* status = doc["status"] | "error";
      const char* name = doc["name"] | "Unknown";
      const char* action = doc["action"] | "No Action";

      Serial.println("Status: " + String(status));
      Serial.println("Name: " + String(name));
      Serial.println("Action: " + String(action));

      // Display on LCD based on status
      if (String(status) == "success") {
        // Successful check-in
        String displayName = String(name);
        if (displayName.length() > 16) {
          displayName = displayName.substring(0, 16);
        }
        lcd.setCursor(0, 0);
        lcd.print(displayName);

        String displayAction = String(action);
        if (displayAction.length() > 16) {
          displayAction = displayAction.substring(0, 16);
        }
        lcd.setCursor(0, 1);
        lcd.print(displayAction);
      } else if (String(status) == "duplicate") {
        // Already checked in
        String displayName = String(name);
        if (displayName.length() > 16) {
          displayName = displayName.substring(0, 16);
        }
        lcd.setCursor(0, 0);
        lcd.print(displayName);
        lcd.setCursor(0, 1);
        lcd.print("Already Scanned");
      } else if (String(status) == "pending") {
        // User not found - needs registration
        lcd.setCursor(0, 0);
        lcd.print("Not Registered");
        lcd.setCursor(0, 1);
        lcd.print("Register in App");
      } else {
        // Any other status
        lcd.setCursor(0, 0);
        lcd.print(String(name));
        lcd.setCursor(0, 1);
        lcd.print(String(action));
      }

    } else {
      Serial.println("JSON Parse Error: " + String(error.c_str()));
      lcd.setCursor(0, 0);
      lcd.print("JSON Error");
      lcd.setCursor(0, 1);
      lcd.print("Check Logs");
    }

  } else {
    Serial.println("HTTP Error: " + String(httpCode));
    lcd.setCursor(0, 0);
    lcd.print("Server Error");
    lcd.setCursor(0, 1);
    lcd.print("HTTP " + String(httpCode));
  }

  http.end();
  delay(3000);
  lcd.clear();
}

void loop() {

  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String uid = "";

  // Convert UID bytes to HEX string
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }

  uid.toUpperCase();

  Serial.println("\n=== RFID Card Detected ===");
  Serial.println("UID: " + uid);
  Serial.println("Size: " + String(rfid.uid.size) + " bytes");

  // Display scanning on LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Scanning...");
  lcd.setCursor(0, 1);
  // Show first 16 chars of UID
  if (uid.length() > 16) {
    lcd.print(uid.substring(0, 16));
  } else {
    lcd.print(uid);
  }

  delay(500);

  // Send to server
  sendToServer(uid);

  // Halt and wait for card removal
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}
