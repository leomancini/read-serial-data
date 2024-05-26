// Buttons
const int buttonPins[] = {3, 5, 7, 15, 14, 16};
const int numButtons = 6;
int buttonState[numButtons];

// Potentiometers
const int potPins[] = {A0, A1, A2, A3, A6, A7, A8, A9, A10};
const int numPots = 9;
int potValue[numPots];

void setup() {
  Serial.begin(9600);
  
  for (int i = 0; i < numButtons; i++) {
    pinMode(buttonPins[i], INPUT_PULLUP);
  }
  
  for (int i = 0; i < numPots; i++) {
    pinMode(potPins[i], INPUT);
  }
}

void loop() {
  for (int i = 0; i < numButtons; i++) {
    buttonState[i] = digitalRead(buttonPins[i]);

    Serial.print("button_");
    Serial.print(i + 1);
    Serial.print("=");
    Serial.print(buttonState[i] == LOW ? "true" : "false");
    Serial.print(";");
  }

  for (int i = 0; i < numPots; i++) {
    potValue[i] = analogRead(potPins[i]);
    Serial.print("potentiometer_");
    Serial.print(i + 1);
    Serial.print("=");
    Serial.print(potValue[i]);
    Serial.print(";");
  }
  
  Serial.println("");
  delay(100);
}
