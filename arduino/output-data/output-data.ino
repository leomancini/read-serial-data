// Constants for the pin numbers
const int buttonPins[] = {3, 5, 7, 15, 14, 16};
const int numButtons = 6;
int buttonState[numButtons]; // Array to hold the read values

void setup() {
Serial.begin(9600); // Start serial communication at 9600 baud.

// Initialize each button pin as an input with the internal pull-up resistor
for (int i = 0; i < numButtons; i++) {
pinMode(buttonPins[i], INPUT_PULLUP);
}
}

void loop() {
// Read each button state and print it
for (int i = 0; i < numButtons; i++) {
// Read the button state
buttonState[i] = digitalRead(buttonPins[i]);

// Print the state to the Serial Monitor
Serial.print("Button ");
Serial.print(i + 1);
Serial.print(": ");
Serial.println(buttonState[i] == LOW ? "Pressed" : "Not Pressed");
}

// Add a delay to reduce the output frequency
delay(100);
}
