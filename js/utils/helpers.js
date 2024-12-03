import * as AlertJS from "./alert.js";
/**
 * Updates the text content of specific elements on the page.
 *
 * @param {Object} newData - The new data to update the text content with.
 * @param {string} newData.pill - The new text content for the element with id "stepPill".
 * @param {string} newData.title - The new text content for the element with id "headerTitle".
 * @param {string} newData.label_step - The new text content for the element with id "labelStep".
 */
export const updateText = (newData) => {
  const stepPill = document.getElementById("stepPill");
  const headerTitle = document.getElementById("headerTitle");
  const labelStep = document.getElementById("labelStep");

  if (stepPill) stepPill.textContent = newData.pill;
  if (headerTitle) headerTitle.textContent = newData.title;
  if (labelStep) labelStep.textContent = newData.label_step;
};

export const fetchData = async () => {
  try {
    const response = await fetch("../../formData.json");
    if (!response.ok) {
      AlertJS.showAlert(
        "error",
        "Ha habido un problema al cargar los datos. Por favor inténtalo de nuevo."
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    AlertJS.showAlert(
      "error",
      "Ha habido un problema al cargar los datos. Por favor inténtalo de nuevo."
    );
    return null;
  }
};

/**
 * Adds a click event listener to a button and shows an alert if the button is not found.
 *
 * @param {HTMLElement} element - The element.
 * @param {Function} callback - The callback function to execute on click.
 * @param {string} errorMessage - The error message to show if the button is not found.
 */
export const addClickListener = (element, callback, errorMessage) => {
  if (element) {
    element.addEventListener("click", callback);
  } else {
    AlertJS.showAlert("error", errorMessage);
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
export const updateDOMElement = (
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
