const form = document.getElementById("multiStepForm");
const radioButtonsContainer = document.getElementById("radioButtonsContainer");
const stepPill = document.getElementById("stepPill");
const headerTitle = document.getElementById("headerTitle");
const labelStep = document.getElementById("labelStep");
const radioContainers = form.querySelectorAll(".radio-container");
let currentStep = 0,
  stepData = [];

document.addEventListener("DOMContentLoaded", () => {
  // Fetch form data from JSON file
  fetch("../../formData.json")
    .then((response) => response.json())
    .then((data) => {
      stepData = data.steps;

      // Show the initial step
      showStep(currentStep);
    })
    .catch((error) => console.error("Error fetching form data:", error));
});

// Function to save data based on the current step
const saveData = () => {
  switch (currentStep) {
    case 0:
      localStorage.setItem(
        "selectedYear",
        document.querySelector("input[name='year']:checked").value
      );
      break;
    case 1:
      localStorage.setItem(
        "selectedAction",
        document.querySelector("input[name='action']:checked").value
      );
      break;
    default:
      return;
  }
  nextStep();
};

// Function to move to the next step
export const nextStep = () => {
  if (currentStep < stepData.length - 1) {
    currentStep++;
    showStep(currentStep);
  } else {
    checkSelections() && showReward();
  }
};

// Function to check if selections are in localStorage
const checkSelections = () => {
  const selectedYear = localStorage.getItem("selectedYear");
  const selectedAction = localStorage.getItem("selectedAction");
  return selectedYear !== null && selectedAction !== null;
};

// Function to show the reward container and hide the form
const showReward = () => {
  form.style.display = "none";
  document.getElementById("rewardContainer").style.display = "block";
};

// Function to display the current step
const showStep = (stepNumber) => {
  const step = stepData[stepNumber];
  form.querySelectorAll(".step-form").forEach((stepElement, index) => {
    stepElement.style.display = index === stepNumber ? "flex" : "none";
  });

  stepPill.textContent = step.pill;
  headerTitle.textContent = step.title;
  labelStep.textContent = step.label_step;

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

  // Add event listeners to radio-container elements
  radioContainers.forEach((container) => {
    const radioInput = container.querySelector("input[type='radio']");
    container.addEventListener("click", () => {
      if (radioInput) {
        radioInput.checked = true;
        radioInput.dispatchEvent(new Event("change"));
      }
    });

    // Update the background color on change
    radioInput.addEventListener("change", () => {
      radioContainers.forEach((element) =>
        element.classList.remove("selected")
      );
      if (radioInput.checked) {
        container.classList.add("selected");
      }
    });
  });
};

// Add event listeners to next buttons
document.querySelectorAll(".next-button").forEach((button) => {
  button.addEventListener("click", () => {
    saveData();
  });
});
