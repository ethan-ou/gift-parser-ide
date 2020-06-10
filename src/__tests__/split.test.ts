import split from "../split";
import mocks from "./mocks";

describe("split", () => {
  it("returns nothing if no scopes on a single line", () => {
    expect(split(mocks[2].text)).toEqual([
      {
        end: 4,
        start: 1,
        text: `::This is a real question:: {\n      Normally there's content in here.\n    }`,
      },
      {
        end: 8,
        start: 5,
        text: `    But not today. {\n\n    }`,
      },
      {
        end: 15,
        start: 8,
        text: `    Oh look a missing bracket! {\n      \n      \n      \n    And another question {\n      \n    }`,
      },
    ]);
  });

  it("returns if a scope is on a single line", () => {
    expect(split(mocks[3].text)).toEqual([
      {
        end: 1,
        start: 0,
        text: "A single line scope {}",
      },
    ]);
  });
});
