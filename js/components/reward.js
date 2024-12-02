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
const generateCode = () => {
  const year = sumLastTwoDigits(parseInt(localStorage.getItem("year")));
  const action = getLastFourChars(localStorage.getItem("action"));
  codeGenerated = `${year}${action}`;
  document.getElementById("rewardCode").textContent = codeGenerated;
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
const startTimer = () => {
  const timerElement = document.getElementById("timerText");
  let timeLeft = 0.5 * 60;

  const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    if (timeLeft > 0) {
      timeLeft--;
      setTimeout(updateTimer, 1000);
    } else {
      document.getElementById("timerContainer").classList.add("expired");
      timerElement.remove();
      document.getElementById("timerExpired").style.display = "block";
    }
  };

  updateTimer();
};

/**
 * Adds event listeners to buttons for copying code and opening a URL.
 */
const listenerButtons = () => {
  const copyButton = document.getElementById("copyButton");
  const sirokoButton = document.getElementById("sirokoButton");
  if (copyButton) {
    copyButton.addEventListener("click", () => {
      navigator.clipboard
        .writeText(codeGenerated)
        .then(() => {
          showAlert("info", "¡Código copiado en el portapapeles!");
        })
        .catch((err) => {
          showAlert("error", "Failed to copy code.");
        });
    });
  } else {
    showAlert("error", "Failed to copy code.");
  }
  if (sirokoButton) {
    sirokoButton.addEventListener("click", () => {
      window.open("https://siroko.com/", "_blank");
    });
  } else {
    showAlert("info", "Fallo al abrir siroko.com");
  }
};
