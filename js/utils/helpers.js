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
