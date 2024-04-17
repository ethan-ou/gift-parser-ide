import fs from "node:fs";
import path from "node:path";
import textSplit from "../../src/parser/textSection";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("Split Module", () => {
  const folderPath = path.join(__dirname, "/mocks/textSection");

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
    //fs.writeFileSync(expectedPath, JSON.stringify(split(text)));

    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));
    it(`Parses ${file}`, () => {
      assert.deepStrictEqual(textSplit(text), expected);
    });
  });
});
