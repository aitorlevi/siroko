import * as FormJS from "../../js/components/form.js";
import * as HelpersJS from "../../js/utils/helpers.js";

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

afterEach(() => {
  jest.restoreAllMocks();
});

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
  FormJS.formState.currentStep = 0;
  FormJS.formState.stepData = stepDataMock;
});

test("DOMContentLoaded changes", () => {
  document.addEventListener("DOMContentLoaded", () => {
    const spyshowFormData = jest
      .spyOn(FormJS, "showFormData")
      .mockImplementation(() => {});
    const spySetupRadioContainers = jest
      .spyOn(FormJS, "setupRadioContainers")
      .mockImplementation(() => {});

    expect(spyshowFormData).toHaveBeenCalled();
    expect(spySetupRadioContainers).toHaveBeenCalled();
  });
});

describe("showFormData", () => {
  test("should update text with fetched data", async () => {
    const spyFetchData = jest
      .spyOn(HelpersJS, "fetchData")
      .mockReturnValueOnce({ steps: "test" });
    await FormJS.showFormData();
    expect(spyFetchData).toHaveBeenCalled();
    expect(FormJS.formState.stepData).toBe("test");
  });

  test("should show alert on fetch error", async () => {
    FormJS.formState.stepData = null;
    const spyFetchData = jest
      .spyOn(HelpersJS, "fetchData")
      .mockReturnValueOnce(null);
    await FormJS.showFormData();
    expect(spyFetchData).toHaveBeenCalled();
    expect(FormJS.formState.stepData).toBe(null);
  });
});

describe("setupNextButton", () => {
  test("setupNextButton adds an event listener to the next button", () => {
    FormJS.setupNextButton();
    document.getElementById("nextButton").click();
    expect(FormJS.formState.currentStep).toBe(1);
  });
});

describe("setupRadioContainers", () => {
  test("setupRadioContainers adds event listeners to radio containers", () => {
    document.body.innerHTML += `
        <div class="radio-container">
          <input type="radio" checked>
          <input type="radio">
          <input type="radio">
          <input type="radio">
        </div>
      `;
    FormJS.setupRadioContainers();
    document.querySelector(".radio-container").click();
    expect(document.querySelector(".radio-container input").checked).toBe(true);
  });
});

describe("saveData", () => {
  test("saveData stores the correct data in localStorage for step 0", () => {
    FormJS.formState.currentStep = 0;
    document.body.innerHTML += `
          <input type="radio" name="year" value="2021" checked>
        `;
    FormJS.saveData();
    expect(localStorage.getItem("year")).toBe("2021");
  });

  test("saveData stores the correct data in localStorage for step 1", () => {
    FormJS.formState.currentStep = 1;
    document.body.innerHTML += `
          <input type="radio" name="action" value="actionValue" checked>
        `;
    FormJS.saveData();
    expect(localStorage.getItem("action")).toBe("actionValue");
  });
});

describe("checkSelections", () => {
  test("returns true if all selections are made", () => {
    localStorage.setItem("year", "2021");
    localStorage.setItem("action", "run");
    expect(FormJS.checkSelections()).toBe(true);
  });

  test("returns false if not all selections are made", () => {
    localStorage.setItem("year", "2021");
    expect(FormJS.checkSelections()).toBe(false);
  });
});

describe("showReward", () => {
  test("showReward displays the reward container", () => {
    FormJS.showReward();
    expect(document.getElementById("multiStepForm").style.display).toBe("none");
    expect(document.getElementById("rewardContainer").style.display).toBe(
      "flex"
    );
  });
});

describe("showStep", () => {
  test("Calls updateText and creates the header copy", () => {
    const updateTextMock = jest
      .spyOn(HelpersJS, "updateText")
      .mockImplementation(() => {});
    FormJS.showStep(0);
    expect(updateTextMock).toHaveBeenCalledWith(FormJS.formState.stepData[0]);
    expect(document.getElementById("headerContent").textContent).toBe(
      FormJS.formState.stepData[0].copy
    );
  });

  test("Calls updateText and updates the header copy", () => {
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
      .spyOn(HelpersJS, "updateText")
      .mockImplementation(() => {});

    FormJS.showStep(0);
    expect(updateTextMock).toHaveBeenCalled();
    expect(document.getElementById("headerCopy").textContent).toBe(
      FormJS.formState.stepData[0].copy
    );
  });

  test("remove the headerCopy", () => {
    delete FormJS.formState.stepData[0].copy;
    const updateTextMock = jest
      .spyOn(HelpersJS, "updateText")
      .mockImplementation(() => {});

    FormJS.showStep(0);
    expect(updateTextMock).toHaveBeenCalled();
    expect(document.getElementById("headerCopy")).toBeNull();
  });
});
