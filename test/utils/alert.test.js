import { showAlert } from "../../js/utils/alert";

describe("Alert Functions", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should show alert correctly", () => {
    showAlert("success", "Test Alert");
    const alertContainer = document.querySelector(".alert.alert-success");
    expect(alertContainer).not.toBeNull();
    expect(alertContainer.textContent).toBe("Test Alert");
  });

  test("should remove the alert and create another", () => {
    document.body.innerHTML =
      '<div class="alert alert-success">Existing Alert</div>';
    showAlert("success", "Test Alert");
    const alertContainer = document.querySelector(".alert.alert-success");
    expect(alertContainer).not.toBeNull();
    expect(alertContainer.textContent).toBe("Test Alert");
  });

  test("should hide alert after 3 seconds", () => {
    jest.useFakeTimers();
    showAlert("success", "Test Alert");
    const alertContainer = document.querySelector(".alert.alert-success");
    expect(alertContainer).not.toBeNull();
    jest.advanceTimersByTime(3000);
    expect(document.querySelector(".alert.alert-success")).toBeNull();
  });
});
