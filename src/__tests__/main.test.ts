import fs from "fs";
import path from "path";
import Parser, { parser } from "../index";

describe("Exports Parser: Correct Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/pass");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const text = fs.readFileSync(filePath, "utf-8");

    it(`Class Error Parser: ${file}`, () => {
      const GIFTParser = new Parser();
      expect(GIFTParser.update(text)).toEqual([]);
    });

    it(`Function Error Parser: ${file}`, () => {
      expect(parser(text)).toEqual([]);
    });
  });
});

describe("Exports Parser: Error Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/error");

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
      const GIFTParser = new Parser();
      expect(GIFTParser.update(text)).toEqual(expected);
    });

    it(`Function Error Parser: ${file}`, () => {
      expect(parser(text)).toEqual(expected);
    });
  });
});

// Simulates situation with incremental parsing.
describe("Exports Parser: Incremental Parsing Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/incremental");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  const GIFTParser = new Parser();

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
      expect(GIFTParser.update(text)).toEqual(expected);
    });
  });
});
