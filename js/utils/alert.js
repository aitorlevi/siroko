export const showAlert = (type, message) => {
  const alertContainer = document.createElement("div");
  alertContainer.className = `alert alert-${type}`;
  alertContainer.textContent = message;

  document.body.appendChild(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 3000);
};
