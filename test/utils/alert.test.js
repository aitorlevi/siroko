import * as AlertJS from "../../js/utils/alert";

describe("Alert Functions", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should show alert correctly", () => {
    AlertJS.showAlert("success", "Test Alert");
    const alertContainer = document.querySelector(".alert.alert-success");
    expect(alertContainer).not.toBeNull();
    expect(alertContainer.textContent).toBe("Test Alert");
  });

  test("should remove the alert and create another", () => {
    document.body.innerHTML =
      '<div class="alert alert-success">Existing Alert</div>';
    AlertJS.showAlert("success", "Test Alert");
    const alertContainer = document.querySelector(".alert.alert-success");
    expect(alertContainer).not.toBeNull();
    expect(alertContainer.textContent).toBe("Test Alert");
  });

  test("should hide alert after 3 seconds", () => {
    jest.useFakeTimers();
    AlertJS.showAlert("success", "Test Alert");
    const alertContainer = document.querySelector(".alert.alert-success");
    expect(alertContainer).not.toBeNull();
    jest.advanceTimersByTime(3000);
    expect(document.querySelector(".alert.alert-success")).toBeNull();
  });
});
