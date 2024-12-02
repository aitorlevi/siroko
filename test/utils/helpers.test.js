import { updateText } from "../../js/utils/helpers";

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
    updateText(newData);
    expect(document.getElementById("stepPill").textContent).toBe("Step 1");
    expect(document.getElementById("headerTitle").textContent).toBe("Welcome");
    expect(document.getElementById("labelStep").textContent).toBe(
      "Step 1 of 3"
    );
  });
});
