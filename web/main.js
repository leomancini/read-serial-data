function updateDebugView(label, value, backgroundColor, textColor) {
  let element = document.querySelector(`#${label} .value`);
  element.innerText = value;
  element.style.backgroundColor = backgroundColor;
  element.style.color = textColor;
}

window.addEventListener("DOMContentLoaded", () => {
  let previousValue = window.PrototypeA1;
  setInterval(() => {
    if (window.PrototypeA1 !== previousValue) {
      for (const label in window.PrototypeA1) {
        let value = window.PrototypeA1[label].value;
        let backgroundColor = window.PrototypeA1[label].backgroundColor;
        let textColor = window.PrototypeA1[label].textColor;
        updateDebugView(label, value, backgroundColor, textColor);
      }
      previousValue = window.PrototypeA1;
    }
  }, 100); // Adjust the interval as needed
});
