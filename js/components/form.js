import * as HelpersJS from "../utils/helpers.js";
export const formState = {
  currentStep: 0,
  stepData: [],
};

/**
 * Fetches form data and initializes the form steps.
 */
document.addEventListener("DOMContentLoaded", () => {
  showFormData();
  setupRadioContainers();
});

/**
 * Fetches form data from the specified URL.
 */
export const showFormData = async () => {
  const data = await HelpersJS.fetchData();
  if (data && data.steps) {
    formState.stepData = data.steps;
    showStep(formState.currentStep);
    setupNextButton();
  }
};

/**
 * Sets up the event listener for the next button.
 */
export const setupNextButton = () => {
  HelpersJS.addClickListener(
    document.getElementById("nextButton"),
    saveData,
    "No se han podido guardar los datos"
  );
};

/**
 * Sets up event listeners for radio containers.
 */
export const setupRadioContainers = () => {
  document.querySelectorAll(".radio-container").forEach((container) => {
    const radioInput = container.querySelector("input[type='radio']");
    HelpersJS.addClickListener(
      container,
      () => handleRadioClick(radioInput),
      "No se ha podido seleccionar la opción"
    );
    radioInput.addEventListener("change", () =>
      handleRadioChange(radioInput, container)
    );
  });
};

/**
 * Handles the click event on a radio container.
 *
 * @param {HTMLInputElement} radioInput - The radio input element.
 */
const handleRadioClick = (radioInput) => {
  if (radioInput) {
    radioInput.checked = true;
    radioInput.dispatchEvent(new Event("change"));
  }
};

/**
 * Handles the change event on a radio input element.
 *
 * @param {HTMLInputElement} radioInput - The radio input element.
 * @param {HTMLElement} container - The container element.
 */
const handleRadioChange = (radioInput, container) => {
  document
    .querySelectorAll(".radio-container")
    .forEach((element) => element.classList.remove("selected"));
  if (radioInput.checked) {
    container.classList.add("selected");
  }
};

/**
 * Saves data to localStorage based on the current step.
 */
export const saveData = () => {
  if (formState.currentStep === 0) {
    saveToLocalStorage("year", "input[name='year']:checked");
  } else {
    saveToLocalStorage("action", "input[name='action']:checked");
  }
  nextStep();
};

/**
 * Saves the selected value of the specified input to localStorage.
 *
 * @param {string} key - The key to save the value under.
 * @param {string} selector - The selector for the input element.
 */
const saveToLocalStorage = (key, selector) => {
  localStorage.setItem(key, document.querySelector(selector)?.value || "");
};

/**
 * Moves to the next step in the form.
 */
export const nextStep = () => {
  if (formState.currentStep < formState.stepData.length - 1) {
    formState.currentStep++;
    showStep(formState.currentStep);
  } else {
    checkSelections() && showReward();
  }
};

/**
 * Checks if all required selections are made.
 *
 * @returns {boolean} True if all required selections are made, false otherwise.
 */
export const checkSelections = () => {
  const selectedYear = localStorage.getItem("year");
  const selectedAction = localStorage.getItem("action");
  return selectedYear !== null && selectedAction !== null;
};

/**
 * Displays the reward container.
 */
export const showReward = () => {
  HelpersJS.updateDOMElement("multiStepForm", "none", "style", "display");
  HelpersJS.updateDOMElement("rewardContainer", "flex", "style", "display");
};

/**
 * Displays the current step in the form.
 *
 * @param {number} stepNumber - The step number to display.
 */
export const showStep = (stepNumber) => {
  const step = formState.stepData[stepNumber];
  const stepElements = document.querySelectorAll("div.step-form");

  stepElements.forEach((stepElement, index) => {
    stepElement.style.display = index === stepNumber ? "flex" : "none";
    if (index === stepNumber) {
      const radioContainer = stepElement.querySelector(".radio-container");
      if (radioContainer) {
        radioContainer.classList.add("selected");
      }
    }
  });

  HelpersJS.updateText(step);
  updateHeaderCopy(step.copy);
};

/**
 * Updates the header copy text.
 *
 * @param {string} copy - The copy text to display.
 */
export const updateHeaderCopy = (copy) => {
  if (copy) {
    if (document.getElementById("headerCopy") === null) {
      const headerCopyContainer = document.createElement("span");
      headerCopyContainer.classList.add("copy");
      headerCopyContainer.id = "headerCopy";
      headerCopyContainer.textContent = copy;
      document.getElementById("headerContent").appendChild(headerCopyContainer);
    } else {
      document.getElementById("headerCopy").textContent = copy;
    }
  } else {
    const headerCopyContainer = document.getElementById("headerCopy");
    if (headerCopyContainer) {
      headerCopyContainer.remove();
    }
  }
};
