import fs from "fs";
import { GIFTQuestion } from "gift-pegjs";
import path from "path";
import GIFTParser, { parser } from "../src/";
import { describe, it } from "node:test";
import assert from "node:assert";

// Temporarily remove tags and id since they require rework of comments
function removeTagsandId(GIFTQuestions: GIFTQuestion[]) {
  for (let i = 0; i < GIFTQuestions.length; i++) {
    if (GIFTQuestions[i].hasOwnProperty("tags")) {
      GIFTQuestions[i].tags = null;
    }
    if (GIFTQuestions[i].hasOwnProperty("id")) {
      GIFTQuestions[i].id = null;
    }
  }
  return GIFTQuestions;
}

describe("Exports Parser: Correct Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/main/pass");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const text = fs.readFileSync(filePath, "utf-8");
    const expectedPath = path.join(
      folderPath,
      `${path.basename(file, ".gift")}.json`,
    );

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Class Error Parser: ${file}`, () => {
      const Parser = new GIFTParser();
      assert.deepStrictEqual(Parser.update(text).errorOnly(), []);
      assert.deepStrictEqual(
        Parser.update(text).parseOnly(),
        removeTagsandId(expected),
      );
    });

    it(`Function Error Parser: ${file}`, () => {
      assert.deepStrictEqual(parser.errorOnly(text), []);
      assert.deepStrictEqual(parser.parseOnly(text), removeTagsandId(expected));
    });
  });
});

describe("Exports Parser: Error Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/main/error");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      folderPath,
      `${path.basename(file, ".gift")}.json`,
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // fs.writeFileSync(expectedPath, JSON.stringify(parser.errorOnly(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Class Error Parser: ${file}`, () => {
      const Parser = new GIFTParser();
      assert.deepStrictEqual(Parser.update(text).errorOnly(), expected);
    });

    it(`Function Error Parser: ${file}`, () => {
      assert.deepStrictEqual(parser.errorOnly(text), expected);
    });
  });
});

// Simulates situation with incremental parsing.
describe("Exports Parser: Incremental Parsing Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/main/incremental");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  const Parser = new GIFTParser();

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      folderPath,
      `${path.basename(file, ".gift")}.json`,
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // fs.writeFileSync(expectedPath, JSON.stringify(parser.errorOnly(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));
    it(`Class Incremental Parsing: ${file}`, () => {
      assert.deepStrictEqual(
        Parser.update(text).errorOnly(),
        removeTagsandId(expected),
      );
    });
  });
});
