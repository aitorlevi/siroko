const form = document.getElementById("multiStepForm");
const radioButtonsContainer = document.getElementById("radioButtonsContainer");
const stepPill = document.getElementById("stepPill");
const headerTitle = document.getElementById("headerTitle");
const labelStep = document.getElementById("labelStep");
let radioContainers = null,
  currentStep = 0,
  stepData = [];

document.addEventListener("DOMContentLoaded", () => {
  // Fetch form data from JSON file
  fetch("../../formData.json")
    .then((response) => response.json())
    .then((data) => {
      stepData = data.steps;

      // Create fieldsets for each step
      stepData.forEach((step, index) => {
        const fieldset = document.createElement("fieldset");
        fieldset.classList.add("form-step");
        fieldset.id = `step${index}`;
        radioButtonsContainer.appendChild(fieldset);
      });

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
const nextStep = () => {
  if (currentStep < stepData.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
};

// Function to display the current step
const showStep = (stepNumber) => {
  const step = stepData[stepNumber];
  form.querySelectorAll(".form-step").forEach((stepElement, index) => {
    stepElement.style.display = index === stepNumber ? "flex" : "none";
  });
  const currentFieldset = document.getElementById(`step${currentStep}`);

  stepPill.textContent = step.pill;
  headerTitle.textContent = step.title;
  labelStep.textContent = step.step_label;

  if (step.copy) {
    const headerCopyContainer = document.createElement("span");
    headerCopyContainer.classList.add("copy");
    headerCopyContainer.id = "headerCopy";
    headerCopyContainer.textContent = step.copy;
    document.getElementById("headerContent").appendChild(headerCopyContainer);
  } else {
    const headerCopyContainer = document.getElementById("headerCopy");
    if (headerCopyContainer) {
      headerCopyContainer.remove();
    }
  }

  // Add options to the current step
  step.options.forEach((option, index) => {
    let optionContainer = document.createElement("span");

    optionContainer.classList.add("radio-container");
    if (index === 0) optionContainer.classList.add("selected");

    optionContainer.innerHTML = `
      <input type="radio" name="${step.option_name}" value="${option.value}" ${
      index === 0 ? "checked" : ""
    } />
      <label for="${option.value}">${option.label}</label>
    `;
    currentFieldset.appendChild(optionContainer);
  });

  radioContainers = form.querySelectorAll(".radio-container");

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
