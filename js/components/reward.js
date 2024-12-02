import { updateText } from "../utils/helpers.js";
import { showAlert } from "../utils/alert.js";
let codeGenerated = "";

/**
 * Initializes the observer for the reward container.
 */
document.addEventListener("DOMContentLoaded", () => {
  const rewardContainer = document.getElementById("rewardContainer");
  if (rewardContainer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onRewardContainerShown();
          listenerButtons();
          observer.unobserve(rewardContainer);
        }
      });
    });

    observer.observe(rewardContainer);
  }
});

/**
 * Handles actions when the reward container is shown.
 */
export const onRewardContainerShown = () => {
  fetch("../../formData.json")
    .then((response) => response.json())
    .then((data) => {
      updateText(data.reward);
    })
    .catch((error) => {
      showAlert(
        "error",
        "Ha habido un problema al cargar los datos. Por favor inténtalo de nuevo."
      );
    });
  generateCode();
  startTimer();
};

/**
 * Generates a reward code and updates the DOM.
 */
export const generateCode = () => {
  const year = sumLastTwoDigits(parseInt(localStorage.getItem("year")));
  const action = getLastFourChars(localStorage.getItem("action"));
  codeGenerated = `${year}${action}`;
  updateDOMElement("rewardCode", codeGenerated);
};

/**
 * Sums the last two digits of a number.
 *
 * @param {number} number - The number to process.
 * @returns {number} The sum of the last two digits.
 */
export const sumLastTwoDigits = (number) => {
  if (number > 10) {
    const lastTwoDigits = number % 100;
    const tens = Math.floor(lastTwoDigits / 10);
    const units = lastTwoDigits % 10;
    return tens + units;
  } else if (number > 0) {
    return number;
  } else {
    return 0;
  }
};

/**
 * Gets the last four characters of a string, excluding 'a', 'A', and spaces.
 *
 * @param {string} str - The string to process.
 * @returns {string} The last four characters of the filtered string.
 */
export const getLastFourChars = (str) => {
  if (typeof str === "string") {
    const filteredStr = str.replace(/[aA\s]/g, "");
    return filteredStr.slice(-4);
  } else {
    return "";
  }
};

/**
 * Starts a countdown timer and updates the DOM.
 */
export const startTimer = () => {
  const timerElement = document.getElementById("timerText");
  let timeLeft = 20 * 60;

  const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    updateDOMElement(
      "timerText",
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    );
    if (timeLeft > 0) {
      timeLeft--;
      setTimeout(updateTimer, 1000);
    } else {
      document.getElementById("timerContainer").classList.add("expired");
      timerElement.remove();
      updateDOMElement("timerExpired", "block", "style", "display");
    }
  };

  updateTimer();
};

/**
 * Adds event listeners to buttons for copying code and opening a URL.
 */
export const listenerButtons = () => {
  const copyButton = document.getElementById("copyButton");
  const sirokoButton = document.getElementById("sirokoButton");
  addClickListener(
    copyButton,
    () => {
      navigator.clipboard
        .writeText(codeGenerated)
        .then(() => {
          showAlert("info", "¡Código copiado en el portapapeles!");
        })
        .catch((err) => {
          showAlert("error", "Failed to copy code.");
        });
    },
    "Failed to copy code."
  );
  addClickListener(
    sirokoButton,
    () => {
      window.open("https://siroko.com/", "_blank");
    },
    "Fallo al abrir siroko.com"
  );
};

/**
 * Adds a click event listener to a button and shows an alert if the button is not found.
 *
 * @param {HTMLElement} button - The button element.
 * @param {Function} callback - The callback function to execute on click.
 * @param {string} errorMessage - The error message to show if the button is not found.
 */
const addClickListener = (button, callback, errorMessage) => {
  if (button) {
    button.addEventListener("click", callback);
  } else {
    showAlert("error", errorMessage);
  }
};

/**
 * Updates the content or style of a DOM element.
 *
 * @param {string} elementId - The ID of the DOM element.
 * @param {string} value - The value to set.
 * @param {string} [property="textContent"] - The property to update (default is "textContent").
 * @param {string} [styleProperty] - The style property to update (if applicable).
 */
const updateDOMElement = (
  elementId,
  value,
  property = "textContent",
  styleProperty
) => {
  const element = document.getElementById(elementId);
  if (element) {
    if (styleProperty) {
      element.style[styleProperty] = value;
    } else {
      element[property] = value;
    }
  }
};
