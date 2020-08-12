import fs from "fs";
import path from "path";
import GIFTParser, { parser } from "../index";

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
      `${path.basename(file, ".gift")}.json`
    );

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Class Error Parser: ${file}`, () => {
      const Parser = new GIFTParser();
      expect(Parser.update(text).errorOnly()).toEqual([]);
      expect(Parser.update(text).parseOnly()).toEqual(expected);
    });

    it(`Function Error Parser: ${file}`, () => {
      expect(parser.errorOnly(text)).toEqual([]);
      expect(parser.parseOnly(text)).toEqual(expected);
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
      `${path.basename(file, ".gift")}.json`
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // const GIFT = new Parser();
    // fs.writeFileSync(expectedPath, JSON.stringify(GIFT.update(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Class Error Parser: ${file}`, () => {
      const Parser = new GIFTParser();
      expect(Parser.update(text).errorOnly()).toEqual(expected);
    });

    it(`Function Error Parser: ${file}`, () => {
      expect(parser.errorOnly(text)).toEqual(expected);
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
      `${path.basename(file, ".gift")}.json`
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // fs.writeFileSync(expectedPath, JSON.stringify(parser(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));
    it(`Class Incremental Parsing: ${file}`, () => {
      expect(Parser.update(text).errorOnly()).toEqual(expected);
    });
  });
});
