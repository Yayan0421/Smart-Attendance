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

// 🔥 YOUR DEPLOYED BACKEND
const char* serverURL = "https://smart-attendance-89wy.onrender.com/rfid-scan";

void setup() {
  Serial.begin(115200);

  SPI.begin();
  rfid.PCD_Init();

  lcd.init();
  lcd.backlight();

  // Connect WiFi
  WiFi.begin(ssid, password);

  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi");

  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.println(WiFi.localIP());

  lcd.clear();
  lcd.print("WiFi Connected");
  delay(1000);

  lcd.clear();
  lcd.print("System Ready");
  delay(1000);
  lcd.clear();
}

// 🔥 SEND UID TO BACKEND
void sendToServer(String uid) {

  if (WiFi.status() != WL_CONNECTED) {
    lcd.clear();
    lcd.print("WiFi Error");
    return;
  }

  HTTPClient http;
  http.setTimeout(8000);

  http.begin(serverURL);
  http.addHeader("Content-Type", "application/json");

  String json = "{\"uid\":\"" + uid + "\"}";

  Serial.println("Sending: " + json);

  int httpCode = http.POST(json);

  lcd.clear();

  if (httpCode > 0) {

    String response = http.getString();
    Serial.println("Response: " + response);

    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, response);

    if (!error) {

      const char* status = doc["status"] | "error";
      const char* name = doc["name"] | "Unknown";
      const char* action = doc["action"] | "No Action";

      if (String(status) == "success") {
        lcd.print(name);
        lcd.setCursor(0, 1);
        lcd.print(action);
      } else {
        lcd.print("User Not Found");
      }

    } else {
      lcd.print("JSON Error");
    }

  } else {
    Serial.println("HTTP Error: " + String(httpCode));
    lcd.print("Server Error");
  }

  http.end();
  delay(2000);
  lcd.clear();
}

void loop() {

  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String uid = "";

  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(rfid.uid.uidByte[i], HEX);
  }

  uid.toUpperCase();

  Serial.println("UID: " + uid);

  lcd.clear();
  lcd.print("Scanning...");
  lcd.setCursor(0, 1);
  lcd.print(uid);

  delay(500);

  sendToServer(uid);

  rfid.PICC_HaltA();
}
