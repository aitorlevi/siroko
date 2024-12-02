import { sumLastTwoDigits, getLastFourChars } from "../../js/components/reward";

describe("sumLastTwoDigits", () => {
  test("should return the sum of the last two digits of a number", () => {
    expect(sumLastTwoDigits(12345)).toBe(9);
    expect(sumLastTwoDigits(9876)).toBe(13);
    expect(sumLastTwoDigits(100)).toBe(0);
  });

  test("should handle single-digit numbers", () => {
    expect(sumLastTwoDigits(5)).toBe(5); // 5
  });

  test("should handle negative numbers", () => {
    expect(sumLastTwoDigits(-12345)).toBe(0); // 4 + 5 = 9
  });
});

describe("getLastFourChars", () => {
  test("should return the last four characters of a string or less", () => {
    expect(getLastFourChars("1234567890")).toBe("7890");
    expect(getLastFourChars("abcd")).toBe("bcd");
  });

  test("should return an empty string if the input is not a string", () => {
    expect(getLastFourChars(12345)).toBe("");
    expect(getLastFourChars(null)).toBe("");
    expect(getLastFourChars(undefined)).toBe("");
  });
});
