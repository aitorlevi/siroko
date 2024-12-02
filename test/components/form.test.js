import * as formJS from "../../js/components/form.js";
import * as helpersJS from "../../js/utils/helpers.js";

const stepDataMock = [
  {
    pill: "Paso 1 de 2",
    title: "¡Vamos allá!",
    copy: "Has llegado hasta el test de Siroko. Responde las siguientes preguntas y genera tu código premiado a medida.",
    label_step: "Uso siroko desde...",
  },
  {
    pill: "Paso 2 de 2",
    title: "Vamos, una más",
    copy: "",
    label_step: "Por unas gafas siroko, yo...",
  },
];

describe("Form Functionality", () => {
  beforeEach(() => {
    document.body.innerHTML = `
<form id="multiStepForm">
  <div class="step-form"></div>
  <div class="step-form"></div>
</form>
<div id="rewardContainer" style="display: none;"></div>
<div id="headerContent"></div>
<div id="stepPill"></div>
<div id="headerTitle"></div>
<div id="labelStep"></div>
<button id="nextButton"></button>
`;
    localStorage.clear();
    formJS.formState.currentStep = 0;
    formJS.formState.stepData = stepDataMock;
  });

  describe("saveData", () => {
    test("saveData stores the correct data in localStorage for step 0", () => {
      formJS.formState.currentStep = 0;
      document.body.innerHTML += `
          <input type="radio" name="year" value="2021" checked>
        `;
      formJS.saveData();
      expect(localStorage.getItem("year")).toBe("2021");
    });

    test("saveData stores the correct data in localStorage for step 1", () => {
      formJS.formState.currentStep = 1;
      document.body.innerHTML += `
          <input type="radio" name="action" value="actionValue" checked>
        `;
      formJS.saveData();
      expect(localStorage.getItem("action")).toBe("actionValue");
    });
  });

  describe("checkSelections", () => {
    test("returns true if all selections are made", () => {
      localStorage.setItem("year", "2021");
      localStorage.setItem("action", "run");
      expect(formJS.checkSelections()).toBe(true);
    });

    test("returns false if not all selections are made", () => {
      localStorage.setItem("year", "2021");
      expect(formJS.checkSelections()).toBe(false);
    });
  });

  describe("showReward", () => {
    test("showReward displays the reward container", () => {
      formJS.showReward();
      expect(document.getElementById("multiStepForm").style.display).toBe(
        "none"
      );
      expect(document.getElementById("rewardContainer").style.display).toBe(
        "flex"
      );
    });
  });

  describe("showStep", () => {
    test("showStep calls updateText and creates the header copy", () => {
      const updateTextMock = jest
        .spyOn(helpersJS, "updateText")
        .mockImplementation(() => {});
      formJS.showStep(0);
      expect(updateTextMock).toHaveBeenCalledWith(formJS.formState.stepData[0]);
      expect(document.getElementById("headerContent").textContent).toBe(
        formJS.formState.stepData[0].copy
      );
    });

    test("showStep calls updateText and updates the header copy", () => {
      document.body.innerHTML = `
        <form id="multiStepForm">
          <div class="step-form"></div>
          <div class="step-form"></div>
        </form>
        <div id="rewardContainer" style="display: none;"></div>
        <div id="headerContent"><span id="headerCopy"></span></div>
        <div id="stepPill"></div>
        <div id="headerTitle"></div>
        <div id="labelStep"></div>
        <button id="nextButton"></button>
        `;
      const updateTextMock = jest
        .spyOn(helpersJS, "updateText")
        .mockImplementation(() => {});

      formJS.showStep(0);
      expect(updateTextMock).toHaveBeenCalled();
      expect(document.getElementById("headerCopy").textContent).toBe(
        formJS.formState.stepData[0].copy
      );
    });
    test("remove the headerCopy", () => {
      delete formJS.formState.stepData[0].copy;
      const updateTextMock = jest
        .spyOn(helpersJS, "updateText")
        .mockImplementation(() => {});

      formJS.showStep(0);
      expect(updateTextMock).toHaveBeenCalled();
      expect(document.getElementById("headerCopy")).toBeNull();
    });
  });
});
