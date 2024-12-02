import { updateText } from "../utils/helpers.js";
const form = document.getElementById("multiStepForm");
const radioContainers = form.querySelectorAll(".radio-container");
let currentStep = 0,
  stepData = [];

/**
 * Fetches form data and initializes the form steps.
 */
document.addEventListener("DOMContentLoaded", () => {
  fetch("../../formData.json")
    .then((response) => response.json())
    .then((data) => {
      stepData = data.steps;
      showStep(currentStep);
    })
    .catch((error) => console.error("Error fetching form data:", error));

  /**
   * Event listener for the next button to save data and move to the next step.
   */
  document.getElementById("nextButton").addEventListener("click", () => {
    saveData();
  });

  /**
   * Selects the first radio input element within the specified container.
   *
   * @type {HTMLInputElement}
   */
  radioContainers.forEach((container) => {
    const radioInput = container.querySelector("input[type='radio']");
    container.addEventListener("click", () => {
      if (radioInput) {
        radioInput.checked = true;
        radioInput.dispatchEvent(new Event("change"));
      }
    });

    /**
     * Event listener for the radio input element to update the selected container.
     */
    radioInput.addEventListener("change", () => {
      radioContainers.forEach((element) =>
        element.classList.remove("selected")
      );
      if (radioInput.checked) {
        container.classList.add("selected");
      }
    });
  });
});

/**
 * Saves data to localStorage based on the current step.
 */
const saveData = () => {
  switch (currentStep) {
    case 0:
      localStorage.setItem(
        "year",
        document.querySelector("input[name='year']:checked").value
      );
      break;
    case 1:
      localStorage.setItem(
        "action",
        document.querySelector("input[name='action']:checked").value
      );
      break;
    default:
      return;
  }
  nextStep();
};

/**
 * Moves to the next step in the form.
 */
export const nextStep = () => {
  if (currentStep < stepData.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    checkSelections() && showReward();
  }
};

/**
 * Checks if all required selections are made.
 *
 * @returns {boolean} True if all required selections are made, false otherwise.
 */
const checkSelections = () => {
  const selectedYear = localStorage.getItem("year");
  const selectedAction = localStorage.getItem("action");
  return selectedYear !== null && selectedAction !== null;
};

/**
 * Displays the reward container.
 */
const showReward = () => {
  form.style.display = "none";
  document.getElementById("rewardContainer").style.display = "flex";
};

/**
 * Displays the current step in the form.
 *
 * @param {number} stepNumber - The step number to display.
 */
const showStep = (stepNumber) => {
  const step = stepData[stepNumber];
  form.querySelectorAll(".step-form").forEach((stepElement, index) => {
    stepElement.style.display = index === stepNumber ? "flex" : "none";
  });

  updateText(step);

  if (step.copy) {
    if (document.getElementById("headerCopy") === null) {
      const headerCopyContainer = document.createElement("span");
      headerCopyContainer.classList.add("copy");
      headerCopyContainer.id = "headerCopy";
      headerCopyContainer.textContent = step.copy;
      document.getElementById("headerContent").appendChild(headerCopyContainer);
    } else {
      document.getElementById("headerCopy").textContent = step.copy;
    }
  } else {
    const headerCopyContainer = document.getElementById("headerCopy");
    if (headerCopyContainer) {
      headerCopyContainer.remove();
    }
  }
};
