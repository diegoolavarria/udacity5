import { checkForName } from "../src/client/js/nameChecker.js";

describe("Testing the submit functionality", () => {
  test("Testing the checkForName() function", (done) => {
    expect(checkForName).toBeDefined();
    done();
  });

  test("Testing short input", (done) => {
    expect(checkForName("test")).toBeFalsy();
    done();
  });

  test("Testing longer input", (done) => {
    expect(checkForName("longer input")).toBeTruthy();
    done();
  });
});
