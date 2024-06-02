// Check if Web Serial API is supported
if ("serial" in navigator) {
  console.log("Web Serial API is supported!");
} else {
  console.log(
    "Web Serial API is not supported. Try using Google Chrome or Microsoft Edge."
  );
  alert(
    "Web Serial API not supported. Try using Google Chrome or Microsoft Edge."
  );
}

// Function to request access and open the serial port
async function connectSerial() {
  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    document.getElementById("connect").style.display = "none";
    document.querySelector("h2").innerText = "Connected";
    return port;
  } catch (error) {
    console.error("There was an error opening the serial port:", error);
  }
}

// Function to automatically connect to a specific serial device
async function autoConnectSerial(vendorId, productId) {
  try {
    // Get all serial ports with permission
    const ports = await navigator.serial.getPorts();
    let targetPort = null;

    // Check if any of the ports matches the desired device
    for (const port of ports) {
      const info = port.getInfo();
      if (info.usbVendorId === vendorId && info.usbProductId === productId) {
        targetPort = port;
        break;
      }
    }

    if (targetPort) {
      console.log("Device found and attempting to connect...");
      await targetPort.open({ baudRate: 9600 });
      console.log("Connected to the specific USB device automatically.");
      document.getElementById("connect").style.display = "none";
      document.querySelector("h2").innerText = "Connected";
      return targetPort;
    } else {
      document.getElementById("connect").style.display = "inline-block";
      console.log("Specific USB device not found or not previously granted.");
    }
  } catch (error) {
    console.error(
      "There was an error connecting to the specific USB device:",
      error
    );
  }
}

// Function to start communication automatically on page load
document.addEventListener("DOMContentLoaded", (event) => {
  // Call the autoConnectSerial function with the specific Vendor ID and Product ID
  autoConnectSerial(9025, 32822)
    .then((port) => {
      if (port) {
        // If the device is connected, start reading from it
        readSerialData(port);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

// Function to read data from the serial port
async function readSerialData(port) {
  const reader = port.readable.getReader();
  let receivedBuffer = new Uint8Array(); // Buffer to hold the stream data

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // The reader has been closed, possibly by another process or because the device was disconnected
        console.log("Stream closed");
        if (receivedBuffer.length > 0) {
          // Process any remaining data in the buffer
          processSerialData(receivedBuffer);
        }
        break;
      }
      if (value) {
        // Append new data to the buffer
        receivedBuffer = new Uint8Array([...receivedBuffer, ...value]);

        // Process the buffer if we find a delimiter, for example, a newline
        let delimiterIndex = receivedBuffer.indexOf(10); // ASCII value for newline is 10
        while (delimiterIndex !== -1) {
          const completeData = receivedBuffer.slice(0, delimiterIndex + 1);
          processSerialData(completeData);
          receivedBuffer = receivedBuffer.slice(delimiterIndex + 1);
          delimiterIndex = receivedBuffer.indexOf(10);
        }
      }
    }
  } catch (error) {
    console.error("Error reading from serial port:", error);
  } finally {
    reader.releaseLock();
  }
}

function convertRange(value, r1, r2) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

function processSerialData(data) {
  window["PM001"] = [];
  let string = new TextDecoder().decode(data);

  if (string) {
    let dataStrings = string.split(";");

    for (const dataString of dataStrings) {
      if (dataString !== "\r\n") {
        let labelValuePair = dataString.split("=");
        let label = labelValuePair[0];
        let value;
        window["PM001"][label] = {};
        let backgroundColor;
        let textColor;
        if (label.includes("button_")) {
          value = labelValuePair[1] === "true" ? true : false;
          backgroundColor = value ? "black" : "white";
          textColor = value ? "white" : "black";
        } else if (label.includes("potentiometer_")) {
          value = parseInt(labelValuePair[1]);
          backgroundColor = `rgba(0, 0, 0, ${convertRange(
            value,
            [0, 1023],
            [0, 1]
          )})`;
          let textColorValue = convertRange(value, [0, 1023], [0, 255]);
          textColor = `rgb(${textColorValue},${textColorValue},${textColorValue})`;
        }

        updateWindowVariable(label, value, backgroundColor, textColor);
      }
    }
  }
}

function updateWindowVariable(label, value, backgroundColor, textColor) {
  window["PM001"][label] = {
    value: value,
    backgroundColor: backgroundColor,
    textColor: textColor,
  };
}

// Combines connecting and reading into one function
async function startSerialCommunication() {
  const port = await connectSerial();
  if (port) {
    port.ondisconnect = (event) => {
      console.log("Device disconnected:", event);
    };
    await readSerialData(port);
  }
}

// Event listener for button click
document.getElementById("connect").addEventListener("click", startSerialCode);

function startSerialCode() {
  startSerialCommunication().catch((error) =>
    console.error("Failed to read from serial:", error)
  );
}
