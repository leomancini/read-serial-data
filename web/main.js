function updateDebugView(label, value, backgroundColor, textColor) {
  let element = document.querySelector(`#${label} .value`);
  element.innerText = value;
  element.style.backgroundColor = backgroundColor;
  element.style.color = textColor;
}

window.addEventListener("DOMContentLoaded", () => {
  let previousValue = window.PM001;
  setInterval(() => {
    if (window.PM001 !== previousValue) {
      for (const label in window.PM001) {
        let value = window.PM001[label].value;
        let backgroundColor = window.PM001[label].backgroundColor;
        let textColor = window.PM001[label].textColor;
        updateDebugView(label, value, backgroundColor, textColor);
      }
      previousValue = window.PM001;
    }
  }, 100); // Adjust the interval as needed
});
