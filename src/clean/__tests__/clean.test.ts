import clean from "../index";
import mocks from "../../__tests__/mocks";

describe("clean", () => {
  it("correctly cleans and returns text", () => {
    expect(clean(mocks[5].text)).toEqual(`\n    \n    \n    Question {}`);
  });
});
