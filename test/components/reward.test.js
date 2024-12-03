import * as RewardJS from "../../js/components/reward.js";
import * as AlertJS from "../../js/utils/alert.js";
import * as HelpersJS from "../../js/utils/helpers.js";

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {
      this.callback([{ isIntersecting: true }]);
    }
    unobserve() {}
    disconnect() {}
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("reward container observer", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="rewardContainer"></div>';
  });

  test("should call onRewardContainerShown and listenerButtons when reward container is shown", () => {
    const spyOnRewardContainerShown = jest
      .spyOn(RewardJS, "onRewardContainerShown")
      .mockImplementation(() => {});
    const spyListenerButtons = jest
      .spyOn(RewardJS, "listenerButtons")
      .mockImplementation(() => {});

    const rewardContainer = document.getElementById("rewardContainer");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          RewardJS.onRewardContainerShown();
          RewardJS.listenerButtons();
        }
      });
    });
    observer.observe(rewardContainer);

    observer.callback([{ isIntersecting: true }]);

    expect(spyOnRewardContainerShown).toHaveBeenCalled();
    expect(spyListenerButtons).toHaveBeenCalled();
    observer.disconnect();
  });
});

describe("onRewardContainerShown", () => {
  test("should update text with fetched data", async () => {
    const spyFetchData = jest
      .spyOn(HelpersJS, "fetchData")
      .mockReturnValueOnce({ reward: "test" });
    const spyUpdateText = jest
      .spyOn(HelpersJS, "updateText")
      .mockImplementation(() => {});
    await RewardJS.onRewardContainerShown();
    expect(spyFetchData).toHaveBeenCalled();
    expect(spyUpdateText).toHaveBeenCalled();
  });

  test("should show alert on fetch error", async () => {
    const spyFetchData = jest
      .spyOn(HelpersJS, "fetchData")
      .mockReturnValueOnce(null);
    const spyUpdateText = jest
      .spyOn(HelpersJS, "updateText")
      .mockImplementation(() => {});
    await RewardJS.onRewardContainerShown();
    expect(spyFetchData).toHaveBeenCalled();
    expect(spyUpdateText).not.toHaveBeenCalled();
  });
});

describe("sumLastTwoDigits", () => {
  test("should return the sum of the last two digits of a number", () => {
    expect(RewardJS.sumLastTwoDigits(12345)).toBe(9);
    expect(RewardJS.sumLastTwoDigits(9876)).toBe(13);
    expect(RewardJS.sumLastTwoDigits(100)).toBe(0);
  });

  test("should handle single-digit numbers", () => {
    expect(RewardJS.sumLastTwoDigits(5)).toBe(5);
  });

  test("should handle negative numbers", () => {
    expect(RewardJS.sumLastTwoDigits(-12345)).toBe(0);
  });
});

describe("getLastFourChars", () => {
  test("should return the last four characters of a string or less", () => {
    expect(RewardJS.getLastFourChars("1234567890")).toBe("7890");
    expect(RewardJS.getLastFourChars("abcd")).toBe("bcd");
  });

  test("should return an empty string if the input is not a string", () => {
    expect(RewardJS.getLastFourChars(12345)).toBe("");
    expect(RewardJS.getLastFourChars(null)).toBe("");
    expect(RewardJS.getLastFourChars(undefined)).toBe("");
  });
});

describe("generateCode", () => {
  beforeEach(() => {
    localStorage.setItem("year", "2023");
    localStorage.setItem("action", "actionTest");
    document.body.innerHTML = '<div id="rewardCode"></div>';
  });

  test("should generate the correct reward code", () => {
    RewardJS.generateCode();
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
    RewardJS.startTimer();
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
    RewardJS.generateCode();
  });

  test("should copy the reward code to clipboard", () => {
    const copyButton = document.getElementById("copyButton");
    navigator.clipboard = {
      writeText: jest.fn().mockResolvedValueOnce(),
    };
    RewardJS.listenerButtons();
    copyButton.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("5Test");
  });

  test("should open siroko.com in a new tab", () => {
    const sirokoButton = document.getElementById("sirokoButton");
    window.open = jest.fn();
    RewardJS.listenerButtons();
    sirokoButton.click();
    expect(window.open).toHaveBeenCalledWith("https://siroko.com/", "_blank");
  });
});
