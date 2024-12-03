import * as HelpersJS from "../../js/utils/helpers";
import * as AlertJS from "../../js/utils/alert";

describe("Helper Functions", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span id="stepPill"></span>
      <h2 id="headerTitle"></h2>
      <span id="labelStep"></span>
    `;
  });

  test("should update text content of specific elements", () => {
    const newData = {
      pill: "Step 1",
      title: "Welcome",
      label_step: "Step 1 of 3",
    };
    HelpersJS.updateText(newData);
    expect(document.getElementById("stepPill").textContent).toBe("Step 1");
    expect(document.getElementById("headerTitle").textContent).toBe("Welcome");
    expect(document.getElementById("labelStep").textContent).toBe(
      "Step 1 of 3"
    );
  });

  test("should fetch data successfully", async () => {
    const mockData = { key: "value" };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );

    const data = await HelpersJS.fetchData();
    expect(data).toEqual(mockData);
  });

  test("should handle fetch error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Fetch error")));

    const data = await HelpersJS.fetchData();
    expect(data).toBeNull();
  });

  test("should handle non-ok response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const data = await HelpersJS.fetchData();
    expect(data).toBeNull();
  });
});

describe("addClickListener", () => {
  test("should add click event listener to button", () => {
    const button = document.createElement("button");
    const callback = jest.fn();
    document.body.appendChild(button);
    HelpersJS.addClickListener(button, callback, "Error message");
    button.click();
    expect(callback).toHaveBeenCalled();
  });

  test("should show alert if button is not found", () => {
    const spyShowAlert = jest
      .spyOn(AlertJS, "showAlert")
      .mockImplementation(() => {});
    HelpersJS.addClickListener(null, jest.fn(), "Error message");
    expect(spyShowAlert).toHaveBeenCalledWith("error", "Error message");
  });
});

describe("updateDOMElement", () => {
  test("should update textContent of a DOM element", () => {
    document.body.innerHTML = '<div id="testElement"></div>';
    HelpersJS.updateDOMElement("testElement", "newValue");
    expect(document.getElementById("testElement").textContent).toBe("newValue");
  });

  test("should update style property of a DOM element", () => {
    document.body.innerHTML = '<div id="testElement"></div>';
    HelpersJS.updateDOMElement("testElement", "block", "style", "display");
    expect(document.getElementById("testElement").style.display).toBe("block");
  });
});
