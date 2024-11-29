import { updateText } from "../utils/helpers.js";
import { showAlert } from "../utils/alert.js";
let codeGenerated = "";

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

export const onRewardContainerShown = () => {
  fetch("../../formData.json")
    .then((response) => response.json())
    .then((data) => {
      updateText(data.reward);
    })
    .catch((error) => {
      showAlert(
        "error",
        "Ha habido un problema al cargar los datos. Por favor intentalo de nuevo."
      );
    });
  generateCode();
  startTimer();
};

const generateCode = () => {
  const year = sumLastTwoDigits(parseInt(localStorage.getItem("year")));
  const action = getLastFourChars(localStorage.getItem("action"));
  codeGenerated = `${year}${action}`;
  document.getElementById("rewardCode").textContent = codeGenerated;
};

const sumLastTwoDigits = (number) => {
  const lastTwoDigits = number % 100;
  const tens = Math.floor(lastTwoDigits / 10);
  const units = lastTwoDigits % 10;
  return tens + units;
};

const getLastFourChars = (str) => {
  const filteredStr = str.replace(/[aA\s]/g, "");
  return filteredStr.slice(-4);
};

const startTimer = () => {
  const timerElement = document.getElementById("timerText");
  let timeLeft = 20 * 60;

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
