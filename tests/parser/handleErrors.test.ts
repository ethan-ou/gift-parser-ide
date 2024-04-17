import fs from "fs";
import path from "path";
import handleErrors, {
  handleSingleError,
  correctMessage,
} from "../../src/parser/handleErrors";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("Error Module: Mocks", () => {
  const folderPath = path.join(__dirname, "/mocks/handleErrors/input");

  const files = fs
    .readdirSync(folderPath, "utf-8")
    .filter((file) => path.extname(file) === ".json");

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const expectedPath = path.join(
      path.join(__dirname, "/mocks/handleErrors/expected"),
      `${path.basename(file)}`,
    );

    const text = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const expected = JSON.parse(fs.readFileSync(expectedPath, "utf-8"));

    const originalText = text.location.text;
    // fs.writeFileSync(
    //   expectedPath,
    //   JSON.stringify(handleSingleError(text, originalText, "\n"))
    // );

    it(`Parses ${file}`, () => {
      assert.deepStrictEqual(
        JSON.parse(JSON.stringify(handleSingleError(text, originalText, "\n"))),
        expected,
      );
    });
  });
});
