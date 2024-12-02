import * as rewardJS from "../../js/components/reward.js";
import * as alertJS from "../../js/utils/alert.js";
import * as helpersJS from "../../js/utils/helpers.js";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("sumLastTwoDigits", () => {
  test("should return the sum of the last two digits of a number", () => {
    expect(rewardJS.sumLastTwoDigits(12345)).toBe(9);
    expect(rewardJS.sumLastTwoDigits(9876)).toBe(13);
    expect(rewardJS.sumLastTwoDigits(100)).toBe(0);
  });

  test("should handle single-digit numbers", () => {
    expect(rewardJS.sumLastTwoDigits(5)).toBe(5);
  });

  test("should handle negative numbers", () => {
    expect(rewardJS.sumLastTwoDigits(-12345)).toBe(0);
  });
});

describe("getLastFourChars", () => {
  test("should return the last four characters of a string or less", () => {
    expect(rewardJS.getLastFourChars("1234567890")).toBe("7890");
    expect(rewardJS.getLastFourChars("abcd")).toBe("bcd");
  });

  test("should return an empty string if the input is not a string", () => {
    expect(rewardJS.getLastFourChars(12345)).toBe("");
    expect(rewardJS.getLastFourChars(null)).toBe("");
    expect(rewardJS.getLastFourChars(undefined)).toBe("");
  });
});

describe("generateCode", () => {
  beforeEach(() => {
    localStorage.setItem("year", "2023");
    localStorage.setItem("action", "actionTest");
    document.body.innerHTML = '<div id="rewardCode"></div>';
  });

  test("should generate the correct reward code", () => {
    rewardJS.generateCode();
    expect(document.getElementById("rewardCode").textContent).toBe("5Test");
  });
});

describe("startTimer", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="timerContainer">
        <span id="timerText"></span>
        <div id="timerExpired" style="display: none;"></div>
      </div>
    `;
  });

  test("should start the timer and update the DOM", () => {
    jest.useFakeTimers();
    rewardJS.startTimer();
    expect(document.getElementById("timerText").textContent).toBe("20:00");
    jest.advanceTimersByTime(1000);
    expect(document.getElementById("timerText").textContent).toBe("19:59");
    jest.advanceTimersByTime(20 * 60000);
    expect(
      document.getElementById("timerContainer").classList.contains("expired")
    ).toBe(true);
    expect(document.getElementById("timerExpired").style.display).toBe("block");
    jest.useRealTimers();
  });
});

describe("listenerButtons", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="copyButton"></button>
      <button id="sirokoButton"></button>
      <div id="rewardCode">testCode</div>
    `;
    localStorage.setItem("year", "2023");
    localStorage.setItem("action", "actionTest");
    rewardJS.generateCode();
  });

  test("should copy the reward code to clipboard", () => {
    const copyButton = document.getElementById("copyButton");
    navigator.clipboard = {
      writeText: jest.fn().mockResolvedValueOnce(),
    };
    rewardJS.listenerButtons();
    copyButton.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("5Test");
  });

  test("should open siroko.com in a new tab", () => {
    const sirokoButton = document.getElementById("sirokoButton");
    window.open = jest.fn();
    rewardJS.listenerButtons();
    sirokoButton.click();
    expect(window.open).toHaveBeenCalledWith("https://siroko.com/", "_blank");
  });
});

describe("onRewardContainerShown", () => {
  beforeEach(() => {
    fetch.resetMocks();
    document.body.innerHTML = '<div id="rewardCode"></div>';
  });

  test("should update text with fetched data", async () => {
    const generateCodeMock = jest
      .spyOn(rewardJS, "generateCode")
      .mockImplementation(() => {});
    await rewardJS.onRewardContainerShown();
    expect(generateCodeMock).toHaveBeenCalled();
  });

  test("should show alert on fetch error", async () => {
    fetch.mockReject(new Error("Fetch error"));
    const generateCodeMock = jest
      .spyOn(rewardJS, "generateCode")
      .mockImplementation(() => {});
    await rewardJS.onRewardContainerShown();
    expect(generateCodeMock).toHaveBeenCalled();
  });
});
