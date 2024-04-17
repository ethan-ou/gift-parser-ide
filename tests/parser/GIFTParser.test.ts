import fs from "node:fs";
import path from "node:path";
import parser from "../../src/parser/GIFTParser";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("PEG Parser Module: Pass Mocks", () => {
  const folderPath = path.join(__dirname, "../mocks/main/pass");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks/GIFTParser/pass"),
      `${path.basename(file, ".gift")}.json`,
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // fs.writeFileSync(expectedPath, JSON.stringify(parser(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Parses ${file}`, () => {
      assert.deepStrictEqual(parser(text), expected);
    });
  });
});

describe("PEG Parser Module: Error Mocks", () => {
  const folderPath = path.join(__dirname, "../mocks/main/error");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".gift");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks/GIFTParser/error"),
      `${path.basename(file, ".gift")}.json`,
    );

    const text = fs.readFileSync(filePath, "utf-8");

    // Write new tests to directory.
    // fs.writeFileSync(expectedPath, JSON.stringify(parser(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    it(`Parses ${file}`, () => {
      assert.deepStrictEqual(
        JSON.parse(JSON.stringify(parser(text))),
        expected,
      );
    });
  });
});
