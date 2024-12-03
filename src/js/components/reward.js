import * as HelpersJS from "../utils/helpers.js";
import * as AlertJS from "./alert.js";
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
export const onRewardContainerShown = async () => {
  const data = await HelpersJS.fetchData();
  if (data && data.reward) {
    HelpersJS.updateText(data.reward);
    generateCode();
    startTimer();
  }
};

/**
 * Generates a reward code and updates the DOM.
 */
export const generateCode = () => {
  const year = sumLastTwoDigits(parseInt(localStorage.getItem("year")));
  const action = getLastFourChars(localStorage.getItem("action"));
  codeGenerated = `${year}${action}`;
  HelpersJS.updateDOMElement("rewardCode", codeGenerated);
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
    HelpersJS.updateDOMElement(
      "timerText",
      `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    );
    if (timeLeft > 0) {
      timeLeft--;
      setTimeout(updateTimer, 1000);
    } else {
      document.getElementById("timerContainer").classList.add("expired");
      timerElement.remove();
      HelpersJS.updateDOMElement("timerExpired", "block", "style", "display");
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
  HelpersJS.addClickListener(
    copyButton,
    () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(codeGenerated)
          .then(() => {
            AlertJS.showAlert("info", "¡Código copiado en el portapapeles!");
          })
          .catch((err) => {
            AlertJS.showAlert("error", "Fallo al copiar el código.");
          });
      } else {
        AlertJS.showAlert(
          "error",
          "La API de portapapeles no está disponible."
        );
      }
    },
    "Ha habido un fallo al copiar el código."
  );
  HelpersJS.addClickListener(
    sirokoButton,
    () => {
      window.open("https://siroko.com/", "_blank");
    },
    "Fallo al abrir siroko.com"
  );
};
