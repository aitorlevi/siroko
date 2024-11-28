document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("multiStepForm");
  const stepPill = document.getElementById("stepPill");
  const headerTitle = document.getElementById("headerTitle");
  const headerCopy = document.getElementById("headerCopy");
  const labelStep = document.getElementById("labelStep");
  let radioContainers = null,
    currentStep = 0,
    selectedYear = 0,
    selectedAction = "";

  // Fetch form data from JSON file
  fetch("../../formData.json")
    .then((response) => response.json())
    .then((data) => {
      const stepData = data.steps;

      // Create fieldsets for each step
      stepData.forEach((step, index) => {
        const fieldset = document.createElement("fieldset");
        fieldset.classList.add("form-step");
        fieldset.id = `step${index}`;
        form.appendChild(fieldset);
      });

      // Function to display the current step
      const showStep = (stepNumber) => {
        const step = stepData[stepNumber];
        form.querySelectorAll(".form-step").forEach((stepElement, index) => {
          stepElement.style.display = index === stepNumber ? "flex" : "none";
        });
        const currentFieldset = document.getElementById(`step${currentStep}`);

        stepPill.textContent = step.pill;
        headerTitle.textContent = step.title;
        headerCopy.textContent = step.copy;
        labelStep.textContent = step.step_label;

        // Add options to the current step
        step.options.forEach((option, index) => {
          let optionContainer = document.createElement("span");

          optionContainer.classList.add("radio-container");
          if (index === 0) optionContainer.classList.add("selected");

          optionContainer.innerHTML = `
            <input type="radio" name="${step.option_name}" value="${
            option.value
          }" ${index === 0 ? "checked" : ""} />
            <label for="${option.value}">${option.label}</label>
          `;
          currentFieldset.appendChild(optionContainer);
        });

        // Add next button to the current step
        let button = document.createElement("button");
        button.classList.add("button", "next-button");
        button.onclick = (e) => {
          e.preventDefault();
          saveData();
        };
        button.innerHTML = `
          <span>${step.button_copy}</span>
          <span><img src="./assets/images/arrow.svg" /></span>
        `;
        currentFieldset.appendChild(button);

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

      // Show the initial step
      showStep(currentStep);

      // Function to move to the next step
      const nextStep = () => {
        if (currentStep < stepData.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      };

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
    })
    .catch((error) => console.error("Error fetching form data:", error));
});
