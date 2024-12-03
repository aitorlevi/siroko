import "./components/form.js";
import "./components/reward.js";
import "./components/alert.js";
import "./components/loading.js";

import "./utils/helpers.js";

/**
 * Clears localStorage when the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  localStorage.clear();
});
