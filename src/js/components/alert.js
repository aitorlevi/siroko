/**
 * Displays an alert message on the screen.
 *
 * @param {string} type - The type of alert (e.g., 'success', 'error', 'warning').
 * @param {string} message - The message to display in the alert.
 */
export const showAlert = (type, message) => {
  const alertContainer = document.createElement("div");
  alertContainer.className = `alert alert-${type}`;
  alertContainer.textContent = message;
  alertContainer.setAttribute("role", "alert");

  const existingAlert = document.querySelector(".alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  document.body.appendChild(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 3000);
};
