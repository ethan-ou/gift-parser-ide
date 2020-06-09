import parse from "../index";

describe("it works", () => {
  it("Parses", () => {
    expect(parse("text")).toEqual({
      error: null,
      parse: [
        {
          hasEmbeddedAnswers: false,
          stem: {
            format: "moodle",
            text: "text",
          },
          title: null,
          type: "Description",
        },
      ],
    });
  });
  it("Creates an error", () => {
    expect(parse("text :")).toEqual({
      error: {
        expected: [
          {
            ignoreCase: false,
            text: "{",
            type: "literal",
          },
        ],
        found: ":",
        location: {
          start: { offset: 5, line: 1, column: 6 },
          end: { offset: 6, line: 1, column: 7 },
        },
        message: `Expected "{" but ":" found.`,
      },
      parse: null,
    });
  });
});
